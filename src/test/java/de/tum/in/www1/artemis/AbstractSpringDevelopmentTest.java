package de.tum.in.www1.artemis;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;

import de.tum.in.www1.artemis.util.DatabaseUtilService;
import de.tum.in.www1.artemis.util.RequestUtilService;

@SpringBootTest(classes = ArtemisApp.class)
@AutoConfigureMockMvc
// The profile 'testcontainers' enables tests against production database types rather than H2, using Testcontainers
@ActiveProfiles({ "artemis", "bamboo", "bitbucket", "jira", "ldap", "scheduling", "athene", "testcontainers" })
@TestPropertySource(properties = "artemis.user-management.use-external=false")
public class AbstractSpringDevelopmentTest {

    @Autowired
    protected DatabaseUtilService database;

    @Autowired
    protected RequestUtilService request;
}
