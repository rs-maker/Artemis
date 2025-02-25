package de.tum.in.www1.artemis.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import de.tum.in.www1.artemis.domain.*;
import de.tum.in.www1.artemis.domain.enumeration.ExerciseMode;
import de.tum.in.www1.artemis.repository.*;

public abstract class ExerciseImportService {

    protected final ExampleSubmissionRepository exampleSubmissionRepository;

    protected final SubmissionRepository submissionRepository;

    protected final ResultRepository resultRepository;

    protected final TextBlockRepository textBlockRepository;

    public ExerciseImportService(ExampleSubmissionRepository exampleSubmissionRepository, SubmissionRepository submissionRepository, ResultRepository resultRepository,
            TextBlockRepository textBlockRepository) {
        this.exampleSubmissionRepository = exampleSubmissionRepository;
        this.submissionRepository = submissionRepository;
        this.resultRepository = resultRepository;
        this.textBlockRepository = textBlockRepository;
    }

    void copyExerciseBasis(final Exercise newExercise, final Exercise importedExercise) {
        if (importedExercise.isCourseExercise()) {
            newExercise.setCourse(importedExercise.getCourseViaExerciseGroupOrCourseMember());
        }
        else {
            newExercise.setExerciseGroup(importedExercise.getExerciseGroup());
        }

        newExercise.setTitle(importedExercise.getTitle());
        newExercise.setMaxPoints(importedExercise.getMaxPoints());
        newExercise.setBonusPoints(importedExercise.getBonusPoints());
        newExercise.setIncludedInOverallScore(importedExercise.getIncludedInOverallScore());
        newExercise.setAssessmentType(importedExercise.getAssessmentType());
        newExercise.setProblemStatement(importedExercise.getProblemStatement());
        newExercise.setReleaseDate(importedExercise.getReleaseDate());
        newExercise.setDueDate(importedExercise.getDueDate());
        newExercise.setAssessmentDueDate(importedExercise.getAssessmentDueDate());
        newExercise.setDifficulty(importedExercise.getDifficulty());
        newExercise.setGradingInstructions(importedExercise.getGradingInstructions());
        newExercise.setGradingCriteria(copyGradingCriteria(importedExercise));
        if (newExercise.getExerciseGroup() != null) {
            newExercise.setMode(ExerciseMode.INDIVIDUAL);
        }
        else {
            newExercise.setCategories(importedExercise.getCategories());
            newExercise.setMode(importedExercise.getMode());
            if (newExercise.getMode() == ExerciseMode.TEAM) {
                newExercise.setTeamAssignmentConfig(copyTeamAssignmentConfig(importedExercise.getTeamAssignmentConfig()));
            }
        }
    }

    abstract Set<ExampleSubmission> copyExampleSubmission(final Exercise templateExercise, final Exercise newExercise);

    abstract Submission copySubmission(final Submission originalSubmission);

    /** This helper method does a hard copy of the result of a submission.
     * To copy the feedback, it calls {@link #copyFeedback(List, Result)}
     *
     * @param originalResult The original result to be copied
     * @param newSubmission The submission in which we link the result clone
     * @return The cloned result
     */
    Result copyExampleResult(Result originalResult, Submission newSubmission) {
        Result newResult = new Result();
        newResult.setAssessmentType(originalResult.getAssessmentType());
        newResult.setAssessor(originalResult.getAssessor());
        newResult.setCompletionDate(originalResult.getCompletionDate());
        newResult.setExampleResult(true);
        newResult.setRated(true);
        newResult.setResultString(originalResult.getResultString());
        newResult.setHasFeedback(originalResult.getHasFeedback());
        newResult.setScore(originalResult.getScore());
        newResult.setFeedbacks(copyFeedback(originalResult.getFeedbacks(), newResult));
        // Cut relationship to parent because result is an ordered collection
        newResult.setSubmission(null);

        newResult = resultRepository.save(newResult);

        // Restore relationship to parent.
        newResult.setSubmission(newSubmission);

        return newResult;
    }

