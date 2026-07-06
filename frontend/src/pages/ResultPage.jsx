import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import { Award, CheckCircle, XCircle, Clock, BookOpen, User, Download, AlertTriangle, ArrowLeft } from 'lucide-react';

const ResultPage = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await api.get(`/results/${resultId}`);
        setResult(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchResult();
  }, [resultId]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading scorecard...</div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="badge badge-danger" style={{ padding: '16px', display: 'block', margin: '20px auto' }}>
        Scorecard not found.
      </div>
    );
  }

  const isPass = result.status === 'PASS';

  return (
    <div className="animate-fade" style={{ maxWidth: '720px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      {/* Hide back button in print mode */}
      <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/student/dashboard')} className="btn btn-secondary" style={{ padding: '8px' }}>
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>
        <button onClick={handlePrint} className="btn btn-primary">
          <Download size={16} />
          Download Result (PDF)
        </button>
      </div>

      {/* Printable Card Area */}
      <div className="glass-card print-container" style={{
        padding: '40px 32px',
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        border: '1.5px solid var(--glass-border)'
      }}>
        {/* Certification Title */}
        <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '8px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '24px' }}>
          <h2 style={{ fontSize: '2rem', fontFamily: 'var(--font-heading)', letterSpacing: '-0.02em' }}>EXAMPRO SCORE REPORT</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Official Certificate of Results</p>
        </div>

        {/* User profile & Exam details */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '20px',
          fontSize: '0.95rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={18} color="var(--text-secondary)" />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>CANDIDATE NAME</span>
              <strong style={{ fontSize: '1rem' }}>{result.studentName}</strong>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={18} color="var(--text-secondary)" />
            <div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'block' }}>EXAMINATION</span>
              <strong style={{ fontSize: '1rem' }}>{result.examTitle}</strong>
            </div>
          </div>
        </div>

        {/* Result banner (Pass/Fail) */}
        <div style={{
          padding: '24px',
          borderRadius: '16px',
          backgroundColor: isPass ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
          border: '1.5px solid',
          borderColor: isPass ? 'var(--color-success)' : 'var(--color-error)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '12px',
          textAlign: 'center'
        }}>
          {isPass ? (
            <CheckCircle size={48} color="var(--color-success)" />
          ) : (
            <XCircle size={48} color="var(--color-error)" />
          )}
          <div>
            <h3 style={{ fontSize: '1.6rem', color: isPass ? 'var(--color-success)' : 'var(--color-error)' }}>
              RESULT: {result.status}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginTop: '4px' }}>
              {isPass ? 'Congratulations! You have cleared this examination.' : 'Unfortunately, you did not secure the passing marks.'}
            </p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '16px'
        }}>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Score</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>{result.score.toFixed(1)}</span>
          </div>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Percentage</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>{result.percentage.toFixed(1)}%</span>
          </div>
          <div className="glass-card" style={{ padding: '16px', textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Time Taken</span>
            <span style={{ fontSize: '1.4rem', fontWeight: '800' }}>{Math.floor(result.timeTakenSeconds / 60)}m {result.timeTakenSeconds % 60}s</span>
          </div>
        </div>

        {/* Answer Breakdown */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr 1fr',
          gap: '12px',
          padding: '16px 0',
          borderTop: '1px solid var(--glass-border)',
          borderBottom: '1px solid var(--glass-border)'
        }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Correct</span>
            <span className="badge badge-success">{result.correctAnswers}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Wrong</span>
            <span className="badge badge-danger">{result.wrongAnswers}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>Skipped</span>
            <span className="badge badge-info">{result.skippedQuestions}</span>
          </div>
        </div>

        {/* Verification footer */}
        <div style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          Scorecard generated automatically on {new Date(result.submittedAt).toLocaleString()} by ExamPro Examination Engine.
          ID: {result.id}
        </div>
      </div>

      {/* Embedded print styles */}
      <style>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          .print-container {
            border: none !important;
            box-shadow: none !important;
            background: #ffffff !important;
            color: #000000 !important;
            backdrop-filter: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          h2, h3, strong, span, td, th {
            color: #000000 !important;
          }
          .glass-card {
            border: 1px solid #cccccc !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ResultPage;
