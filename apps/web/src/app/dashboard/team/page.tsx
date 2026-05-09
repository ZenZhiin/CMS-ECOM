'use client';

import React, { useEffect, useState } from 'react';
import { Users, Shield, Trash2, Mail, Calendar, Plus, Edit, X, Save, User as UserIcon } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';
import { Select } from '@/components/atoms/Select';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';

export default function TeamPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'EDITOR'
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const data = await apiFetch('/users');
      setUsers(data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (user: any = null) => {
    if (user) {
      setEditingUser(user);
      setFormData({ name: user.name || '', email: user.email, password: '', role: user.role });
    } else {
      setEditingUser(null);
      setFormData({ name: '', email: '', password: '', role: 'EDITOR' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingUser(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (editingUser) {
        const payload: any = { name: formData.name, email: formData.email, role: formData.role };
        if (formData.password) payload.password = formData.password;
        
        await apiFetch(`/users/${editingUser.id}`, {
          method: 'PATCH',
          body: JSON.stringify(payload)
        });
      } else {
        await apiFetch('/users', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
      }
      fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert('Operation failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await apiFetch(`/users/${userId}/role`, {
        method: 'PATCH',
        body: JSON.stringify({ role: newRole })
      });
      setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert('Failed to update role');
    }
  };

  const handleDelete = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this team member?')) return;
    try {
      await apiFetch(`/users/${userId}`, { method: 'DELETE' });
      setUsers(users.filter(u => u.id !== userId));
    } catch (err) {
      alert('Failed to delete user');
    }
  };

  const roleOptions = [
    { label: 'Administrator', value: 'ADMIN' },
    { label: 'Editor', value: 'EDITOR' },
    { label: 'Viewer', value: 'VIEWER' }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerTitle}>
          <h1 className="brand-font">Team Management</h1>
          <p>Manage access levels and roles for your CMS administrators and editors.</p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={18} />
          Add Team Member
        </Button>
      </header>

      <div className={styles.content}>
        {isLoading ? (
          <div className={styles.loading}>Loading team members...</div>
        ) : (
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Joined</th>
                  <th className={styles.actionsHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className={styles.userInfo}>
                        <div className={styles.avatar}>
                          {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                        </div>
                        <div className={styles.userDetails}>
                          <span className={styles.name}>{user.name || 'Anonymous User'}</span>
                          <span className={styles.email}>{user.email}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                       <Select 
                        options={roleOptions}
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className={styles.tableSelect}
                      />
                    </td>
                    <td>
                      <div className={styles.date}>
                        <Calendar size={14} />
                        {new Date(user.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className={styles.actionsCell}>
                      <div className={styles.actionGroup}>
                        <button className={styles.editBtn} onClick={() => handleOpenModal(user)}>
                          <Edit size={18} />
                        </button>
                        <button 
                          className={styles.deleteBtn}
                          onClick={() => handleDelete(user.id)}
                          disabled={user.role === 'ADMIN' && users.filter(u => u.role === 'ADMIN').length === 1}
                        >
                          <Trash2 size={18} />
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

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <header className={styles.modalHeader}>
              <h3>{editingUser ? 'Edit Member' : 'Invite Member'}</h3>
              <button onClick={handleCloseModal}><X size={20} /></button>
            </header>
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <Input 
                label="Full Name" 
                placeholder="e.g. John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
              <Input 
                label="Email Address" 
                type="email"
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
              <Input 
                label={editingUser ? "Change Password (optional)" : "Password"}
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={!editingUser}
              />
              <Select 
                label="System Role"
                options={roleOptions}
                value={formData.role}
                onChange={(e) => setFormData({...formData, role: e.target.value})}
              />
              <div className={styles.modalActions}>
                <Button variant="ghost" onClick={handleCloseModal} type="button">Cancel</Button>
                <Button type="submit" isLoading={isSubmitting}>
                  <Save size={18} />
                  {editingUser ? 'Save Changes' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