    /** This helper functions does a hard copy of the feedbacks.
     *
     * @param originalFeedbacks The original list of feedbacks to be copied
     * @param newResult The result in which we link the new feedback
     * @return The cloned list of feedback
     */
    private List<Feedback> copyFeedback(List<Feedback> originalFeedbacks, Result newResult) {
        List<Feedback> newFeedbacks = new ArrayList<>();
        for (final var originalFeedback : originalFeedbacks) {
            Feedback newFeedback = new Feedback();
            newFeedback.setCredits(originalFeedback.getCredits());
            newFeedback.setDetailText(originalFeedback.getDetailText());
            newFeedback.setPositive(originalFeedback.isPositive());
            newFeedback.setReference(originalFeedback.getReference());
            newFeedback.setType(originalFeedback.getType());
            newFeedback.setText(originalFeedback.getText());
            newFeedback.setResult(newResult);
            newFeedbacks.add(newFeedback);
        }
        return newFeedbacks;
    }

    /** Helper method which does a hard copy of the Team Assignment Configurations.
     *
     * @param originalConfig the original team assignment configuration to be copied.
     * @return The cloned configuration
     */
    private TeamAssignmentConfig copyTeamAssignmentConfig(TeamAssignmentConfig originalConfig) {
        TeamAssignmentConfig newConfig = new TeamAssignmentConfig();
        newConfig.setMinTeamSize(originalConfig.getMinTeamSize());
        newConfig.setMaxTeamSize(originalConfig.getMaxTeamSize());
        return newConfig;
    }

    /** Helper method which does a hard copy of the Grading Criteria
     *
     * @param originalTextExercise The original exercise which contains the grading criteria to be imported
     * @return A clone of the grading criteria list
     */
    private List<GradingCriterion> copyGradingCriteria(Exercise originalTextExercise) {
        List<GradingCriterion> newGradingCriteria = new ArrayList<>();
        for (GradingCriterion originalGradingCriterion : originalTextExercise.getGradingCriteria()) {
            GradingCriterion newGradingCriterion = new GradingCriterion();

            newGradingCriterion.setExercise(originalTextExercise);
            newGradingCriterion.setTitle(originalGradingCriterion.getTitle());

            newGradingCriterion.setStructuredGradingInstructions(copyGradingInstruction(originalGradingCriterion, newGradingCriterion));

            newGradingCriteria.add(newGradingCriterion);
        }
        return newGradingCriteria;
    }

    /** Helper method which does a hard copy of the Grading Instructions
     *
     * @param originalGradingCriterion The original grading criterion which contains the grading instructions
     * @param newGradingCriterion The cloned grading criterion in which we insert the grading instructions
     * @return A clone of the grading instruction list of the grading criterion
     */
    private List<GradingInstruction> copyGradingInstruction(GradingCriterion originalGradingCriterion, GradingCriterion newGradingCriterion) {
        List<GradingInstruction> newGradingInstructions = new ArrayList<>();
        for (GradingInstruction originalGradingInstruction : originalGradingCriterion.getStructuredGradingInstructions()) {
            GradingInstruction newGradingInstruction = new GradingInstruction();
            newGradingInstruction.setCredits(originalGradingInstruction.getCredits());
            newGradingInstruction.setFeedback(originalGradingInstruction.getFeedback());
            newGradingInstruction.setGradingScale(originalGradingInstruction.getGradingScale());
            newGradingInstruction.setInstructionDescription(originalGradingInstruction.getInstructionDescription());
            newGradingInstruction.setUsageCount(originalGradingInstruction.getUsageCount());
            newGradingInstruction.setGradingCriterion(newGradingCriterion);

            newGradingInstructions.add(newGradingInstruction);
        }
        return newGradingInstructions;
    }
}
