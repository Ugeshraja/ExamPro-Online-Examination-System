import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  Trophy, 
  User, 
  FileSpreadsheet
} from 'lucide-react';

const Sidebar = () => {
  const { user } = useAuth();

  if (!user) return null;

  const adminLinks = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/admin/students', label: 'Students', icon: <Users size={18} /> },
    { to: '/admin/exams', label: 'Exams', icon: <BookOpen size={18} /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> }
  ];

  const studentLinks = [
    { to: '/student/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { to: '/student/exams', label: 'Available Exams', icon: <BookOpen size={18} /> },
    { to: '/leaderboard', label: 'Leaderboard', icon: <Trophy size={18} /> },
    { to: '/profile', label: 'My Profile', icon: <User size={18} /> }
  ];

  const links = user.role === 'ADMIN' ? adminLinks : studentLinks;

  return (
    <aside className="glass-card" style={{
      width: '260px',
      minHeight: 'calc(100vh - 120px)',
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      padding: '24px 16px'
    }}>
      <div style={{
        padding: '0 8px 16px 8px',
        borderBottom: '1px solid var(--glass-border)',
        marginBottom: '12px'
      }}>
        <h3 style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
          Navigation Menu
        </h3>
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 16px',
              borderRadius: '8px',
              color: isActive ? '#ffffff' : 'var(--text-secondary)',
              background: isActive ? 'rgba(37, 99, 235, 0.15)' : 'transparent',
              borderLeft: isActive ? '3px solid var(--color-primary-500)' : '3px solid transparent',
              transition: 'all 0.2s ease',
              fontWeight: isActive ? '600' : '450'
            })}
          >
            {link.icon}
            <span style={{ fontSize: '0.95rem' }}>{link.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
