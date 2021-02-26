import { Moment } from 'moment';
import { ExerciseType } from 'app/entities/exercise.model';

export class CourseManagementOverviewExerciseDetailsDTO {
    // the id of the exercise
    public id?: number;
    public exerciseTitle?: string;
    public exerciseType?: ExerciseType;
    public categories?: string[];
    public releaseDate?: Moment;
    public dueDate?: Moment;
    public assessmentDueDate?: Moment;
    public teamMode?: boolean;

    // for quizExercises
    public quizStatus?: string;

    constructor() {}
}
