package de.tum.in.www1.artemis.web.rest.dto;

import java.time.ZonedDateTime;
import java.util.List;

public class CourseManagementDetailViewDTO {

    private Long id;

    private Integer presentationScore;

    private String semester;

    private ZonedDateTime startDate;

    private ZonedDateTime endDate;

    private String description;

    private String courseIcon;

    private String title;

    private Boolean testCourse;

    private String shortName;

    private String color;

    private String studentGroupName;

    private String teachingAssistantGroupName;

    private String instructorGroupName;

    private Integer numberOfStudentsInCourse;

    private Integer numberOfTeachingAssistantsInCourse;

    private Integer numberOfInstructorsInCourse;

    private Boolean isAtLeastInstructor;

    // Total Assessment
    private Double currentPercentageAssessments;

    private Long currentAbsoluteAssessments;

    private Long currentMaxAssessments;

    // Total Complaints
    private Double currentPercentageComplaints;

    private Long currentAbsoluteComplaints;

    private Long currentMaxComplaints;

    // More Feedback Request
    private Double currentPercentageMoreFeedbacks;

    private Long currentAbsoluteMoreFeedbacks;

    private Long currentMaxMoreFeedbacks;

    // Average Student Score
    private Double currentPercentageAverageScore;

    private Double currentAbsoluteAverageScore;

    private Double currentMaxAverageScore;

    private Integer[] activeStudents;

    private List<CourseManagementOverviewExerciseDetailsDTO> exerciseDetails;

    private List<CourseManagementOverviewExerciseStatisticsDTO> exercisesStatistics;

    public Long getId() {
        return id;
    }

    public void setId(Long courseId) {
        this.id = courseId;
    }

    public Integer getPresentationScore() {
        return presentationScore;
    }

    public void setPresentationScore(Integer presentationScore) {
        this.presentationScore = presentationScore;
    }

    public String getSemester() {
        return semester;
    }

    public void setSemester(String semester) {
        this.semester = semester;
    }

    public ZonedDateTime getStartDate() {
        return startDate;
    }

    public void setStartDate(ZonedDateTime startDate) {
        this.startDate = startDate;
    }

    public ZonedDateTime getEndDate() {
        return endDate;
    }

