import { NgModule } from '@angular/core';
import { AssessmentInstructionsComponent } from './assessment-instructions.component';
import { ExpandableParagraphComponent } from './expandable-paragraph/expandable-paragraph.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ExpandableSampleSolutionComponent } from './expandable-sample-solution/expandable-sample-solution.component';
import { ArtemisModelingEditorModule } from 'app/modeling-editor';
import { ArtemisSharedModule } from 'app/shared';
import { StructuredGradingInstructionsComponent } from './structured-grading-instructions/structured-grading-instructions.component';
import { ArtemisMarkdownEditorModule } from 'app/markdown-editor';

@NgModule({
    declarations: [AssessmentInstructionsComponent, ExpandableParagraphComponent, ExpandableSampleSolutionComponent, StructuredGradingInstructionsComponent],
    exports: [AssessmentInstructionsComponent],
    imports: [NgbModule, FontAwesomeModule, ArtemisSharedModule, ArtemisModelingEditorModule, ArtemisMarkdownEditorModule],
})
export class AssessmentInstructionsModule {}
