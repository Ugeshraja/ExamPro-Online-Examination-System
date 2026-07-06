import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User as UserIcon, ShieldAlert } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="glass-card" style={{
      borderRadius: '0 0 16px 16px',
      padding: '12px 24px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      borderTop: 'none'
    }}>
      <Link to={user.role === 'ADMIN' ? '/admin/dashboard' : '/student/dashboard'} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        color: '#ffffff',
        fontFamily: 'var(--font-heading)',
        fontSize: '1.4rem',
        fontWeight: '800'
      }}>
        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '8px',
          background: 'linear-gradient(135deg, var(--color-primary-400) 0%, var(--color-primary-600) 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff'
        }}>
          EP
        </div>
        Exam<span style={{ color: 'var(--color-primary-400)' }}>Pro</span>
      </Link>

      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <UserIcon size={16} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.9rem', fontWeight: '600' }}>{user.name}</span>
            <span className="badge badge-info" style={{
              fontSize: '0.65rem',
              padding: '1px 6px',
              marginTop: '2px',
              alignSelf: 'flex-start'
            }}>{user.role}</span>
          </div>
        </div>

        <button onClick={handleLogout} className="btn btn-secondary" style={{
          padding: '8px 12px',
          fontSize: '0.85rem',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <LogOut size={14} />
          Sign Out
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
