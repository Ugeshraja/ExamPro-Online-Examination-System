import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, CheckCircle, Award, Compass, BarChart3, AlertCircle } from 'lucide-react';

const StudentDashboard = () => {
  const [stats, setStats] = useState(null);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, examsRes] = await Promise.all([
          api.get('/dashboard/student'),
          api.get('/exams')
        ]);
        setStats(statsRes.data);
        setExams(examsRes.data);
      } catch (err) {
        setError('Failed to load dashboard data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading Dashboard Performance metrics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="badge badge-danger" style={{ padding: '16px', display: 'block', margin: '20px auto' }}>
        {error}
      </div>
    );
  }

  const statCards = [
    {
      label: 'Available Exams',
      value: exams.length || 0,
      icon: <Compass size={24} color="var(--color-primary-400)" />,
      bg: 'rgba(37, 99, 235, 0.1)'
    },
    {
      label: 'Completed Tests',
      value: stats?.completedExamsCount || 0,
      icon: <CheckCircle size={24} color="var(--color-success)" />,
      bg: 'rgba(16, 185, 129, 0.1)'
    },
    {
      label: 'Average Score',
      value: `${stats?.averageScore?.toFixed(1) || '0.0'} pts`,
      icon: <Award size={24} color="var(--color-warning)" />,
      bg: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Candidate Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review your performance scores, take new tests, or check rank listings.
        </p>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '24px'
      }}>
        {statCards.map((card, i) => (
          <div key={i} className="glass-card" style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: '500' }}>
                {card.label}
              </span>
              <span style={{ fontSize: '2rem', fontWeight: '800', fontFamily: 'var(--font-heading)' }}>
                {card.value}
              </span>
            </div>
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '12px',
              backgroundColor: card.bg,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {card.icon}
            </div>
          </div>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
        gap: '30px'
      }}>
        {/* Available Exams Panel */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BookOpen size={20} color="var(--color-primary-400)" />
            <h3 style={{ fontSize: '1.25rem' }}>Active & Available Tests</h3>
          </div>

          {exams.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
              No exams are published at the moment.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {exams.slice(0, 3).map((exam) => (
                <div key={exam.id} style={{
                  padding: '16px',
                  borderRadius: '12px',
                  border: '1px solid var(--glass-border)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'rgba(255, 255, 255, 0.02)'
                }}>
                  <div>
                    <h4 style={{ fontSize: '1rem', fontWeight: '600' }}>{exam.title}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {exam.durationMinutes} mins | {exam.totalQuestions} Questions
                    </p>
                  </div>
                  <button onClick={() => navigate(`/student/exams/${exam.id}/instructions`)} className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                    Start Exam
                  </button>
                </div>
              ))}
              {exams.length > 3 && (
                <Link to="/student/exams" style={{ textAlign: 'center', fontSize: '0.9rem', color: 'var(--color-primary-400)', marginTop: '8px' }}>
                  View all available exams →
                </Link>
              )}
            </div>
          )}
        </div>

        {/* Recent Performance Results */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <BarChart3 size={20} color="var(--color-primary-400)" />
            <h3 style={{ fontSize: '1.25rem' }}>My Recent Scores</h3>
          </div>

          {(!stats?.recentScores || stats.recentScores.length === 0) ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
              You haven't completed any exams yet.
            </p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Exam Title</th>
                    <th>Score</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentScores.map((scoreObj) => (
                    <tr key={scoreObj.id}>
                      <td style={{ fontWeight: '550' }}>{scoreObj.examTitle}</td>
                      <td>{scoreObj.percentage.toFixed(1)}%</td>
                      <td>
                        <span className={`badge ${scoreObj.status === 'PASS' ? 'badge-success' : 'badge-danger'}`}>
                          {scoreObj.status}
                        </span>
                      </td>
                      <td>
                        <button onClick={() => navigate(`/results/${scoreObj.id}`)} className="btn btn-secondary" style={{ padding: '4px 10px', fontSize: '0.75rem' }}>
                          Report
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;
