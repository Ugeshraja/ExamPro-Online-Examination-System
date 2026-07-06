import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, FileText, Play, CheckCircle, Activity, Award } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/admin');
        setStats(response.data);
      } catch (err) {
        setError('Failed to fetch dashboard statistics.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading Dashboard Analytics...</div>
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
      label: 'Total Students',
      value: stats?.totalStudents || 0,
      icon: <Users size={24} color="var(--color-primary-400)" />,
      bg: 'rgba(37, 99, 235, 0.1)'
    },
    {
      label: 'Total Exams',
      value: stats?.totalExams || 0,
      icon: <FileText size={24} color="var(--color-primary-400)" />,
      bg: 'rgba(59, 130, 246, 0.1)'
    },
    {
      label: 'Active Exams',
      value: stats?.activeExams || 0,
      icon: <Play size={24} color="var(--color-success)" />,
      bg: 'rgba(16, 185, 129, 0.1)'
    },
    {
      label: 'Completed Exams',
      value: stats?.completedExams || 0,
      icon: <CheckCircle size={24} color="var(--color-warning)" />,
      bg: 'rgba(245, 158, 11, 0.1)'
    }
  ];

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '32px', width: '100%' }}>
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Administrative Control Panel</h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Real-time metrics, active exams monitoring, and student performance tracking.
        </p>
      </div>

      {/* Stats Grid */}
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

      {/* Main Sections */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '30px'
      }}>
        {/* Recent Submissions */}
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Activity size={20} color="var(--color-primary-400)" />
            <h3 style={{ fontSize: '1.25rem' }}>Recent Activity & Submissions</h3>
          </div>

          {(!stats?.recentActivities || stats.recentActivities.length === 0) ? (
            <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '24px' }}>
              No exam submissions logged yet.
            </p>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Exam Title</th>
                    <th>Score Achieved</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Submitted Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentActivities.map((act) => (
                    <tr key={act.id}>
                      <td style={{ fontWeight: '600' }}>{act.studentName}</td>
                      <td>{act.examTitle}</td>
                      <td>{act.score.toFixed(1)} pts</td>
                      <td style={{ fontWeight: '550' }}>{act.percentage.toFixed(1)}%</td>
                      <td>
                        <span className={`badge ${act.status === 'PASS' ? 'badge-success' : 'badge-danger'}`}>
                          {act.status}
                        </span>
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(act.submittedAt).toLocaleString()}
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

export default AdminDashboard;
