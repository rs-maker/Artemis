import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArtemisSharedModule } from 'app/shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { ArtemisTableModule } from 'app/shared/table/table.module';
import { AchievementsComponent } from './achievements.component';
import { AchievementsManagementComponent } from './achievements-management.component';

@NgModule({
    imports: [CommonModule, ArtemisSharedModule, NgxDatatableModule, ArtemisTableModule],
    declarations: [AchievementsComponent, AchievementsManagementComponent],
    exports: [AchievementsComponent, AchievementsManagementComponent],
})
export class AchievementsModule {}
