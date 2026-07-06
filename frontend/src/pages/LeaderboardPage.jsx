import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Trophy, Award, Compass, Search } from 'lucide-react';

const LeaderboardPage = () => {
  const [exams, setExams] = useState([]);
  const [selectedExamId, setSelectedExamId] = useState('');
  const [rankings, setRankings] = useState([]);
  const [loadingRankings, setLoadingRankings] = useState(false);
  const [loadingExams, setLoadingExams] = useState(true);

  // Fetch Published Exams first
  useEffect(() => {
    const fetchExams = async () => {
      try {
        const response = await api.get('/exams');
        setExams(response.data);
        if (response.data.length > 0) {
          setSelectedExamId(response.data[0].id);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, []);

  // Fetch rankings whenever the selected exam ID changes
  useEffect(() => {
    if (!selectedExamId) return;

    const fetchRankings = async () => {
      setLoadingRankings(true);
      try {
        const response = await api.get(`/leaderboard/exams/${selectedExamId}`);
        setRankings(response.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingRankings(false);
      }
    };
    fetchRankings();
  }, [selectedExamId]);

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Trophy size={28} color="var(--color-warning)" />
          Honor Board & Leaderboards
        </h2>
        <p style={{ color: 'var(--text-secondary)' }}>
          Review the ranking table of top scoring candidates across examinations.
        </p>
      </div>

      {/* Select Exam Dropdown */}
      <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label className="form-label">Filter Leaderboard by Examination</label>
        {loadingExams ? (
          <p style={{ color: 'var(--text-secondary)' }}>Loading examinations list...</p>
        ) : exams.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No exams published yet.</p>
        ) : (
          <select
            className="form-control"
            value={selectedExamId}
            onChange={(e) => setSelectedExamId(e.target.value)}
            style={{ width: '100%', cursor: 'pointer' }}
          >
            {exams.map((exam) => (
              <option key={exam.id} value={exam.id}>{exam.title}</option>
            ))}
          </select>
        )}
      </div>

      {/* Leaderboard Table Card */}
      <div className="glass-card" style={{ padding: '0px' }}>
        {loadingRankings ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading board rankings...</p>
        ) : rankings.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            No submissions recorded yet for this exam. Be the first to secure a rank!
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th style={{ width: '80px', textAlign: 'center' }}>Rank</th>
                  <th>Student Name</th>
                  <th>Top Score</th>
                  <th>Percentage</th>
                  <th>Updated Time</th>
                </tr>
              </thead>
              <tbody>
                {rankings.map((rankObj) => {
                  let rankDisplay = rankObj.rank;
                  let badgeClass = '';

                  if (rankObj.rank === 1) {
                    rankDisplay = '🥇 1st';
                    badgeClass = 'badge-success';
                  } else if (rankObj.rank === 2) {
                    rankDisplay = '🥈 2nd';
                    badgeClass = 'badge-info';
                  } else if (rankObj.rank === 3) {
                    rankDisplay = '🥉 3rd';
                    badgeClass = 'badge-warning';
                  }

                  return (
                    <tr key={rankObj.id} style={{
                      backgroundColor: rankObj.rank <= 3 ? 'rgba(255,255,255,0.01)' : 'transparent'
                    }}>
                      <td style={{ textAlign: 'center', fontWeight: '800' }}>
                        {rankObj.rank <= 3 ? (
                          <span className={`badge ${badgeClass}`} style={{ fontSize: '0.8rem', padding: '4px 8px' }}>
                            {rankDisplay}
                          </span>
                        ) : (
                          <span>#{rankObj.rank}</span>
                        )}
                      </td>
                      <td style={{ fontWeight: '600' }}>{rankObj.studentName}</td>
                      <td>{rankObj.topScore.toFixed(1)} pts</td>
                      <td style={{ fontWeight: '700', color: 'var(--color-primary-400)' }}>
                        {rankObj.percentage.toFixed(1)}%
                      </td>
                      <td style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        {new Date(rankObj.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeaderboardPage;
