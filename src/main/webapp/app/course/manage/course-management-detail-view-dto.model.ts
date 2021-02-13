import { CourseManagementOverviewDetailsDto } from 'app/course/manage/overview/course-management-overview-details-dto.model';
import { Moment } from 'moment';

export class CourseManagementDetailViewDto {
    courseId: number;
    presentationScore: number;
    semester: string;
    startDate: Moment;
    endDate: Moment;
    description: string;

    // Total Assessment
    currentPercentageAssessments: number;
    currentAbsoluteAssessments: number;
    currentMaxAssessments: number;

    // Total Complaints
    currentPercentageComplaints: number;
    currentAbsoluteComplaints: number;
    currentMaxComplaints: number;

    // More Feedback Request
    currentPercentageMoreFeedbacks: number;
    currentAbsoluteMoreFeedbacks: number;
    currentMaxMoreFeedbacks: number;

    // Average Student Score
    currentPercentageAverageScore: number;
    currentAbsoluteAverageScore: number;
    currentMaxAverageScore: number;

    activeStudents: number[];
    amountOfStudentsInCourse: number;

    exercises: CourseManagementOverviewDetailsDto;

    constructor() {}
}
