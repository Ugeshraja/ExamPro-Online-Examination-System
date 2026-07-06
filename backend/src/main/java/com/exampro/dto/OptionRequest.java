package com.exampro.dto;

public class OptionRequest {
    private String optionText;
    private Boolean isCorrect = false;

    public OptionRequest() {
    }

    public OptionRequest(String optionText, Boolean isCorrect) {
        this.optionText = optionText;
        this.isCorrect = isCorrect;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public Boolean getIsCorrect() {
        return isCorrect;
    }

    public void setIsCorrect(Boolean correct) {
        isCorrect = correct;
    }
}
