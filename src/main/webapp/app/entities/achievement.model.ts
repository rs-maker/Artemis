import { BaseEntity } from 'app/shared/model/base-entity';

export enum AchievementRank {
    UNRANKED = 'UNRANKED',
    BRONZE = 'BRONZE',
    SILVER = 'SILVER',
    GOLD = 'GOLD',
}

export enum AchievementType {
    POINT = 'POINT',
    TIME = 'TIME',
    PROGRESS = 'PROGRESS',
}

export class Achievement implements BaseEntity {
    id?: number;
    title?: string;
    description?: string;
    icon?: string;
    rank?: AchievementRank;
    type?: AchievementType;
    successCriteria?: number;
    minScoreToQualify?: number;

    constructor() {}
}

export class AchievementConfiguration {
    isActive?: boolean;
    icon?: string;
    type?: string;
    successCriteriaUnranked?: number;
    successCriteriaBronze?: number;
    successCriteriaSilver?: number;
    successCriteriaGold?: number;
    minScore?: number;

    constructor() {}
}
