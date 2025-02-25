package de.tum.in.www1.artemis.service.connectors;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.actuate.health.Health;
import org.springframework.boot.actuate.health.Status;

import de.tum.in.www1.artemis.AbstractSpringIntegrationBambooBitbucketJiraTest;
import de.tum.in.www1.artemis.connector.athene.AtheneRequestMockProvider;
import de.tum.in.www1.artemis.service.connectors.athene.AtheneHealthIndicator;

public class AtheneHealthIndicatorTest extends AbstractSpringIntegrationBambooBitbucketJiraTest {

    @Autowired
    private AtheneRequestMockProvider atheneRequestMockProvider;

    @Autowired
    private AtheneHealthIndicator atheneHealthIndicator;

    @BeforeEach
    public void initTestCase() {
        atheneRequestMockProvider.enableMockingOfRequests();
    }

    @AfterEach
    public void tearDown() {
        atheneRequestMockProvider.reset();
    }

    @Test
    void healthUp() {
        atheneRequestMockProvider.mockQueueStatus(true);
        final Health health = atheneHealthIndicator.health();
        assertThat(health.getStatus()).isEqualTo(Status.UP);
    }

    @Test
    void healthDown() {
        atheneRequestMockProvider.mockQueueStatus(false);
        final Health health = atheneHealthIndicator.health();
        assertThat(health.getStatus()).isEqualTo(Status.DOWN);
    }
}
