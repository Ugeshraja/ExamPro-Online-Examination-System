import React, { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { useFullscreen } from '../hooks/useFullscreen';
import { useVisibility } from '../hooks/useVisibility';
import { ShieldAlert, AlertTriangle, ChevronLeft, ChevronRight, Bookmark, CheckCircle, Clock } from 'lucide-react';

const TakeExam = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // questionId -> optionId
  const [markedForReview, setMarkedForReview] = useState({}); // questionId -> boolean
  const [visitedQuestions, setVisitedQuestions] = useState({}); // questionId -> boolean
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const [violations, setViolations] = useState(0);
  const [warningMsg, setWarningMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [examStarted, setExamStarted] = useState(false);

  const containerRef = useRef(null);

  // Submit Exam handler
  const handleSubmitExam = useCallback(async (isAutoSubmit = false) => {
    if (submitting) return;
    setSubmitting(true);

    // Prepare answers payload
    const submissionPayload = {
      answers: selectedAnswers,
      timeTakenSeconds: exam ? (exam.durationMinutes * 60 - timeLeft) : 0
    };

    try {
      // Exit fullscreen before routing to results
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e) {
      console.error(e);
    }

    try {
      const response = await api.post(`/results/exams/${examId}/submit`, submissionPayload);
      const result = response.data;
      navigate(`/results/${result.id}`);
    } catch (err) {
      console.error('Failed to submit exam:', err);
      alert('An error occurred while submitting. Your answers are saved locally.');
    } finally {
      setSubmitting(false);
    }
  }, [exam, timeLeft, selectedAnswers, examId, navigate, submitting]);

  // Hook for Fullscreen violations
  const handleFullscreenViolation = useCallback((exitCount) => {
    if (!examStarted) return;
    setViolations((prev) => {
      const nextVal = prev + 1;
      if (nextVal >= 3) {
        handleSubmitExam(true);
      } else {
        setWarningMsg(`Warning: Fullscreen exited! Suspicious activity counted: ${nextVal}/3. The test will auto-submit on 3 violations.`);
      }
      return nextVal;
    });
  }, [examStarted, handleSubmitExam]);

  const { isFullscreen, requestFullscreen } = useFullscreen(handleFullscreenViolation);

  // Hook for Tab switches / Blur violations
  const handleVisibilityViolation = useCallback((type, switchCount) => {
    if (!examStarted) return;
    setViolations((prev) => {
      const nextVal = prev + 1;
      if (nextVal >= 3) {
        handleSubmitExam(true);
      } else {
        const eventName = type === 'tab-switch' ? 'Tab Switched' : 'Defocused Window';
        setWarningMsg(`Warning: ${eventName} detected! Suspicious activity counted: ${nextVal}/3. The test will auto-submit on 3 violations.`);
      }
      return nextVal;
    });
  }, [examStarted, handleSubmitExam]);

  const { tabSwitchCount } = useVisibility(handleVisibilityViolation);

  // Fetch Questions
  useEffect(() => {
    const fetchExamAndQuestions = async () => {
      try {
        const [examRes, questionsRes] = await Promise.all([
          api.get(`/exams/${examId}`),
          api.get(`/exams/${examId}/questions`)
        ]);
        setExam(examRes.data);
        setQuestions(questionsRes.data);
        setTimeLeft(examRes.data.durationMinutes * 60);

        // Mark the first question as visited
        if (questionsRes.data.length > 0) {
          setVisitedQuestions({ [questionsRes.data[0].id]: true });
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchExamAndQuestions();
  }, [examId]);

  // Countdown timer
  useEffect(() => {
    if (!examStarted || timeLeft <= 0) {
      if (examStarted && timeLeft === 0) {
        handleSubmitExam(true); // Submit when timer hits zero
      }
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, examStarted, handleSubmitExam]);

  // Prevent right-click, copy-paste, text selection, and drag & drop
  useEffect(() => {
    if (!examStarted) return;

    const handleContextMenu = (e) => e.preventDefault();
    const handleCopy = (e) => e.preventDefault();
    const handleCut = (e) => e.preventDefault();
    const handlePaste = (e) => e.preventDefault();
    const handleDragStart = (e) => e.preventDefault();
    const handleDrop = (e) => e.preventDefault();

    const handleKeyDown = (e) => {
      const charCode = String.fromCharCode(e.which).toLowerCase();
      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A, Ctrl+U, Ctrl+S, Ctrl+P
      if (e.ctrlKey || e.metaKey) {
        if (['c', 'v', 'x', 'a', 'u', 's', 'p'].includes(charCode)) {
          e.preventDefault();
          setWarningMsg('Shortcuts are disabled during this examination.');
        }
      }
      // Block Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+Shift+C (DevTools)
      if (e.ctrlKey && e.shiftKey && ['i', 'j', 'c'].includes(charCode)) {
        e.preventDefault();
        setWarningMsg('DevTools shortcuts are blocked.');
      }
      // Block F12
      if (e.keyCode === 123) {
        e.preventDefault();
        setWarningMsg('F12 is disabled during the exam.');
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleCopy);
    document.addEventListener('cut', handleCut);
    document.addEventListener('paste', handlePaste);
    document.addEventListener('dragstart', handleDragStart);
    document.addEventListener('drop', handleDrop);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleCopy);
      document.removeEventListener('cut', handleCut);
      document.removeEventListener('paste', handlePaste);
      document.removeEventListener('dragstart', handleDragStart);
      document.removeEventListener('drop', handleDrop);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [examStarted]);

  const handleStartExam = async () => {
    try {
      await requestFullscreen(containerRef.current);
      setExamStarted(true);
    } catch (e) {
      alert('You must permit fullscreen mode to start this exam.');
    }
  };

  const handleSelectOption = (questionId, optionId) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleQuestionNavigate = (idx) => {
    setCurrentIdx(idx);
    const targetQId = questions[idx].id;
    setVisitedQuestions((prev) => ({ ...prev, [targetQId]: true }));
  };

  const toggleMarkedForReview = (questionId) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const getQuestionStateClass = (qId) => {
    if (markedForReview[qId]) return 'review';
    if (selectedAnswers[qId] !== undefined) return 'answered';
    if (visitedQuestions[qId]) return 'visited';
    return 'unvisited';
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  // Render initialization launcher screen if not started
  if (!examStarted) {
    return (
      <div style={{
        maxWidth: '600px',
        margin: '100px auto 0 auto',
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px'
      }} className="glass-card animate-slide-up">
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <ShieldAlert size={64} color="var(--color-primary-400)" />
        </div>
        <h2 style={{ fontSize: '1.8rem', fontFamily: 'var(--font-heading)' }}>Enter Secure Environment</h2>
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6' }}>
          To take the <strong>{exam?.title}</strong> exam, the browser must enter locking fullscreen.
          Make sure your browser zoom is at 100% and close all other windows before proceeding.
        </p>
        <button onClick={handleStartExam} className="btn btn-primary" style={{ padding: '14px 28px', fontSize: '1.1rem' }}>
          Lock & Launch Exam Console
        </button>
      </div>
    );
  }

  const currentQuestion = questions[currentIdx];

  return (
    <div ref={containerRef} style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-dark-base)',
      color: '#ffffff',
      padding: '24px',
      userSelect: 'none', // Prevent text selection
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    }}>
      {/* Warning banner */}
      {warningMsg && (
        <div className="badge badge-warning animate-slide-up" style={{
          padding: '16px',
          borderRadius: '10px',
          textTransform: 'none',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid var(--color-warning)',
          fontSize: '0.95rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} />
            <span>{warningMsg}</span>
          </div>
          <button onClick={() => setWarningMsg('')} style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>✕</button>
        </div>
      )}

      {/* Header Panel */}
      <header className="glass-card" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontFamily: 'var(--font-heading)' }}>{exam?.title}</h2>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            Exam Progress: {Object.keys(selectedAnswers).length} / {questions.length} Answered
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid var(--glass-border)',
            backgroundColor: timeLeft < 60 ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.02)',
            color: timeLeft < 60 ? 'var(--color-error)' : 'var(--text-primary)',
            fontWeight: '700'
          }}>
            <Clock size={16} />
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{formatTime(timeLeft)}</span>
          </div>

          <button onClick={() => {
            if (window.confirm('Are you sure you want to finish the exam and submit?')) {
              handleSubmitExam(false);
            }
          }} disabled={submitting} className="btn btn-primary" style={{ padding: '10px 20px' }}>
            <CheckCircle size={16} />
            Submit Examination
          </button>
        </div>
      </header>

      {/* Main Layout */}
      {currentQuestion && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 300px',
          gap: '24px',
          flex: 1
        }}>
          {/* Question Console */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '24px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--glass-border)', paddingBottom: '16px' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                  QUESTION {currentIdx + 1} OF {questions.length}
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-info" style={{ textTransform: 'none' }}>Marks: +{currentQuestion.marks}</span>
                  {currentQuestion.negativeMarks > 0 && <span className="badge badge-danger" style={{ textTransform: 'none' }}>Penalty: -{currentQuestion.negativeMarks}</span>}
                </div>
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: '500', lineHeight: '1.5' }}>
                {currentQuestion.questionText}
              </h3>

              {/* Options */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '12px' }}>
                {currentQuestion.options.map((opt) => {
                  const isSelected = selectedAnswers[currentQuestion.id] === opt.id;
                  return (
                    <label key={opt.id} style={{
                      padding: '16px 20px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--glass-border)',
                      borderColor: isSelected ? 'var(--color-primary-500)' : 'var(--glass-border)',
                      backgroundColor: isSelected ? 'rgba(37, 99, 235, 0.1)' : 'rgba(255, 255, 255, 0.01)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}>
                      <input
                        type="radio"
                        name={`q_${currentQuestion.id}`}
                        checked={isSelected}
                        onChange={() => handleSelectOption(currentQuestion.id, opt.id)}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                      />
                      <span style={{ fontSize: '1rem' }}>{opt.optionText}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderTop: '1px solid var(--glass-border)',
              paddingTop: '20px'
            }}>
              <button
                disabled={currentIdx === 0}
                onClick={() => handleQuestionNavigate(currentIdx - 1)}
                className="btn btn-secondary"
                style={{ opacity: currentIdx === 0 ? 0.4 : 1 }}
              >
                <ChevronLeft size={16} />
                Previous Question
              </button>

              <button
                onClick={() => toggleMarkedForReview(currentQuestion.id)}
                className="btn btn-secondary"
                style={{
                  borderColor: markedForReview[currentQuestion.id] ? 'var(--color-warning)' : 'var(--glass-border)',
                  color: markedForReview[currentQuestion.id] ? 'var(--color-warning)' : '#ffffff'
                }}
              >
                <Bookmark size={16} />
                {markedForReview[currentQuestion.id] ? 'Marked' : 'Review Later'}
              </button>

              <button
                disabled={currentIdx === questions.length - 1}
                onClick={() => handleQuestionNavigate(currentIdx + 1)}
                className="btn btn-secondary"
                style={{ opacity: currentIdx === questions.length - 1 ? 0.4 : 1 }}
              >
                Next Question
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Sidebar Palette */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '20px' }}>
            <h3 style={{ fontSize: '1.1rem' }}>Question Palette</h3>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(5, 1fr)',
              gap: '10px'
            }}>
              {questions.map((q, idx) => {
                const state = getQuestionStateClass(q.id);
                let bg = 'rgba(255,255,255,0.02)';
                let color = 'var(--text-secondary)';
                let border = '1px solid var(--glass-border)';

                if (state === 'review') {
                  bg = 'rgba(245, 158, 11, 0.2)';
                  color = 'var(--color-warning)';
                  border = '1px solid var(--color-warning)';
                } else if (state === 'answered') {
                  bg = 'rgba(16, 185, 129, 0.2)';
                  color = 'var(--color-success)';
                  border = '1px solid var(--color-success)';
                } else if (state === 'visited') {
                  bg = 'rgba(37, 99, 235, 0.15)';
                  color = 'var(--color-primary-300)';
                  border = '1px solid var(--color-primary-400)';
                }

                if (idx === currentIdx) {
                  border = '2px solid #ffffff';
                }

                return (
                  <button
                    key={q.id}
                    onClick={() => handleQuestionNavigate(idx)}
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '8px',
                      background: bg,
                      color: color,
                      border: border,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: '700',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                      fontFamily: 'var(--font-heading)'
                    }}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            {/* Color key guide */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '10px',
              borderTop: '1px solid var(--glass-border)',
              paddingTop: '16px',
              fontSize: '0.8rem',
              color: 'var(--text-secondary)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(16, 185, 129, 0.25)', border: '1px solid var(--color-success)' }} />
                <span>Answered</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(245, 158, 11, 0.25)', border: '1px solid var(--color-warning)' }} />
                <span>Marked for Review</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(37, 99, 235, 0.2)', border: '1px solid var(--color-primary-400)' }} />
                <span>Visited (Unanswered)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '3px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }} />
                <span>Unvisited</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TakeExam;
