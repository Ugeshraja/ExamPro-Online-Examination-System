import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Search, Clock, HelpCircle, Calendar, Award } from 'lucide-react';

const ExamList = () => {
  const [exams, setExams] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
    fetchExams();
  }, []);

  const filteredExams = exams.filter(exam => 
    exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (exam.description && exam.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Available Examinations</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Browse available exams, check schedule constraints, and begin certifications.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="var(--text-secondary)" />
        <input
          type="text"
          className="form-control"
          placeholder="Search exams by title or keywords..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: '100%', background: 'transparent', border: 'none', padding: '4px' }}
        />
      </div>

      {/* Exam Grid */}
      {loading ? (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading exam listings...</p>
      ) : filteredExams.length === 0 ? (
        <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No examinations match your search.</p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {filteredExams.map((exam) => (
            <div key={exam.id} className="glass-card glass-card-hover" style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              gap: '20px'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '8px',
                    backgroundColor: 'rgba(37, 99, 235, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--color-primary-400)'
                  }}>
                    <BookOpen size={20} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: '600' }}>{exam.title}</h3>
                </div>

                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', minHeight: '54px' }}>
                  {exam.description || 'No exam description provided.'}
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
                    <span>Passing Marks: {exam.passingMarks}%</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={14} />
                    <span>{exam.scheduleTime ? new Date(exam.scheduleTime).toLocaleDateString() : 'Self-Paced'}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => navigate(`/student/exams/${exam.id}/instructions`)}
                className="btn btn-primary"
                style={{ width: '100%', padding: '10px' }}
              >
                View Instructions
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExamList;
