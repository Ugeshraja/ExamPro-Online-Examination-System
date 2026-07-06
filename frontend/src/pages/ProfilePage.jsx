import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { User, Mail, Lock, CheckCircle, ShieldAlert } from 'lucide-react';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('STUDENT');
  const [registeredOn, setRegisteredOn] = useState('');
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/users/profile');
        const user = response.data;
        setName(user.name);
        setEmail(user.email);
        setRole(user.role);
        setRegisteredOn(user.createdAt);
      } catch (err) {
        console.error(err);
        setError('Failed to load user profile information.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email) {
      setError('Name and Email are required.');
      return;
    }

    if (password) {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters.');
        return;
      }
    }

    setSaving(true);
    try {
      await api.put('/users/profile', { name, email, password });
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
      
      // Update local storage user name
      const localUser = JSON.parse(localStorage.getItem('user'));
      localUser.name = name;
      localUser.email = email;
      localStorage.setItem('user', JSON.stringify(localUser));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '100px' }}>
        <div style={{ color: 'var(--text-secondary)' }}>Loading profile information...</div>
      </div>
    );
  }

  return (
    <div className="animate-fade" style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div>
        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Profile Settings</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Modify your name or update account password.</p>
      </div>

      <div className="glass-card" style={{ padding: '32px' }}>
        {error && (
          <div className="badge badge-danger" style={{ width: '100%', padding: '10px', marginBottom: '16px', textTransform: 'none' }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="badge badge-success" style={{ width: '100%', padding: '10px', marginBottom: '16px', textTransform: 'none' }}>
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div style={{ position: 'relative' }}>
              <User size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} style={{ paddingLeft: '42px', width: '100%' }} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} style={{ paddingLeft: '42px', width: '100%' }} required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label className="form-label">Role</label>
              <input type="text" className="form-control" value={role} disabled style={{ opacity: 0.6 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Registered Date</label>
              <input type="text" className="form-control" value={new Date(registeredOn).toLocaleDateString()} disabled style={{ opacity: 0.6 }} />
            </div>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid var(--glass-border)', margin: '10px 0' }} />

          <div className="form-group">
            <label className="form-label">New Password <span style={{ color: 'var(--text-muted)' }}>(Leave blank to keep current)</span></label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" className="form-control" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} style={{ paddingLeft: '42px', width: '100%' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input type="password" className="form-control" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ paddingLeft: '42px', width: '100%' }} />
            </div>
          </div>

          <button type="submit" disabled={saving} className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
            {saving ? 'Saving changes...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
