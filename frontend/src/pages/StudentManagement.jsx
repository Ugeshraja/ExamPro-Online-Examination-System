import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Search, UserPlus, Edit2, Trash2, X, Eye } from 'lucide-react';

const StudentManagement = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  
  // Form states
  const [editingStudent, setEditingStudent] = useState(null);
  const [viewingStudent, setViewingStudent] = useState(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const fetchStudents = async () => {
    try {
      const response = await api.get('/users/students');
      setStudents(response.data);
    } catch (err) {
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      fetchStudents();
      return;
    }
    try {
      const response = await api.get(`/users/students/search?q=${query}`);
      setStudents(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openAddModal = () => {
    setEditingStudent(null);
    setName('');
    setEmail('');
    setPassword('');
    setError('');
    setModalOpen(true);
  };

  const openEditModal = (student) => {
    setEditingStudent(student);
    setName(student.name);
    setEmail(student.email);
    setPassword(''); // leave blank if no change
    setError('');
    setModalOpen(true);
  };

  const openViewModal = (student) => {
    setViewingStudent(student);
    setViewModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      if (editingStudent) {
        // Edit student
        await api.put(`/users/students/${editingStudent.id}`, { name, email, password });
      } else {
        // Add student
        if (!password) {
          setError('Password is required for new students.');
          return;
        }
        await api.post('/users/students', { name, email, password });
      }
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save student.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student profile? This will wipe all their historical results.')) {
      return;
    }
    try {
      await api.delete(`/users/students/${id}`);
      fetchStudents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '24px', width: '100%' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>Student Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Add, edit, delete, and view candidate student accounts.</p>
        </div>
        <button onClick={openAddModal} className="btn btn-primary">
          <UserPlus size={18} />
          Add Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="glass-card" style={{ padding: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Search size={20} color="var(--text-secondary)" />
        <input
          type="text"
          className="form-control"
          placeholder="Search by student name or email..."
          value={searchQuery}
          onChange={handleSearch}
          style={{ width: '100%', background: 'transparent', border: 'none', padding: '4px' }}
        />
      </div>

      {/* Main Student Directory */}
      <div className="glass-card" style={{ padding: '0px' }}>
        {loading ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>Loading students...</p>
        ) : students.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>No student profiles found.</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Student Name</th>
                  <th>Email</th>
                  <th>Registered On</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td style={{ fontWeight: '600' }}>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{new Date(student.createdAt).toLocaleDateString()}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button onClick={() => openViewModal(student)} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                          <Eye size={14} />
                        </button>
                        <button onClick={() => openEditModal(student)} className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => handleDelete(student.id)} className="btn btn-danger" style={{ padding: '6px 10px', fontSize: '0.8rem' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
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
          <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '480px', padding: '32px', background: 'var(--bg-dark-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>{editingStudent ? 'Edit Student Details' : 'Add New Student'}</h3>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            {error && <div className="badge badge-danger" style={{ width: '100%', padding: '8px', marginBottom: '16px', textTransform: 'none' }}>{error}</div>}

            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input type="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="form-group">
                <label className="form-label">Password {editingStudent && <span style={{ color: 'var(--text-muted)' }}>(Leave blank to keep current)</span>}</label>
                <input type="password" className="form-control" placeholder={editingStudent ? '••••••••' : 'Min 6 characters'} value={password} onChange={(e) => setPassword(e.target.value)} required={!editingStudent} />
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '8px' }}>
                Save Profile
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {viewModalOpen && viewingStudent && (
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
          <div className="glass-card animate-slide-up" style={{ width: '100%', maxWidth: '440px', padding: '32px', background: 'var(--bg-dark-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '1.4rem' }}>Student Profile</h3>
              <button onClick={() => setViewModalOpen(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Student Name</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewingStudent.name}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Email Address</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{viewingStudent.email}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Role</span>
                <span className="badge badge-info" style={{ alignSelf: 'flex-start' }}>{viewingStudent.role}</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Registered On</span>
                <span style={{ fontSize: '1.1rem', fontWeight: '600' }}>{new Date(viewingStudent.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentManagement;
