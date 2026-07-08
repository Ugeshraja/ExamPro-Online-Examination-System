import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, Clock, Plus, Edit2, Trash2, HelpCircle, Eye, EyeOff, Award } from 'lucide-react';

const ExamManagement = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [editingExam, setEditingExam] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [passingMarks, setPassingMarks] = useState(50.0);
  const [totalQuestions, setTotalQuestions] = useState(10);
  const [scheduleTime, setScheduleTime] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [error, setError] = useState('');

  const fetchExams = async () => {
    try {
      const response = await api.get('/exams');
      setExams(response.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExams();
  }, []);

  const openAddModal = () => {
    setEditingExam(null);
    setTitle('');
    setDescription('');
    setDurationMinutes(30);
    setPassingMarks(50.0);
    setTotalQuestions(10);
    setScheduleTime('');
    setIsPublished(false);
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (exam) => {
    setEditingExam(exam);
    setTitle(exam.title);
    setDescription(exam.description || '');
    setDurationMinutes(exam.durationMinutes);
    setPassingMarks(exam.passingMarks);
    setTotalQuestions(exam.totalQuestions);
    setScheduleTime(exam.scheduleTime ? exam.scheduleTime.substring(0, 16) : '');
    setIsPublished(exam.isPublished);
    setError('');
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    const payload = {
      title,
      description,
      durationMinutes,
      passingMarks,
      totalQuestions,
      scheduleTime: scheduleTime ? new Date(scheduleTime).toISOString() : null,
      isPublished
    };

    try {
      if (editingExam) {
        await api.put(`/exams/${editingExam.id}`, payload);
      } else {
        await api.post('/exams', payload);
      }
      setModalOpen(false);
      fetchExams();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save exam.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this exam? All student results and questions linked to it will be wiped.')) {
      return;
    }
    try {
      await api.delete(`/exams/${id}`);
      fetchExams();
    } catch (err) {
      console.error(err);
    }
  };

  const togglePublish = async (id, currentStatus) => {
    try {
      await api.patch(`/exams/${id}/publish?status=${!currentStatus}`);
      fetchExams();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Exam Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Schedule, publish, and structure examinations.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <Plus size={18} />
          Create Exam
        </button>
      </div>

      {/* Exam Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading exams...</p>
      ) : exams.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No exams configured yet.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px'
        }}>
          {exams.map((exam) => (
            <div key={exam.id} className="glass-card" style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{exam.title}</h3>
                  <span className={`badge ${exam.isPublished ? 'badge-success' : 'badge-warning'}`}>
                    {exam.isPublished ? 'Published' : 'Draft'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '44px' }}>
                  {exam.description || 'No description provided.'}
                </p>

                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  marginTop: '16px',
                  paddingTop: '16px',
                  borderTop: '1px solid var(--glass-border)',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} />
                    <span>{exam.durationMinutes} minutes</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <HelpCircle size={14} />
                    <span>{exam.totalQuestions} Questions</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Award size={14} />
                    <span>Passing: {exam.passingMarks}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>{exam.scheduleTime ? new Date(exam.scheduleTime).toLocaleDateString() : 'Self-Paced'}</span>
                  </div>
                </div>
              </div>

              {/* Actions Panel */}
              <div style={{
                display: 'flex',
                gap: '8px',
                marginTop: '8px',
                paddingTop: '12px',
                borderTop: '1px solid var(--glass-border)'
              }}>
                <button onClick={() => navigate(`/admin/exams/${exam.id}/questions`)} className="btn btn-secondary" style={{
                  flex: 1,
                  fontSize: '0.8rem',
                  padding: '8px'
                }}>
                  Questions
                </button>
                <button onClick={() => togglePublish(exam.id, exam.isPublished)} className="btn btn-secondary" style={{
                  padding: '8px',
                  color: exam.isPublished ? 'var(--color-warning)' : 'var(--color-success)'
                }}>
                  {exam.isPublished ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                <button onClick={() => openEditModal(exam)} className="btn btn-secondary" style={{ padding: '8px' }}>
                  <Edit2 size={16} />
                </button>
                <button onClick={() => handleDelete(exam.id)} className="btn btn-danger" style={{ padding: '8px' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
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
          <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '520px', padding: '32px', background: 'var(--bg-dark-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>{editingExam ? 'Edit Exam configurations' : 'Create New Exam'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {error && <div className="badge badge-danger" style={{ width: '100%', padding: '8px', marginBottom: '16px', textTransform: 'none' }}>{error}</div>}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Exam Title</label>
                <input type="text" className="form-control" value={title} onChange={(e) => setTitle(e.target.value)} required placeholder="e.g. Java Fundamentals" />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} rows="2" placeholder="Brief outline of syllabus..." />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Duration (Minutes)</label>
                  <input type="number" className="form-control" value={durationMinutes} onChange={(e) => setDurationMinutes(parseInt(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Passing Marks (%)</label>
                  <input type="number" step="0.1" className="form-control" value={passingMarks} onChange={(e) => setPassingMarks(parseFloat(e.target.value))} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div className="form-group">
                  <label className="form-label">Questions Count</label>
                  <input type="number" className="form-control" value={totalQuestions} onChange={(e) => setTotalQuestions(parseInt(e.target.value))} required />
                </div>
                <div className="form-group">
                  <label className="form-label">Schedule Time (Optional)</label>
                  <input type="datetime-local" className="form-control" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
                </div>
              </div>

              <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', marginTop: '4px' }}>
                <input type="checkbox" id="pubCheck" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} style={{ width: '16px', height: '16px', cursor: 'pointer' }} />
                <label htmlFor="pubCheck" className="form-label" style={{ cursor: 'pointer', marginBottom: 0 }}>Publish Immediately</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
                Save Exam Configurations
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// Help helper for X close icon in modals if needed
const X = ({ size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

export default ExamManagement;
