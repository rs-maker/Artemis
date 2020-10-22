package de.tum.in.www1.artemis.config;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

import javax.security.auth.Subject;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import de.tum.in.www1.artemis.web.rest.CourseResource;

/**
 * This starter is supposed to invoke all REST calls once to significantly improve the user experience and performance when they invoke the call the first time
 * also see https://stackoverflow.com/questions/57312745
 */
// TODO: make sure this is not executed in the tests
@Component
@Profile("prod")
// @Profile("dev")
public class AppStartupRunner implements ApplicationRunner {

    @Value("${artemis.user-management.internal-admin.username:#{null}}")
    private Optional<String> artemisInternalAdminUsername;

    private final CourseResource courseResource;

    public AppStartupRunner(CourseResource courseResource) {
        this.courseResource = courseResource;
    }

    // @Transactional
    @Override
    public void run(ApplicationArguments args) throws Exception {
        SecurityContext context = SecurityContextHolder.getContext();
        context.setAuthentication(new Authentication() {

            @Override
            public String getName() {
                return "AppStartupRunner";
            }

            @Override
            public boolean implies(Subject subject) {
                return false;
            }

            @Override
            public Collection<? extends GrantedAuthority> getAuthorities() {
                return List.of(new SimpleGrantedAuthority("ROLE_ADMIN"), new SimpleGrantedAuthority("ROLE_INSTRUCTOR"), new SimpleGrantedAuthority("ROLE_TA"),
                        new SimpleGrantedAuthority("ROLE_USER"));
            }

            @Override
            public Object getCredentials() {
                return null;
            }

            @Override
            public Object getDetails() {
                return null;
            }

            @Override
            public Object getPrincipal() {
                return artemisInternalAdminUsername.orElse("artemis_admin");
            }

            @Override
            public boolean isAuthenticated() {
                return true;
            }

            @Override
            public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException {
            }
        });
        courseResource.getAllCoursesForDashboard();
        // TODO: basically go through all REST Resources and call the GET, PUT, POST and DELETE methods in a way that there is no actual influence
        // [Make the calls]

        // TransactionAspectSupport.currentTransactionStatus().setRollbackOnly();
        context.setAuthentication(null);
    }
}
