package de.tum.in.www1.artemis.service.connectors.jenkins.jobs;

import java.util.Set;

import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;

public class JenkinsJobPermissionsUtils {

    public static void removePermissionsFromFolder(Document jobConfig, Set<JenkinsJobPermission> permissionsToRemove, Set<String> userLogins) {
        var folderAuthorizationMatrix = "com.cloudbees.hudson.plugins.folder.properties.AuthorizationMatrixProperty";
        removePermissionsFromElement(folderAuthorizationMatrix, jobConfig, permissionsToRemove, userLogins);
    }

    public static void removePermissionsFromJob(Document jobConfig, Set<JenkinsJobPermission> permissionsToRemove, Set<String> userLogins) {
        var jobAuthorizationMatrix = "hudson.security.AuthorizationMatrixProperty";
        removePermissionsFromElement(jobAuthorizationMatrix, jobConfig, permissionsToRemove, userLogins);
    }

    /**
     * Removes the specified permissions belonging to all specified users from the xml document. Permission
     * elements must be children of the AuthorizationMatrixProperty element. Doesn't do anything
     * if AuthorizationMatrixProperty is missing.
     *
     * @param document The xml document
     * @param permissionsToRemove  a list of permissions to remove from the user
     * @param userLogins  the logins of the users to remove the permissions from
     */
    private static void removePermissionsFromElement(String elementTagName, Document document, Set<JenkinsJobPermission> permissionsToRemove, Set<String> userLogins) {
        var authorizationMatrixElement = document.getElementsByTag(elementTagName).first();
        if (authorizationMatrixElement == null) {
            return;
        }

        permissionsToRemove.forEach(jenkinsJobPermission -> {
            userLogins.forEach(userLogin -> {
                // The permission in the xml node has the format: com.jenkins.job.permission:user-login
                var permission = jenkinsJobPermission.getName() + ":" + userLogin;
                authorizationMatrixElement.getElementsContainingOwnText(permission).remove();
            });
        });
    }

    public static void addPermissionsToFolder(Document folderConfig, Set<JenkinsJobPermission> jenkinsJobPermissions, Set<String> userLogins) {
        var folderAuthorizationMatrix = "com.cloudbees.hudson.plugins.folder.properties.AuthorizationMatrixProperty";
        addPermissionsToDocument(folderAuthorizationMatrix, folderConfig, jenkinsJobPermissions, userLogins);
    }

    public static void addPermissionsToJob(Document jobConfig, Set<JenkinsJobPermission> jenkinsJobPermissions, Set<String> userLogins) {
        var jobAuthorizationMatrix = "hudson.security.AuthorizationMatrixProperty";
        addPermissionsToDocument(jobAuthorizationMatrix, jobConfig, jenkinsJobPermissions, userLogins);
    }

    /**
     * Adds all jenkinsJobPermissions for all specific Jenkins users into the xml document.
     *
     * @param document the xml document
     * @param jenkinsJobPermissions a list of Jenkins job permissions to be added for the specific user
     * @param userLogins the login names of the users
     */
    private static void addPermissionsToDocument(String elementTagName, Document document, Set<JenkinsJobPermission> jenkinsJobPermissions, Set<String> userLogins) {
        var authorizationMatrixElement = JenkinsJobPermissionsUtils.getOrCreateAuthorizationMatrixPropertyElement(elementTagName, document);
        userLogins.forEach(userLogin -> addPermissionsToAuthorizationMatrix(authorizationMatrixElement, jenkinsJobPermissions, userLogin));
        JenkinsJobPermissionsUtils.addAuthorizationMatrixToDocument(authorizationMatrixElement, document);
    }

    /**
     * Retrieves the AuthorizationMatrixProperty element from the document if it exists or creates a new one
     * pre-configured with matrixauth.inheritance.InheritParentStrategy.
     * @param document The xml document
     * @return AuthorizationMatrixProperty element
     */
    private static Element getOrCreateAuthorizationMatrixPropertyElement(String authorizationMatrixTagName, Document document) {
        var authorizationMatrixElement = document.getElementsByTag(authorizationMatrixTagName).first();
        if (authorizationMatrixElement != null) {
            return authorizationMatrixElement;
        }

        // Create the element
        var strategyElement = new Element("inheritanceStrategy").addClass("org.jenkinsci.plugins.matrixauth.inheritance.InheritParentStrategy");
        authorizationMatrixElement = new Element(authorizationMatrixTagName);
        strategyElement.appendTo(authorizationMatrixElement);
        return authorizationMatrixElement;
    }

    /**
     * Adds all jenkinsJobPermissions specified for the specific Jenkins user into the authorizationMatrixElement.
     * The resulting output element has the following format:
     * <pre>
     * {@code
     *      <com.cloudbees.hudson.plugins.folder.properties.AuthorizationMatrixProperty>
     *          ...existing permissions
     *          <permission>hudson.model.the.jenkins.permission1:userLogin</permission>
     *          ...
     *          <permission>hudson.model.the.jenkins.permissionn:userLogin</permission>
     *      </com.cloudbees.hudson.plugins.folder.properties.AuthorizationMatrixProperty>
     * }
     * </pre>
     * @param authorizationMatrixElement the com.cloudbees.hudson.plugins.folder.properties.AuthorizationMatrixProperty element
     * @param jenkinsJobPermissions      a list of Jenkins job permissions to be added for the specific user
     * @param userLogin                  the login name of the user
     */
    private static void addPermissionsToAuthorizationMatrix(Element authorizationMatrixElement, Set<JenkinsJobPermission> jenkinsJobPermissions, String userLogin) {
        var existingPermissionElements = authorizationMatrixElement.getElementsByTag("permission");
        jenkinsJobPermissions.forEach(jenkinsJobPermission -> {
            // The permission in the xml node has the format: com.jenkins.job.permission:user-login
            var permission = jenkinsJobPermission.getName() + ":" + userLogin;

            // Add the permission if it doesn't exist.
            var permissionDoesntExist = existingPermissionElements.stream().noneMatch(element -> element.text().equals(permission));
            if (permissionDoesntExist) {
                // Permission element has format <permission>com.jenkins.job.permission:user-login</permission>
                var permissionElement = new Element("permission").appendText(permission);
                permissionElement.appendTo(authorizationMatrixElement);
            }
        });
    }

    /**
     * Adds the authorizationMatrixElement into the document. The function checks the document if the properties
     * element exist and creates one if it doesn't. The authorizationMatrixElement must be a child if this tag.
     *
     * @param authorizationMatrixElement the com.cloudbees.hudson.plugins.folder.properties.AuthorizationMatrixProperty element
     * @param document                   the Jenkins Job config.xml
     */
    private static void addAuthorizationMatrixToDocument(Element authorizationMatrixElement, Document document) {
        // The authorization matrix is stored inside the <properties/> tag within the document. Either find it
        // or create a new one.
        var propertyElement = document.getElementsByTag("properties").first();
        if (propertyElement == null) {
            propertyElement = new Element("properties");
            propertyElement.appendTo(document);
        }

        authorizationMatrixElement.appendTo(propertyElement);
    }
}
