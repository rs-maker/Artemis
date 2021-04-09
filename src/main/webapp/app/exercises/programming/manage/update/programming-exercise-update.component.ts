import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { JhiAlertService } from 'ng-jhipster';
import { Observable, Subject } from 'rxjs';
import { CourseManagementService } from 'app/course/manage/course-management.service';
import { ProgrammingExercise, ProgrammingLanguage, ProjectType } from 'app/entities/programming-exercise.model';
import { ProgrammingExerciseService } from '../services/programming-exercise.service';
import { FileService } from 'app/shared/http/file.service';
import { TranslateService } from '@ngx-translate/core';
import { switchMap, tap } from 'rxjs/operators';
import { FeatureToggle } from 'app/shared/feature-toggle/feature-toggle.service';
import { ExerciseService } from 'app/exercises/shared/exercise/exercise.service';
import { AssessmentType } from 'app/entities/assessment-type.model';
import { Exercise, ExerciseCategory, IncludedInOverallScore } from 'app/entities/exercise.model';
import { EditorMode } from 'app/shared/markdown-editor/markdown-editor.component';
import { KatexCommand } from 'app/shared/markdown-editor/commands/katex.command';
import { ProfileService } from 'app/shared/layouts/profiles/profile.service';
import { ProgrammingExerciseSimulationService } from 'app/exercises/programming/manage/services/programming-exercise-simulation.service';
import { ExerciseGroupService } from 'app/exam/manage/exercise-groups/exercise-group.service';
import { ProgrammingLanguageFeatureService } from 'app/exercises/programming/shared/service/programming-language-feature/programming-language-feature.service';
import { navigateBackFromExerciseUpdate } from 'app/utils/navigation.utils';
import { shortNamePattern } from 'app/shared/constants/input.constants';

@Component({
    selector: 'jhi-programming-exercise-update',
    templateUrl: './programming-exercise-update.component.html',
    styleUrls: ['../programming-exercise-form.scss'],
})
export class ProgrammingExerciseUpdateComponent implements OnInit {
    readonly IncludedInOverallScore = IncludedInOverallScore;

    FeatureToggle = FeatureToggle;
    ProgrammingLanguage = ProgrammingLanguage;
    ProjectType = ProjectType;

    private translationBasePath = 'artemisApp.programmingExercise.';

    submitButtonTitle: string;
    isImport: boolean;
    isExamMode: boolean;
    hasUnsavedChanges = false;
    programmingExercise: ProgrammingExercise;
    isSaving: boolean;
    problemStatementLoaded = false;
    templateParticipationResultLoaded = true;
    notificationText?: string;
    domainCommandsGradingInstructions = [new KatexCommand()];
    EditorMode = EditorMode;
    AssessmentType = AssessmentType;
    rerenderSubject = new Subject<void>();
    // This is used to revert the select if the user cancels to override the new selected programming language.
    private selectedProgrammingLanguageValue: ProgrammingLanguage;
    // This is used to revert the select if the user cancels to override the new selected project type.
    private selectedProjectTypeValue: ProjectType;

    maxPenaltyPattern = '^([0-9]|([1-9][0-9])|100)$';
    // Java package name Regex according to Java 14 JLS (https://docs.oracle.com/javase/specs/jls/se14/html/jls-7.html#jls-7.4.1),
    // with the restriction to a-z,A-Z,_ as "Java letter" and 0-9 as digits due to JavaScript/Browser Unicode character class limitations
    packageNamePatternForJavaKotlin =
        '^(?!.*(?:\\.|^)(?:abstract|continue|for|new|switch|assert|default|if|package|synchronized|boolean|do|goto|private|this|break|double|implements|protected|throw|byte|else|import|public|throws|case|enum|instanceof|return|transient|catch|extends|int|short|try|char|final|interface|static|void|class|finally|long|strictfp|volatile|const|float|native|super|while|_|true|false|null)(?:\\.|$))[A-Z_a-z][0-9A-Z_a-z]*(?:\\.[A-Z_a-z][0-9A-Z_a-z]*)*$';
    // Swift package name Regex derived from (https://docs.swift.org/swift-book/ReferenceManual/LexicalStructure.html#ID412),
    // with the restriction to a-z,A-Z as "Swift letter" and 0-9 as digits where no separators are allowed
    packageNamePatternForSwift =
        '^(?!(?:associatedtype|class|deinit|enum|extension|fileprivate|func|import|init|inout|internal|let|open|operator|private|protocol|public|rethrows|static|struct|subscript|typealias|var|break|case|continue|default|defer|do|else|fallthrough|for|guard|if|in|repeat|return|switch|where|while|as|Any|catch|false|is|nil|super|self|Self|throw|throws|true|try|_)$)[A-Za-z][0-9A-Za-z]*$';
    packageNamePattern = '';

