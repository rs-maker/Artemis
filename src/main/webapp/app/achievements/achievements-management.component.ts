import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { SERVER_API_URL } from 'app/app.constants';
import { Achievement, AchievementType, AchievementConfiguration, AchievementRank } from 'app/entities/achievement.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'jhi-achievements-management',
    templateUrl: './achievements-management.component.html',
    styleUrls: ['./achievements.scss'],
})
export class AchievementsManagementComponent implements OnInit, OnDestroy {
    public achievementConfigs: AchievementConfiguration[] = [];

    public valueUpdated = false;

    readonly achievementType = AchievementType;

    private allAchievementsSubscription: Subscription;

    private activeAchievementsSubscription: Subscription;

    private courseId = 0;

    private allAchievements: Achievement[];

    private activeAchievements: AchievementType[];

    private resourceUrl = SERVER_API_URL + 'api/courses';

    constructor(private http: HttpClient, private location: Location, private route: ActivatedRoute) {}

    ngOnInit() {
        this.courseId = Number(this.route.parent?.snapshot.paramMap.get('courseId'));

        for (const achievementType in AchievementType) {
            if (achievementType != undefined) {
                this.achievementConfigs.push({ isActive: false, type: achievementType });
            }
        }

        this.allAchievementsSubscription = this.http.get<Achievement[]>(`${this.resourceUrl}/${this.courseId}/all-achievements`).subscribe((loadedAchievements) => {
            this.allAchievements = loadedAchievements;
            this.convertToConfigs(loadedAchievements);
        });

        this.activeAchievementsSubscription = this.http.get<AchievementType[]>(`${this.resourceUrl}/${this.courseId}/active-achievements`).subscribe((loadedAchievements) => {
            this.activeAchievements = loadedAchievements;
            this.setIsActive(loadedAchievements);
        });
    }

    ngOnDestroy() {
        this.allAchievementsSubscription.unsubscribe();
        this.activeAchievementsSubscription.unsubscribe();
    }

    /**
     * Makes inactive test cases grey.
     *
     * @param row
     */
    getRowClass(row: AchievementConfiguration) {
        return !row.isActive ? 'inactive' : '';
    }

    valueChanged() {
        this.valueUpdated = true;
    }

    save() {
        this.location.back();
    }

    previousState() {
        window.history.back();
    }

    private setIsActive(activeAchievements: (string | undefined)[]) {
        this.achievementConfigs.forEach((config) => {
            if (activeAchievements.includes(config.type)) {
                config.isActive = true;
            }
        });
    }

    private convertToConfigs(achievements: Achievement[]) {
        achievements.forEach((achievement) => {
            switch (achievement.type) {
                case AchievementType.POINT:
                    this.achievementConfigs
                        .filter((config) => config.type === AchievementType.POINT)
                        .map((filteredConfig) => {
                            this.loadIntoConfig(achievement, filteredConfig);
                        });
                    break;
                case AchievementType.TIME:
                    this.achievementConfigs
                        .filter((config) => config.type === AchievementType.TIME)
                        .map((filteredConfig) => {
                            this.loadIntoConfig(achievement, filteredConfig);
                        });
                    break;
                case AchievementType.PROGRESS:
                    this.achievementConfigs
                        .filter((config) => config.type === AchievementType.PROGRESS)
                        .map((filteredConfig) => {
                            this.loadIntoConfig(achievement, filteredConfig);
                        });
                    break;
            }
        });
    }

    private loadIntoConfig(achievement: Achievement, config: AchievementConfiguration) {
        config.icon = achievement.icon;
        config.minScore = achievement.minScoreToQualify;
        switch (achievement.rank) {
            case AchievementRank.UNRANKED:
                config.successCriteriaUnranked = achievement.successCriteria;
                break;
            case AchievementRank.BRONZE:
                config.successCriteriaBronze = achievement.successCriteria;
                break;
            case AchievementRank.SILVER:
                config.successCriteriaSilver = achievement.successCriteria;
                break;
            case AchievementRank.GOLD:
                config.successCriteriaGold = achievement.successCriteria;
                break;
        }
    }
}
