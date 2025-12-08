import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('stats');
  const [error, setError] = useState('');
  const [showAdmins, setShowAdmins] = useState(true);
  const [showClients, setShowClients] = useState(true);
  const [showFreelancers, setShowFreelancers] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data);
    } catch (err) {
      console.error('Admin stats error:', err);
      setError('Zugriff verweigert - Keine Admin-Rechte');
      setTimeout(() => navigate('/'), 2000);
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsers(res.data);
    } catch (err) {
      console.error('Admin users error:', err);
    }
  };

  const fetchJobs = async () => {
    try {
      const res = await api.get('/admin/jobs');
      setJobs(res.data);
    } catch (err) {
      console.error('Admin jobs error:', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await api.get('/admin/payments');
      setPayments(res.data);
    } catch (err) {
      console.error('Admin payments error:', err);
    }
  };

  const deleteUser = async (id) => {
    if (!window.confirm('User wirklich löschen?')) return;
    try {
      await api.delete(`/admin/users/${id}`);
      alert('User gelöscht');
      fetchUsers();
      fetchStats();
    } catch (err) {
      console.error('Delete user error:', err);
      alert('Fehler beim Löschen');
    }
  };

  const deleteJob = async (id) => {
    if (!window.confirm('Job wirklich löschen?')) return;
    try {
      await api.delete(`/admin/jobs/${id}`);
      alert('Job gelöscht');
      fetchJobs();
      fetchStats();
    } catch (err) {
      console.error('Delete job error:', err);
      alert('Fehler beim Löschen');
    }
  };

  useEffect(() => {
    if (activeTab === 'users' && users.length === 0) fetchUsers();
    if (activeTab === 'jobs' && jobs.length === 0) fetchJobs();
    if (activeTab === 'payments' && payments.length === 0) fetchPayments();
  }, [activeTab]);

  if (loading) {
    return <div style={styles.container}><div style={styles.loading}>Lade Admin-Dashboard...</div></div>;
  }

  if (error) {
    return <div style={styles.container}><div style={styles.error}>{error}</div></div>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>🔐 Admin Dashboard</h1>
      <p style={styles.subtitle}>Willkommen, {user?.firstName || 'Admin'}!</p>

      <div style={styles.tabs}>
        <button onClick={() => setActiveTab('stats')} style={{...styles.tab, ...(activeTab === 'stats' ? styles.tabActive : {})}}>📊 Statistiken</button>
        <button onClick={() => setActiveTab('users')} style={{...styles.tab, ...(activeTab === 'users' ? styles.tabActive : {})}}>👥 User</button>
        <button onClick={() => setActiveTab('jobs')} style={{...styles.tab, ...(activeTab === 'jobs' ? styles.tabActive : {})}}>💼 Jobs</button>
        <button onClick={() => setActiveTab('payments')} style={{...styles.tab, ...(activeTab === 'payments' ? styles.tabActive : {})}}>💰 Zahlungen</button>
      </div>

      {activeTab === 'stats' && stats && (
        <div style={styles.content}>
          <div style={styles.grid}>
            <div style={styles.card}>
              <h3 style={styles.cardTitle}>👥 User</h3>
              <div style={styles.statRow}>
                <span>Gesamt:</span>
                <strong>{stats.database.users.total}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Freelancer:</span>
                <strong style={{color: '#10b981'}}>{stats.database.users.freelancers}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Clients:</span>
                <strong style={{color: '#ef4444'}}>{stats.database.users.clients}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Neu (7 Tage):</span>
                <strong style={{color: '#ffa500'}}>{stats.database.users.newThisWeek}</strong>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>💼 Jobs</h3>
              <div style={styles.statRow}>
                <span>Gesamt:</span>
                <strong>{stats.database.jobs.total}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Aktiv:</span>
                <strong style={{color: '#10b981'}}>{stats.database.jobs.active}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Abgeschlossen:</span>
                <strong style={{color: '#888'}}>{stats.database.jobs.completed}</strong>
              </div>
            </div>

            <div style={styles.card}>
              <h3 style={styles.cardTitle}>📝 Bewerbungen</h3>
              <div style={styles.statRow}>
                <span>Gesamt:</span>
                <strong>{stats.database.applications.total}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Pending:</span>
                <strong style={{color: '#ffa500'}}>{stats.database.applications.pending}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Akzeptiert:</span>
                <strong style={{color: '#10b981'}}>{stats.database.applications.accepted}</strong>
              </div>
            </div>

            <div style={styles.compactCard}>
              <h3 style={styles.cardTitle}>💰 Zahlungen</h3>
              <div style={styles.statRow}>
                <span>Total:</span>
                <strong>{stats.database.payments.total}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Umsatz:</span>
                <strong style={{color: '#10b981'}}>${stats.database.payments.revenue}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Escrow:</span>
                <strong style={{color: '#ffa500'}}>${stats.database.payments.escrow}</strong>
              </div>
            </div>
          </div>

          <div style={styles.statsGrid}>
            <div style={styles.compactCard}>
              <h3 style={styles.cardTitle}>💬 Nachrichten</h3>
              <div style={styles.statRow}>
                <span>Gesamt:</span>
                <strong>{stats.database.messages}</strong>
              </div>
            </div>

            <div style={styles.compactCard}>
              <h3 style={styles.cardTitle}>🖥️ System</h3>
              <div style={styles.statRow}>
                <span>Platform:</span>
                <strong style={{fontSize: '0.8rem'}}>{stats.system.platform}</strong>
              </div>
              <div style={styles.statRow}>
                <span>RAM:</span>
                <strong style={{color: '#10b981', fontSize: '0.8rem'}}>{stats.system.freeMemory}/{stats.system.totalMemory}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Uptime:</span>
                <strong style={{fontSize: '0.8rem'}}>{stats.system.uptime}</strong>
              </div>
            </div>

            <div style={styles.compactCard}>
              <h3 style={styles.cardTitle}>⚙️ Details</h3>
              <div style={styles.statRow}>
                <span>CPUs:</span>
                <strong>{stats.system.cpus}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Node:</span>
                <strong style={{fontSize: '0.8rem'}}>{stats.system.nodeVersion}</strong>
              </div>
              <div style={styles.statRow}>
                <span>Uploads:</span>
                <strong style={{fontSize: '0.8rem'}}>{stats.system.uploadsDirSize}</strong>
              </div>
            </div>

            <div style={styles.compactCard}>
              <h3 style={styles.cardTitle}>📊 Arch</h3>
              <div style={styles.statRow}>
                <span>Typ:</span>
                <strong>{stats.system.arch}</strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>👥 User-Liste</h2>
          
          {/* Admin Section */}
          <div style={styles.userSection}>
            <div 
              style={styles.sectionHeader}
              onClick={() => setShowAdmins(!showAdmins)}
            >
              <h3 style={{color: '#ff9800', margin: 0}}>
                {showAdmins ? '▼' : '▶'} 🔐 Admins ({users.filter(u => u.isAdmin).length})
              </h3>
            </div>
            {showAdmins && (
              <div style={styles.table}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid #333'}}>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Registriert</th>
                      <th style={styles.th}>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => u.isAdmin).map(u => (
                      <tr key={u.id} style={{borderBottom: '1px solid #222'}}>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>{u.firstName} {u.lastName}</td>
                        <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString('de-DE')}</td>
                        <td style={styles.td}>
                          <button onClick={() => deleteUser(u.id)} style={styles.deleteBtn}>🗑️ Löschen</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Client Section */}
          <div style={styles.userSection}>
            <div 
              style={styles.sectionHeader}
              onClick={() => setShowClients(!showClients)}
            >
              <h3 style={{color: '#ef4444', margin: 0}}>
                {showClients ? '▼' : '▶'} 💼 Clients ({users.filter(u => !u.isAdmin && u.userType === 'client').length})
              </h3>
            </div>
            {showClients && (
              <div style={styles.table}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid #333'}}>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Registriert</th>
                      <th style={styles.th}>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => !u.isAdmin && u.userType === 'client').map(u => (
                      <tr key={u.id} style={{borderBottom: '1px solid #222'}}>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>{u.firstName} {u.lastName}</td>
                        <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString('de-DE')}</td>
                        <td style={styles.td}>
                          <button onClick={() => deleteUser(u.id)} style={styles.deleteBtn}>🗑️ Löschen</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Freelancer Section */}
          <div style={styles.userSection}>
            <div 
              style={styles.sectionHeader}
              onClick={() => setShowFreelancers(!showFreelancers)}
            >
              <h3 style={{color: '#10b981', margin: 0}}>
                {showFreelancers ? '▼' : '▶'} 🎨 Freelancers ({users.filter(u => !u.isAdmin && u.userType === 'freelancer').length})
              </h3>
            </div>
            {showFreelancers && (
              <div style={styles.table}>
                <table style={{width: '100%', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{borderBottom: '2px solid #333'}}>
                      <th style={styles.th}>Email</th>
                      <th style={styles.th}>Name</th>
                      <th style={styles.th}>Registriert</th>
                      <th style={styles.th}>Aktionen</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.filter(u => !u.isAdmin && u.userType === 'freelancer').map(u => (
                      <tr key={u.id} style={{borderBottom: '1px solid #222'}}>
                        <td style={styles.td}>{u.email}</td>
                        <td style={styles.td}>{u.firstName} {u.lastName}</td>
                        <td style={styles.td}>{new Date(u.createdAt).toLocaleDateString('de-DE')}</td>
                        <td style={styles.td}>
                          <button onClick={() => deleteUser(u.id)} style={styles.deleteBtn}>🗑️ Löschen</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'jobs' && (
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>💼 Job-Liste</h2>
          <div style={styles.table}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #333'}}>
                  <th style={styles.th}>Titel</th>
                  <th style={styles.th}>Client</th>
                  <th style={styles.th}>Budget</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Erstellt</th>
                  <th style={styles.th}>Aktionen</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map(j => (
                  <tr key={j.id} style={{borderBottom: '1px solid #222'}}>
                    <td style={styles.td}>{j.title}</td>
                    <td style={styles.td}>{j.client ? `${j.client.firstName} ${j.client.lastName}` : j.clientId}</td>
                    <td style={styles.td}>${j.budget}</td>
                    <td style={styles.td}>
                      <span style={{color: j.status === 'open' ? '#10b981' : '#888'}}>
                        {j.status}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(j.createdAt).toLocaleDateString('de-DE')}</td>
                    <td style={styles.td}>
                      <button onClick={() => deleteJob(j.id)} style={styles.deleteBtn}>🗑️ Löschen</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div style={styles.content}>
          <h2 style={styles.sectionTitle}>💰 Zahlungs-Liste</h2>
          <div style={styles.table}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{borderBottom: '2px solid #333'}}>
                  <th style={styles.th}>Betrag</th>
                  <th style={styles.th}>Freelancer</th>
                  <th style={styles.th}>Projekt</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Datum</th>
                </tr>
              </thead>
              <tbody>
                {payments.map(p => (
                  <tr key={p.id} style={{borderBottom: '1px solid #222'}}>
                    <td style={styles.td}>${parseFloat(p.amount).toFixed(2)}</td>
                    <td style={styles.td}>
                      {p.application?.freelancer ? 
                        `${p.application.freelancer.firstName} ${p.application.freelancer.lastName}` : 
                        'N/A'}
                    </td>
                    <td style={styles.td}>
                      {p.application?.job?.title || 'N/A'}
                    </td>
                    <td style={styles.td}>
                      <span style={{
                        color: p.status === 'captured' ? '#10b981' : 
                               p.status === 'authorized' ? '#ff9800' : '#888'
                      }}>
                        {p.status}
                      </span>
                    </td>
                    <td style={styles.td}>{new Date(p.createdAt).toLocaleDateString('de-DE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '2rem',
    backgroundColor: '#0f0f0f',
    minHeight: '100vh',
    color: '#ddd'
  },
  title: {
    color: '#00a8ff',
    fontSize: '2.5rem',
    marginBottom: '0.5rem'
  },
  subtitle: {
    color: '#888',
    marginBottom: '2rem'
  },
  tabs: {
    display: 'flex',
    gap: '1rem',
    marginBottom: '2rem',
    borderBottom: '2px solid #333',
    paddingBottom: '0.5rem'
  },
  tab: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#888',
    cursor: 'pointer',
    fontSize: '1rem',
    transition: 'all 0.3s'
  },
  tabActive: {
    color: '#00a8ff',
    borderBottom: '3px solid #00a8ff'
  },
  content: {
    marginTop: '2rem'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem',
    borderRadius: '12px',
    border: '2px solid #333'
  },
  compactCard: {
    backgroundColor: '#1a1a1a',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #333'
  },
  cardTitle: {
    color: '#00a8ff',
    marginBottom: '1rem',
    fontSize: '1.3rem'
  },
  statRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #222',
    fontSize: '0.95rem'
  },
  sectionTitle: {
    color: '#00a8ff',
    marginBottom: '1rem'
  },
  userSection: {
    marginBottom: '2rem'
  },
  sectionHeader: {
    backgroundColor: '#1a1a1a',
    padding: '1rem',
    borderRadius: '8px',
    border: '2px solid #333',
    cursor: 'pointer',
    transition: 'all 0.2s',
    marginBottom: '0.5rem'
  },
  table: {
    backgroundColor: '#1a1a1a',
    padding: '1rem',
    borderRadius: '12px',
    border: '2px solid #333',
    overflowX: 'auto'
  },
  th: {
    padding: '1rem',
    textAlign: 'left',
    color: '#00a8ff',
    fontWeight: '600'
  },
  td: {
    padding: '0.75rem 1rem',
    color: '#ddd'
  },
  deleteBtn: {
    padding: '0.4rem 0.8rem',
    backgroundColor: '#ef4444',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: '600'
  },
  loading: {
    textAlign: 'center',
    padding: '3rem',
    color: '#00a8ff',
    fontSize: '1.2rem'
  },
  error: {
    textAlign: 'center',
    padding: '3rem',
    color: '#ef4444',
    fontSize: '1.2rem'
  }
};

export default AdminDashboard;
