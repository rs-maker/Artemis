package de.tum.in.www1.artemis;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.Arrays;
import java.util.HashSet;
import java.util.Set;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.test.context.support.WithMockUser;

import de.tum.in.www1.artemis.domain.*;
import de.tum.in.www1.artemis.repository.AchievementRepository;
import de.tum.in.www1.artemis.repository.CourseRepository;
import de.tum.in.www1.artemis.repository.ParticipationRepository;
import de.tum.in.www1.artemis.repository.UserRepository;
import de.tum.in.www1.artemis.service.AchievementService;
import de.tum.in.www1.artemis.service.CourseService;
import de.tum.in.www1.artemis.util.DatabaseUtilService;
import de.tum.in.www1.artemis.util.RequestUtilService;

public class AchievementIntegrationTest extends AbstractSpringIntegrationBambooBitbucketJiraTest {

    @Autowired
    DatabaseUtilService database;

    @Autowired
    RequestUtilService request;

    @Autowired
    AchievementService achievementService;

    @Autowired
    CourseService courseService;

    @Autowired
    UserRepository userRepository;

    @Autowired
    AchievementRepository achievementRepository;

    @Autowired
    CourseRepository courseRepository;

    @Autowired
    ParticipationRepository participationRepository;

    private User student;

    private User instructor;

    private Course firstCourse;

    private Course secondCourse;

    private Exercise firstExercise;

    @BeforeEach
    public void initTestCase() {
        var users = database.addUsers(1, 0, 1);
        student = users.get(0);
        instructor = users.get(1);
        instructor.setGroups(new HashSet<>(Arrays.asList("instructor")));
        firstCourse = database.addCourseWithModelingAndTextAndFileUploadExercise();
        firstCourse.setHasAchievements(true);
        courseRepository.save(firstCourse);
        secondCourse = database.addCourseWithModelingAndTextAndFileUploadExercise();
        firstExercise = firstCourse.getExercises().stream().findFirst().get();

        achievementService.generateForCourse(firstCourse);
        achievementService.generateForCourse(secondCourse);
        achievementService.generateForExercise(firstCourse, firstExercise);
    }

    @AfterEach
    public void resetDatabase() {
        database.resetDatabase();
    }

    @Test
    @WithMockUser(value = "student1", roles = "ADMIN")
    public void testDeleteUser() throws Exception {
        initTest();
        request.delete("/api/users/" + student.getLogin(), HttpStatus.OK);
        var achievementsFirstCourse = request.get("/api/courses/" + firstCourse.getId() + "/achievements", HttpStatus.NOT_FOUND, Set.class);
        assertThat(achievementsFirstCourse).as("Achievements for user should be null in course " + firstCourse.getId()).isNullOrEmpty();
        var achievementsSecondCourse = request.get("/api/courses/" + secondCourse.getId() + "/achievements", HttpStatus.NOT_FOUND, Set.class);
        assertThat(achievementsSecondCourse).as("Achievements for user should be null in course " + secondCourse.getId()).isNullOrEmpty();
    }

    @Test
    @WithMockUser(value = "student1", roles = "ADMIN")
    public void testDeleteCourse() throws Exception {
        initTest();
        var courseId = firstCourse.getId();
        request.delete("/api/courses/" + courseId, HttpStatus.OK);
        var achievementsFirstCourse = request.get("/api/courses/" + courseId + "/achievements", HttpStatus.OK, Set.class);
        assertThat(achievementsFirstCourse.size()).as("Achievements in course " + courseId + " get deleted if course " + courseId + " is deleted").isEqualTo(0);
        var achievementsSecondCourse = request.get("/api/courses/" + secondCourse.getId() + "/achievements", HttpStatus.OK, Set.class);
        assertThat(achievementsSecondCourse.size()).as("Achievements in course " + secondCourse.getId() + " do not get deleted if course " + courseId + " is deleted").isEqualTo(4);
    }

    @Test
    @WithMockUser(value = "instructor1", roles = "INSTRUCTOR")
    public void testDeleteExercise() throws Exception {
        initTest();
        request.delete("/api/modeling-exercises/" + firstExercise.getId(), HttpStatus.OK);
        var achievementsFirstCourse = request.get("/api/courses/" + firstCourse.getId() + "/achievements", HttpStatus.OK, Set.class);
        assertThat(achievementsFirstCourse.size()).as("Number of achievements for user should be 4 in course " + firstCourse.getId()).isEqualTo(4);
        var achievementsSecondCourse = request.get("/api/courses/" + secondCourse.getId() + "/achievements", HttpStatus.OK, Set.class);
        assertThat(achievementsSecondCourse.size()).as("Number of achievements for user should be 4 in course " + secondCourse.getId()).isEqualTo(4);
    }

    private void initTest() throws Exception {
        var allAchievements = achievementRepository.findAllByCourseId(firstCourse.getId());
        allAchievements.addAll(achievementRepository.findAllByCourseId(secondCourse.getId()));

        for (Achievement achievement : allAchievements) {
            student.addAchievement(achievement);
            instructor.addAchievement(achievement);
        }
        student = userRepository.save(student);
        instructor = userRepository.save(instructor);

        var achievementsFirstCourse = request.get("/api/courses/" + firstCourse.getId() + "/achievements", HttpStatus.OK, Set.class);
        assertThat(achievementsFirstCourse.size()).as("Number of achievements for user should be 12 in course " + firstCourse.getId()).isEqualTo(12);
        var achievementsSecondCourse = request.get("/api/courses/" + secondCourse.getId() + "/achievements", HttpStatus.OK, Set.class);
        assertThat(achievementsSecondCourse.size()).as("Number of achievements for user should be 4 in course " + secondCourse.getId()).isEqualTo(4);
    }
}