    readonly shortNamePattern = shortNamePattern; // must start with a letter and cannot contain special characters
    titleNamePattern = '^[a-zA-Z0-9-_ ]+'; // must only contain alphanumeric characters, or whitespaces, or '_' or '-'
    exerciseCategories: ExerciseCategory[];
    existingCategories: ExerciseCategory[];

    public inProductionEnvironment: boolean;
    checkedFlagForStructuredGradingInstructions = false;

    public supportsJava = true;
    public supportsPython = false;
    public supportsC = false;
    public supportsHaskell = false;
    public supportsKotlin = false;
    public supportsVHDL = false;
    public supportsAssembler = false;
    public supportsSwift = false;
    public supportsOCaml = false;

    public packageNameRequired = true;
    public staticCodeAnalysisAllowed = false;
    public checkoutSolutionRepositoryAllowed = false;
    public sequentialTestRunsAllowed = false;

    // Additional options for import
    public recreateBuildPlans = false;
    public updateTemplate = false;
    public originalStaticCodeAnalysisEnabled: boolean | undefined;

    public projectTypes: ProjectType[] = [];

    constructor(
        private programmingExerciseService: ProgrammingExerciseService,
        private courseService: CourseManagementService,
        private jhiAlertService: JhiAlertService,
        private exerciseService: ExerciseService,
        private fileService: FileService,
        private activatedRoute: ActivatedRoute,
        private translateService: TranslateService,
        private profileService: ProfileService,
        private programmingExerciseSimulationService: ProgrammingExerciseSimulationService,
        private exerciseGroupService: ExerciseGroupService,
        private programmingLanguageFeatureService: ProgrammingLanguageFeatureService,
        private router: Router,
    ) {}

    /**
     * Will also trigger loading the corresponding programming exercise language template.
     *
     * @param language to change to.
     */
    set selectedProgrammingLanguage(language: ProgrammingLanguage) {
        const languageChanged = this.selectedProgrammingLanguageValue !== language;
        this.selectedProgrammingLanguageValue = language;

        const programmingLanguageFeature = this.programmingLanguageFeatureService.getProgrammingLanguageFeature(language);
        this.packageNameRequired = programmingLanguageFeature.packageNameRequired;
        this.staticCodeAnalysisAllowed = programmingLanguageFeature.staticCodeAnalysis;
        this.checkoutSolutionRepositoryAllowed = programmingLanguageFeature.checkoutSolutionRepositoryAllowed;
        this.sequentialTestRunsAllowed = programmingLanguageFeature.sequentialTestRuns;
        this.projectTypes = programmingLanguageFeature.projectTypes;

        if (languageChanged) {
            // Reset project type when changing programming language as not all programming languages support (the same) project types
            this.programmingExercise.projectType = this.projectTypes[0];
            this.selectedProjectTypeValue = this.projectTypes[0]!;
        }

        // If we switch to another language which does not support static code analysis we need to reset options related to static code analysis
        if (!this.staticCodeAnalysisAllowed) {
            this.programmingExercise.staticCodeAnalysisEnabled = false;
            this.programmingExercise.maxStaticCodeAnalysisPenalty = undefined;
        }
        // Don't override the problem statement with the template in edit mode.
        if (this.programmingExercise.id === undefined) {
            this.loadProgrammingLanguageTemplate(language, this.programmingExercise.projectType!);
            // Rerender the instructions as the template has changed.
            this.rerenderSubject.next();
        }
    }

    get selectedProgrammingLanguage() {
        return this.selectedProgrammingLanguageValue;
    }

    /**
     * Will also trigger loading the corresponding project type template.
     *
     * @param type to change to.
     */
    set selectedProjectType(type: ProjectType) {
        this.selectedProjectTypeValue = type;

        // Don't override the problem statement with the template in edit mode.
        if (this.programmingExercise.id === undefined) {
            this.loadProgrammingLanguageTemplate(this.programmingExercise.programmingLanguage!, type);
            // Rerender the instructions as the template has changed.
            this.rerenderSubject.next();
        }
    }

