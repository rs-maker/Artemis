import { NgModule } from '@angular/core';
import { ArtemisSharedModule } from 'app/shared/shared.module';
import { GuidedTourComponent } from './guided-tour.component';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ArtemisMarkdownModule } from 'app/shared/markdown.module';

@NgModule({
    declarations: [GuidedTourComponent],
    imports: [ArtemisSharedModule, ArtemisMarkdownModule],
    exports: [GuidedTourComponent],
    entryComponents: [GuidedTourComponent],
    providers: [DeviceDetectorService],
})
export class GuidedTourModule {}
