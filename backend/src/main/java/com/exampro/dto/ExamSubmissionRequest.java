package com.exampro.dto;

import java.util.Map;

public class ExamSubmissionRequest {
    // Map where Key is Question ID, and Value is Selected Option ID.
    // If skipped, Value is null.
    private Map<Long, Long> answers;
    private Integer timeTakenSeconds;

    public ExamSubmissionRequest() {
    }

    public Map<Long, Long> getAnswers() {
        return answers;
    }

    public void setAnswers(Map<Long, Long> answers) {
        this.answers = answers;
    }

    public Integer getTimeTakenSeconds() {
        return timeTakenSeconds;
    }

    public void setTimeTakenSeconds(Integer timeTakenSeconds) {
        this.timeTakenSeconds = timeTakenSeconds;
    }
}