    get selectedProjectType() {
        return this.selectedProjectTypeValue;
    }

    /**
     * Sets the values for the creation/update of a programming exercise
     */
    ngOnInit() {
        this.isSaving = false;
        this.notificationText = undefined;
        this.activatedRoute.data.subscribe(({ programmingExercise }) => {
            this.programmingExercise = programmingExercise;
            this.selectedProgrammingLanguageValue = this.programmingExercise.programmingLanguage!;
            this.selectedProjectTypeValue = this.programmingExercise.projectType!;
        });
        // If it is an import, just get the course, otherwise handle the edit and new cases
        this.activatedRoute.url
            .pipe(
                tap((segments) => (this.isImport = segments.some((segment) => segment.path === 'import'))),
                switchMap(() => this.activatedRoute.params),
                tap((params) => {
                    if (this.isImport) {
                        this.createProgrammingExerciseForImport(params);
                    } else {
                        if (params['courseId'] && params['examId'] && params['groupId']) {
                            this.exerciseGroupService.find(params['courseId'], params['examId'], params['groupId']).subscribe((res) => {
                                this.isExamMode = true;
                                this.programmingExercise.exerciseGroup = res.body!;
                            });
                        } else if (params['courseId']) {
                            const courseId = params['courseId'];
                            this.courseService.find(courseId).subscribe((res) => {
                                this.isExamMode = false;
                                this.programmingExercise.course = res.body!;
                                this.exerciseCategories = this.exerciseService.convertExerciseCategoriesFromServer(this.programmingExercise);
                                this.courseService.findAllCategoriesOfCourse(this.programmingExercise.course!.id!).subscribe(
                                    (categoryRes: HttpResponse<string[]>) => {
                                        this.existingCategories = this.exerciseService.convertExerciseCategoriesAsStringFromServer(categoryRes.body!);
                                    },
                                    (categoryRes: HttpErrorResponse) => this.onError(categoryRes),
                                );
                            });
                        }
                    }

                    // Set submit button text depending on component state
                    if (this.isImport) {
                        this.submitButtonTitle = 'entity.action.import';
                    } else if (this.programmingExercise.id) {
                        this.submitButtonTitle = 'entity.action.save';
                    } else {
                        this.submitButtonTitle = 'entity.action.generate';
                    }
                }),
            )
            .subscribe();
        // If an exercise is created, load our readme template so the problemStatement is not empty
        this.selectedProgrammingLanguage = this.programmingExercise.programmingLanguage!;
        if (this.programmingExercise.id) {
            this.problemStatementLoaded = true;
        }
        // Select the correct pattern
        this.setPackageNamePattern(this.selectedProgrammingLanguage);

        // Checks if the current environment is production
        this.profileService.getProfileInfo().subscribe((profileInfo) => {
            if (profileInfo) {
                this.inProductionEnvironment = profileInfo.inProduction;
            }
        });

        this.supportsJava = this.programmingLanguageFeatureService.supportsProgrammingLanguage(ProgrammingLanguage.JAVA);
        this.supportsPython = this.programmingLanguageFeatureService.supportsProgrammingLanguage(ProgrammingLanguage.PYTHON);
        this.supportsC = this.programmingLanguageFeatureService.supportsProgrammingLanguage(ProgrammingLanguage.C);
        this.supportsHaskell = this.programmingLanguageFeatureService.supportsProgrammingLanguage(ProgrammingLanguage.HASKELL);
        this.supportsKotlin = this.programmingLanguageFeatureService.supportsProgrammingLanguage(ProgrammingLanguage.KOTLIN);
        this.supportsVHDL = this.programmingLanguageFeatureService.supportsProgrammingLanguage(ProgrammingLanguage.VHDL);
        this.supportsAssembler = this.programmingLanguageFeatureService.supportsProgrammingLanguage(ProgrammingLanguage.ASSEMBLER);
        this.supportsSwift = this.programmingLanguageFeatureService.supportsProgrammingLanguage(ProgrammingLanguage.SWIFT);
        this.supportsOCaml = this.programmingLanguageFeatureService.supportsProgrammingLanguage(ProgrammingLanguage.OCAML);
    }

