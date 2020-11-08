package de.tum.in.www1.artemis.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.fasterxml.jackson.annotation.JsonInclude;
import de.tum.in.www1.artemis.domain.exam.Exam;

@Entity
@Table(name = "grade_step")
@Cache(usage = CacheConcurrencyStrategy.NONSTRICT_READ_WRITE)
@JsonInclude(JsonInclude.Include.NON_EMPTY)
public class GradeStep extends DomainObject {

    @ManyToOne
    private Course course;

    @ManyToOne
    private Exam exam;

    @Column(name = "reached_at", nullable = false)
    private double reachedAt;

    @Column(name = "outcome", nullable = false)
    private String outcome;

    public Course getCourse() {
        return course;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public Exam getExam() {
        return exam;
    }

    public void setExam(Exam exam) {
        this.exam = exam;
    }

    public double getReachedAt() {
        return reachedAt;
    }

    public void setReachedAt(double reachedAt) {
        this.reachedAt = reachedAt;
    }

    public String getOutcome() {
        return outcome;
    }

    public void setOutcome(String outcome) {
        this.outcome = outcome;
    }

    @Override
    public String toString() {
        return "GradeStep{" + "reachedAt=" + reachedAt + ", outcome='" + outcome + '\'' + '}';
    }
}
