import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, Clock, AlertTriangle, ArrowLeft, Play, Info } from 'lucide-react';

const ExamInstructions = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [agreed, setAgreed] = useState(false);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        const response = await api.get(`/exams/${examId}`);
        setExam(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  const handleStart = () => {
    if (!agreed) return;
    navigate(`/student/exams/${examId}/take`);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading exam instructions...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade" style={{ maxWidth: '800px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button onClick={() => navigate('/student/exams')} className="btn btn-secondary" style={{ padding: '8px' }}>
          <ArrowLeft size={18} />
        </button>
        <div>
          <h2 style={{ fontSize: '1.8rem' }}>Exam Instructions & Guidelines</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Please review the guidelines below carefully before launching the session.</p>
        </div>
      </div>

      <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        <div>
          <h3 style={{ fontSize: '1.3rem', color: 'var(--color-primary-400)', marginBottom: '6px' }}>{exam?.title}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>{exam?.description}</p>
        </div>

        {/* Info Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '16px',
          padding: '16px',
          borderRadius: '12px',
          backgroundColor: 'rgba(255,255,255,0.02)',
          border: '1px solid var(--glass-border)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Duration</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{exam?.durationMinutes} Minutes</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Total Questions</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{exam?.totalQuestions} Questions</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Passing Score</span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700' }}>{exam?.passingMarks}%</span>
          </div>
        </div>

        {/* Security Rules Banner */}
        <div style={{
          padding: '20px',
          borderRadius: '12px',
          backgroundColor: 'rgba(239, 68, 68, 0.05)',
          border: '1px solid rgba(239, 68, 68, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--color-error)', fontWeight: '700' }}>
            <Shield size={20} />
            <span>Anti-Cheating Proctoring Regulations</span>
          </div>
          <ul style={{
            paddingLeft: '20px',
            fontSize: '0.9rem',
            lineHeight: '1.6',
            color: 'var(--text-primary)',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            <li><strong>Fullscreen Mode Mandated:</strong> The exam console must run in fullscreen. Exiting fullscreen triggers immediate warnings, and repeated exits will auto-submit.</li>
            <li><strong>Tab Switching Prohibited:</strong> Navigating away from this tab, opening other applications, or tab switching registers violations. The test auto-submits after 3 violations.</li>
            <li><strong>Copy-Paste Disabled:</strong> Keyboard copy (<kbd>Ctrl+C</kbd>), paste (<kbd>Ctrl+V</kbd>), cut (<kbd>Ctrl+X</kbd>), select all (<kbd>Ctrl+A</kbd>), right-click menus, and dragging text are disabled.</li>
            <li><strong>Auto-Submit Timer:</strong> When the countdown timer reaches zero, all saved questions are submitted automatically.</li>
          </ul>
        </div>

        {/* Agreement checkbox */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px',
          borderRadius: '8px',
          border: '1px solid var(--glass-border)',
          backgroundColor: 'rgba(255, 255, 255, 0.01)'
        }}>
          <input
            type="checkbox"
            id="agreeCheckbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
          />
          <label htmlFor="agreeCheckbox" style={{
            fontSize: '0.925rem',
            color: 'var(--text-primary)',
            cursor: 'pointer',
            fontWeight: '500'
          }}>
            I have read the anti-cheating regulations, understand them, and agree to launch the exam under these parameters.
          </label>
        </div>

        <button
          onClick={handleStart}
          disabled={!agreed}
          className="btn btn-primary"
          style={{
            width: '100%',
            padding: '14px',
            fontSize: '1rem',
            opacity: agreed ? 1 : 0.5,
            cursor: agreed ? 'pointer' : 'not-allowed'
          }}
        >
          <Play size={18} />
          Start Examination
        </button>
      </div>
    </div>
  );
};

export default ExamInstructions;