    /**
     * Setups the programming exercise for import. The route determine whether the new exercise will be imported as an exam
     * or a normal exercise.
     *
     * @param params given by ActivatedRoute
     */
    private createProgrammingExerciseForImport(params: Params) {
        this.isImport = true;
        this.originalStaticCodeAnalysisEnabled = this.programmingExercise.staticCodeAnalysisEnabled;
        // The source exercise is injected via the Resolver. The route parameters determine the target exerciseGroup or course
        if (params['courseId'] && params['examId'] && params['groupId']) {
            this.exerciseGroupService.find(params['courseId'], params['examId'], params['groupId']).subscribe((res) => {
                this.programmingExercise.exerciseGroup = res.body!;
                // Set course to undefined if a normal exercise is imported
                this.programmingExercise.course = undefined;
            });
            this.isExamMode = true;
        } else if (params['courseId']) {
            this.courseService.find(params['courseId']).subscribe((res) => {
                this.programmingExercise.course = res.body!;
                // Set exerciseGroup to undefined if an exam exercise is imported
                this.programmingExercise.exerciseGroup = undefined;
            });
            this.isExamMode = false;
        }
        this.programmingExercise.dueDate = undefined;
        this.programmingExercise.projectKey = undefined;
        this.programmingExercise.buildAndTestStudentSubmissionsAfterDueDate = undefined;
        this.programmingExercise.assessmentDueDate = undefined;
        this.programmingExercise.releaseDate = undefined;
        this.programmingExercise.shortName = undefined;
        this.programmingExercise.title = undefined;
    }

    /**
     * Revert to the previous state, equivalent with pressing the back button on your browser
     * Returns to the detail page if there is no previous state and we edited an existing exercise
     * Returns to the overview page if there is no previous state and we created a new exercise
     * Returns to the exercise groups page if we are in exam mode
     */
    previousState() {
        navigateBackFromExerciseUpdate(this.router, this.programmingExercise);
    }

    /**
     * Updates the categories
     * @param categories which should be set
     */
    updateCategories(categories: ExerciseCategory[]) {
        this.programmingExercise.categories = categories.map((el) => JSON.stringify(el));
    }

    /**
     * Saves the programming exercise with the provided input
     */
    save() {
        // If no release date is set, we warn the user.
        if (!this.programmingExercise.releaseDate && !this.isExamMode) {
            const confirmNoReleaseDate = this.translateService.instant(this.translationBasePath + 'noReleaseDateWarning');
            if (!window.confirm(confirmNoReleaseDate)) {
                return;
            }
        }

        Exercise.sanitize(this.programmingExercise);

        this.isSaving = true;

        if (this.isImport) {
            this.subscribeToSaveResponse(this.programmingExerciseService.importExercise(this.programmingExercise, this.recreateBuildPlans, this.updateTemplate));
        } else if (this.programmingExercise.id !== undefined) {
            const requestOptions = {} as any;
            if (this.notificationText) {
                requestOptions.notificationText = this.notificationText;
            }
            this.subscribeToSaveResponse(this.programmingExerciseService.update(this.programmingExercise, requestOptions));
        } else if (this.programmingExercise.noVersionControlAndContinuousIntegrationAvailable) {
            // only for testing purposes(noVersionControlAndContinuousIntegrationAvailable)
            this.subscribeToSaveResponse(this.programmingExerciseSimulationService.automaticSetupWithoutConnectionToVCSandCI(this.programmingExercise));
        } else {
            this.subscribeToSaveResponse(this.programmingExerciseService.automaticSetup(this.programmingExercise));
        }
    }

    private subscribeToSaveResponse(result: Observable<HttpResponse<ProgrammingExercise>>) {
        result.subscribe(
            () => this.onSaveSuccess(),
            (res: HttpErrorResponse) => this.onSaveError(res),
        );
    }

    private onSaveSuccess() {
        this.isSaving = false;
        this.previousState();
    }

    private onSaveError(error: HttpErrorResponse) {
        const errorMessage = error.headers.get('X-artemisApp-alert')!;
        // TODO: this is a workaround to avoid translation not found issues. Provide proper translations
        const jhiAlert = this.jhiAlertService.error(errorMessage);
        jhiAlert.msg = errorMessage;
        this.isSaving = false;
        window.scrollTo(0, 0);
    }

    private onError(error: HttpErrorResponse) {
        this.jhiAlertService.error(error.message);
    }