    public void setEndDate(ZonedDateTime endDate) {
        this.endDate = endDate;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Boolean getTestCourse() {
        return testCourse;
    }

    public void setTestCourse(Boolean testCourse) {
        this.testCourse = testCourse;
    }

    public String getShortName() {
        return shortName;
    }

    public void setShortName(String shortName) {
        this.shortName = shortName;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getStudentGroupName() {
        return studentGroupName;
    }

    public void setStudentGroupName(String studentGroupName) {
        this.studentGroupName = studentGroupName;
    }

    public String getTeachingAssistantGroupName() {
        return teachingAssistantGroupName;
    }

    public void setTeachingAssistantGroupName(String teachingAssistantGroupName) {
        this.teachingAssistantGroupName = teachingAssistantGroupName;
    }

    public String getInstructorGroupName() {
        return instructorGroupName;
    }

    public void setInstructorGroupName(String instructorGroupName) {
        this.instructorGroupName = instructorGroupName;
    }

    public Double getCurrentPercentageAssessments() {
        return currentPercentageAssessments;
    }

    public void setCurrentPercentageAssessments(Double currentPercentageAssessments) {
        this.currentPercentageAssessments = currentPercentageAssessments;
    }

    public Long getCurrentAbsoluteAssessments() {
        return currentAbsoluteAssessments;
    }

    public void setCurrentAbsoluteAssessments(Long currentAbsoluteAssessments) {
        this.currentAbsoluteAssessments = currentAbsoluteAssessments;
    }

    public Long getCurrentMaxAssessments() {
        return currentMaxAssessments;
    }

    public void setCurrentMaxAssessments(Long currentMaxAssessments) {
        this.currentMaxAssessments = currentMaxAssessments;
    }

    public Double getCurrentPercentageComplaints() {
        return currentPercentageComplaints;
    }

    public void setCurrentPercentageComplaints(Double currentPercentageComplaints) {
        this.currentPercentageComplaints = currentPercentageComplaints;
    }

    public Long getCurrentAbsoluteComplaints() {
        return currentAbsoluteComplaints;
    }

    public void setCurrentAbsoluteComplaints(Long currentAbsoluteComplaints) {
        this.currentAbsoluteComplaints = currentAbsoluteComplaints;
    }

    public Long getCurrentMaxComplaints() {
        return currentMaxComplaints;
    }

    public void setCurrentMaxComplaints(Long currentMaxComplaints) {
        this.currentMaxComplaints = currentMaxComplaints;
    }

    public Double getCurrentPercentageMoreFeedbacks() {
        return currentPercentageMoreFeedbacks;
    }

    public void setCurrentPercentageMoreFeedbacks(Double currentPercentageMoreFeedbacks) {
        this.currentPercentageMoreFeedbacks = currentPercentageMoreFeedbacks;
    }

    public Long getCurrentAbsoluteMoreFeedbacks() {
        return currentAbsoluteMoreFeedbacks;
    }

    public void setCurrentAbsoluteMoreFeedbacks(Long currentAbsoluteMoreFeedbacks) {
        this.currentAbsoluteMoreFeedbacks = currentAbsoluteMoreFeedbacks;
    }

    public Long getCurrentMaxMoreFeedbacks() {
        return currentMaxMoreFeedbacks;
    }

    public void setCurrentMaxMoreFeedbacks(Long currentMaxMoreFeedbacks) {
        this.currentMaxMoreFeedbacks = currentMaxMoreFeedbacks;
    }

    public Double getCurrentPercentageAverageScore() {
        return currentPercentageAverageScore;
    }

    public void setCurrentPercentageAverageScore(Double currentPercentageAverageScore) {
        this.currentPercentageAverageScore = currentPercentageAverageScore;
    }

    public Double getCurrentAbsoluteAverageScore() {
        return currentAbsoluteAverageScore;
    }

    public void setCurrentAbsoluteAverageScore(Double currentAbsoluteAverageScore) {
        this.currentAbsoluteAverageScore = currentAbsoluteAverageScore;
    }

    public Double getCurrentMaxAverageScore() {
        return currentMaxAverageScore;
    }

    public void setCurrentMaxAverageScore(Double currentMaxAverageScore) {
        this.currentMaxAverageScore = currentMaxAverageScore;
    }

    public Integer[] getActiveStudents() {
        return activeStudents;
    }

    public void setActiveStudents(Integer[] activeStudents) {
        this.activeStudents = activeStudents;
    }

    public Integer getNumberOfStudentsInCourse() {
        return numberOfStudentsInCourse;
    }

    public void setNumberOfStudentsInCourse(Integer numberOfStudentsInCourse) {
        this.numberOfStudentsInCourse = numberOfStudentsInCourse;
    }

    public Integer getNumberOfTeachingAssistantsInCourse() {
        return numberOfTeachingAssistantsInCourse;
    }

    public void setNumberOfTeachingAssistantsInCourse(Integer numberOfTeachingAssistantsInCourse) {
        this.numberOfTeachingAssistantsInCourse = numberOfTeachingAssistantsInCourse;
    }

    public Integer getNumberOfInstructorsInCourse() {
        return numberOfInstructorsInCourse;
    }

    public void setNumberOfInstructorsInCourse(Integer numberOfInstructorsInCourse) {
        this.numberOfInstructorsInCourse = numberOfInstructorsInCourse;
    }

    public Boolean getIsAtLeastInstructor() {
        return isAtLeastInstructor;
    }

    public void setIsAtLeastInstructor(Boolean isAtLeastInstructor) {
        this.isAtLeastInstructor = isAtLeastInstructor;
    }

    public String getCourseIcon() {
        return courseIcon;
    }

    public void setCourseIcon(String courseIcon) {
        this.courseIcon = courseIcon;
    }

    public List<CourseManagementOverviewExerciseDetailsDTO> getExerciseDetails() {
        return exerciseDetails;
    }

    public void setExerciseDetails(List<CourseManagementOverviewExerciseDetailsDTO> exerciseDetails) {
        this.exerciseDetails = exerciseDetails;
    }

    public List<CourseManagementOverviewExerciseStatisticsDTO> getExercisesStatistics() {
        return exercisesStatistics;
    }

    public void setExercisesStatistics(List<CourseManagementOverviewExerciseStatisticsDTO> exercisesStatistics) {
        this.exercisesStatistics = exercisesStatistics;
    }
}
