import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';

const QuestionManagement = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Form states
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questionText, setQuestionText] = useState('');
  const [marks, setMarks] = useState(1.0);
  const [negativeMarks, setNegativeMarks] = useState(0.0);
  const [difficulty, setDifficulty] = useState('EASY');
  const [category, setCategory] = useState('');
  const [options, setOptions] = useState([
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false },
    { optionText: '', isCorrect: false }
  ]);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const [examRes, questionsRes] = await Promise.all([
        api.get(`/exams/${examId}`),
        api.get(`/exams/${examId}/questions`)
      ]);
      setExam(examRes.data);
      setQuestions(questionsRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [examId]);

  const openAddModal = () => {
    setEditingQuestion(null);
    setQuestionText('');
    setMarks(1.0);
    setNegativeMarks(0.0);
    setDifficulty('EASY');
    setCategory('');
    setOptions([
      { optionText: '', isCorrect: true }, // Default first option is correct
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false },
      { optionText: '', isCorrect: false }
    ]);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (question) => {
    setEditingQuestion(question);
    setQuestionText(question.questionText);
    setMarks(question.marks);
    setNegativeMarks(question.negativeMarks);
    setDifficulty(question.difficulty);
    setCategory(question.category);
    
    // Copy options from question
    const qOptions = question.options.map(opt => ({
      optionText: opt.optionText,
      isCorrect: opt.isCorrect
    }));
    setOptions(qOptions);
    setError('');
    setModalOpen(true);
  };

  const handleOptionTextChange = (index, val) => {
    const updated = [...options];
    updated[index].optionText = val;
    setOptions(updated);
  };

  const handleCorrectOptionChange = (index) => {
    const updated = options.map((opt, i) => ({
      ...opt,
      isCorrect: i === index
    }));
    setOptions(updated);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!questionText || !category) {
      setError('Please fill in all fields.');
      return;
    }

    if (options.some(opt => !opt.optionText.trim())) {
      setError('All 4 options must contain text.');
      return;
    }

    const payload = {
      questionText,
      marks,
      negativeMarks,
      difficulty,
      category,
      options
    };

    try {
      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion.id}`, payload);
      } else {
        await api.post(`/exams/${examId}/questions`, payload);
      }
      setModalOpen(false);
      fetchData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) {
      return;
    }
    try {
      await api.delete(`/questions/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => navigate('/admin/exams')} className="btn btn-secondary" style={{ padding: '8px' }}>
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '1.8rem', marginBottom: '4px' }}>Question Bank: {exam?.title}</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Manage question cards and options for this test.</p>
          </div>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          Add Question
        </button>
      </div>

      {/* Questions List */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading question bank...</p>
      ) : questions.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
          No questions have been configured for this exam. Click "Add Question" to begin.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {questions.map((q, idx) => (
            <div key={q.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
                    QUESTION {idx + 1} ({q.difficulty} | {q.category})
                  </span>
                  <h4 style={{ fontSize: '1.1rem', fontWeight: '500', lineHeight: '1.4' }}>{q.questionText}</h4>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>+{q.marks} pts</span>
                  {q.negativeMarks > 0 && <span className="badge badge-danger" style={{ fontSize: '0.75rem' }}>-{q.negativeMarks} pts</span>}
                  <button onClick={() => openEditModal(q)} className="btn btn-secondary" style={{ padding: '6px' }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => handleDelete(q.id)} className="btn btn-danger" style={{ padding: '6px' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              {/* Options */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '12px',
                marginTop: '8px'
              }}>
                {q.options.map((opt, oIdx) => (
                  <div key={opt.id} style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--glass-border)',
                    backgroundColor: opt.isCorrect ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    borderColor: opt.isCorrect ? 'var(--color-success)' : 'var(--glass-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    {opt.isCorrect ? (
                      <CheckCircle2 size={16} color="var(--color-success)" />
                    ) : (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        border: '1.5px solid var(--text-secondary)'
                      }} />
                    )}
                    <span style={{ fontSize: '0.9rem', color: opt.isCorrect ? '#ffffff' : 'var(--text-primary)' }}>
                      {opt.optionText}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Question Modal */}
      {modalOpen && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.8)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '600px', padding: '32px', background: 'var(--bg-dark-surface)', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>{editingQuestion ? 'Edit Question Card' : 'Add MCQ Question'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {error && <div className="badge badge-danger" style={{ width: '100%', padding: '8px', marginBottom: '16px', textTransform: 'none' }}>{error}</div>}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Question Text</label>
                <textarea className="form-control" rows="3" value={questionText} onChange={(e) => setQuestionText(e.target.value)} required placeholder="Enter the question description..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <input type="text" className="form-control" value={category} onChange={(e) => setCategory(e.target.value)} required placeholder="e.g. Collections" />
                </div>
                <div className="form-group">
                  <label className="form-label">Difficulty</label>
                  <select className="form-control" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
                    <option value="EASY">EASY</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HARD">HARD</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Marks Awarded</label>
                  <input type="number" step="0.5" className="form-control" value={marks} onChange={(e) => setMarks(parseFloat(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Negative Penalty Marks</label>
                  <input type="number" step="0.5" className="form-control" value={negativeMarks} onChange={(e) => setNegativeMarks(parseFloat(e.target.value))} required />
                </div>
              </div>

              {/* Options Config */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '8px' }}>
                <label className="form-label">Configure Options (Select correct option radio)</label>
                {options.map((opt, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <input
                      type="radio"
                      name="correctOptionRadio"
                      checked={opt.isCorrect}
                      onChange={() => handleCorrectOptionChange(index)}
                      style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      className="form-control"
                      placeholder={`Option ${index + 1}`}
                      value={opt.optionText}
                      onChange={(e) => handleOptionTextChange(index, e.target.value)}
                      style={{ flex: 1 }}
                      required
                    />
                  </div>
                ))}
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '16px' }}>
                Save Question
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Help helper for X close icon in modals
const X = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default QuestionManagement;
