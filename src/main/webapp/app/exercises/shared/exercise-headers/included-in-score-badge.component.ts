import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IncludedInOverallScore } from 'app/entities/exercise.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'jhi-included-in-score-badge',
    templateUrl: './included-in-score-badge.component.html',
    styles: [],
})
export class IncludedInScoreBadgeComponent implements OnInit, OnDestroy {
    @Input() includedInOverallScore: IncludedInOverallScore | undefined;
    public translatedEnum = '';
    public translatedTooltip = '';
    public badgeClass: string;
    private translateSubscription: Subscription;

    constructor(private translateService: TranslateService) {}

    /**
     * Sets the badge attributes based on the included in score enum
     */
    ngOnInit(): void {
        this.translateSubscription = this.translateService.onLangChange.subscribe(() => {
            this.setBadgeAttributes();
        });
        this.setBadgeAttributes();
    }

    /**
     * Cleans up the subscription to the translation service
     */
    ngOnDestroy(): void {
        if (this.translateSubscription) {
            this.translateSubscription.unsubscribe();
        }
    }

    private setBadgeAttributes() {
        if (!this.includedInOverallScore) {
            return '';
        }

        switch (this.includedInOverallScore) {
            case IncludedInOverallScore.INCLUDED_AS_BONUS:
                this.badgeClass = 'badge-warning';
                this.translatedEnum = this.translateService.instant('artemisApp.exercise.includedAsBonus');
                this.translatedTooltip = this.translateService.instant('artemisApp.exercise.includedAsBonusTooltip');
                break;
            case IncludedInOverallScore.INCLUDED_COMPLETELY:
                this.badgeClass = 'badge-success';
                this.translatedEnum = this.translateService.instant('artemisApp.exercise.includedCompletely');
                this.translatedTooltip = this.translateService.instant('artemisApp.exercise.includedCompletelyTooltip');
                break;
            case IncludedInOverallScore.NOT_INCLUDED:
                this.badgeClass = 'badge-danger';
                this.translatedEnum = this.translateService.instant('artemisApp.exercise.notIncluded');
                this.translatedTooltip = this.translateService.instant('artemisApp.exercise.notIncludedTooltip');
                break;
        }
        return;
    }
}