    /**
     * When setting the programming language, a change guard is triggered.
     * This is because we want to reload the instructions template for a different language, but don't want the user to loose unsaved changes.
     * If the user cancels the language will not be changed.
     *
     * @param language to switch to.
     */
    onProgrammingLanguageChange(language: ProgrammingLanguage) {
        // If there are unsaved changes and the user does not confirm, the language doesn't get changed
        if (this.hasUnsavedChanges) {
            const confirmLanguageChangeText = this.translateService.instant(this.translationBasePath + 'unsavedChangesLanguageChange');
            if (!window.confirm(confirmLanguageChangeText)) {
                return this.selectedProgrammingLanguage;
            }
        }
        // Select the correct pattern
        this.setPackageNamePattern(language);
        this.selectedProgrammingLanguage = language;
        return language;
    }

    /**
     * Sets the regex pattern for the package name for the selected programming language.
     *
     * @param language to choose from
     */
    setPackageNamePattern(language: ProgrammingLanguage) {
        if (language === ProgrammingLanguage.SWIFT) {
            this.packageNamePattern = this.packageNamePatternForSwift;
        } else {
            this.packageNamePattern = this.packageNamePatternForJavaKotlin;
        }
    }

    /**
     * When setting the project type, a change guard is triggered.
     * This is because we want to reload the instructions template for a project type, but don't want the user to loose unsaved changes.
     * If the user cancels the project type will not be changed.
     *
     * @param projectType to switch to.
     */
    onProjectTypeChange(projectType: ProjectType) {
        // If there are unsaved changes and the user does not confirm, the language doesn't get changed
        if (this.hasUnsavedChanges) {
            const confirmLanguageChangeText = this.translateService.instant(this.translationBasePath + 'unsavedChangesProjectTypeChange');
            if (!window.confirm(confirmLanguageChangeText)) {
                return this.selectedProjectType;
            }
        }
        this.selectedProjectType = projectType;
        return projectType;
    }

    onStaticCodeAnalysisChanged() {
        // On import: If SCA mode changed, activate recreation of build plans and update of the template
        if (this.isImport && this.programmingExercise.staticCodeAnalysisEnabled !== this.originalStaticCodeAnalysisEnabled) {
            this.recreateBuildPlans = true;
            this.updateTemplate = true;
        }

        if (!this.programmingExercise.staticCodeAnalysisEnabled) {
            this.programmingExercise.maxStaticCodeAnalysisPenalty = undefined;
        }
    }

    onRecreateBuildPlanOrUpdateTemplateChange() {
        if (!this.recreateBuildPlans || !this.updateTemplate) {
            this.programmingExercise.staticCodeAnalysisEnabled = this.originalStaticCodeAnalysisEnabled;
        }

        if (!this.programmingExercise.staticCodeAnalysisEnabled) {
            this.programmingExercise.maxStaticCodeAnalysisPenalty = undefined;
        }
    }

    /**
     * gets the flag of the structured grading instructions slide toggle
     */
    getCheckedFlag(event: boolean) {
        this.checkedFlagForStructuredGradingInstructions = event;
    }

    /**
     * Change the selected programming language for the current exercise. If there are unsaved changes, the user
     * will see a confirmation dialog about switching to a new template
     *
     * @param language The new programming language
     * @param type The new project type
     */
    private loadProgrammingLanguageTemplate(language: ProgrammingLanguage, type: ProjectType) {
        // Otherwise, just change the language and load the new template
        this.hasUnsavedChanges = false;
        this.problemStatementLoaded = false;
        this.programmingExercise.programmingLanguage = language;
        this.programmingExercise.projectType = type;
        this.fileService.getTemplateFile('readme', this.programmingExercise.programmingLanguage, this.programmingExercise.projectType).subscribe(
            (file) => {
                this.programmingExercise.problemStatement = file;
                this.problemStatementLoaded = true;
            },
            () => {
                this.programmingExercise.problemStatement = '';
                this.problemStatementLoaded = true;
            },
        );
    }

    /**
     * checking if at least one of Online Editor or Offline Ide is selected
     */
    validIdeSelection() {
        return this.programmingExercise.allowOnlineEditor || this.programmingExercise.allowOfflineIde;
    }

    isTagName(e: Event): boolean {
        if (e.target instanceof Element) {
            return e.target.tagName === 'TEXTAREA';
        }
        return false;
    }
}
