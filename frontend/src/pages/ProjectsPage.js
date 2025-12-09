import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { applicationsAPI, messagesAPI } from '../services/api';
import ChatComponent from '../components/ChatComponent';
import ReviewDialog from '../components/ReviewDialog';

const ProjectsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedProject, setSelectedProject] = useState(null);
  const [showReviewDialog, setShowReviewDialog] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchProjects();
    }
  }, [isAuthenticated]);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await applicationsAPI.getAll();
      const acceptedProjects = response.data.filter(app => app.status !== 'pending' && app.status !== 'rejected');
      setProjects(acceptedProjects);
    } catch (err) {
      setError('Fehler beim Laden der Projekte');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitWork = async (applicationId) => {
    try {
      await messagesAPI.submitWorkForReview(applicationId);
      await fetchProjects();
    } catch (err) {
      setError('Fehler beim Einreichen der Arbeit');
    }
  };

  const handleReviewSubmitted = async () => {
    await fetchProjects();
    setShowReviewDialog(false);
  };

  if (!isAuthenticated) {
    return <div style={styles.container}><p style={{color: '#ff3333'}}>Bitte melde dich an</p></div>;
  }

  if (loading) return <div style={styles.container}><p>Lädt...</p></div>;

  return (
    <div style={styles.mainContainer}>
      <div style={styles.container}>
        <h1 style={styles.title}>📋 Meine Projekte</h1>
        {error && <div style={styles.error}>{error}</div>}

        {projects.length === 0 ? (
          <div style={styles.noProjects}>
            <p>Keine aktiven Projekte</p>
          </div>
        ) : (
          <div style={styles.projectsList}>
            {projects.map((project) => (
              <div key={project.id}>
                <ProjectCard
                  project={project}
                  userType={user.userType}
                  onSelect={setSelectedProject}
                  onSubmitWork={() => handleSubmitWork(project.id)}
                  onShowReview={() => {
                    setSelectedProject(project);
                    setShowReviewDialog(true);
                  }}
                  onRefresh={fetchProjects}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProject && (
        <div style={styles.chatContainer}>
          <div style={styles.chatHeader}>
            <h2 style={styles.chatHeader_h2}>Chat & Details</h2>
            <button 
              onClick={() => setSelectedProject(null)}
              style={styles.closeBtn}
            >
              ✕
            </button>
          </div>
          <ChatComponent 
            applicationId={selectedProject.id}
            projectTitle={selectedProject.Job?.title}
          />
          
          <div style={styles.statusInfo}>
            <p><strong>Status:</strong> {selectedProject.status}</p>
            <p><strong>Budget:</strong> <span style={styles.budget}>{selectedProject.bidAmount} €</span></p>
            {selectedProject.status === 'submitted' && user.userType === 'client' && (
              <button
                onClick={() => setShowReviewDialog(true)}
                style={styles.reviewBtn}
              >
                📋 Arbeit überprüfen
              </button>
            )}
            {selectedProject.status === 'in_progress' && user.userType === 'freelancer' && selectedProject.freelancerSubmittedWork === false && (
              <button
                onClick={() => handleSubmitWork(selectedProject.id)}
                style={styles.submitBtn}
              >
                📤 Arbeit einreichen
              </button>
            )}
          </div>
        </div>
      )}

      {showReviewDialog && selectedProject && (
        <ReviewDialog
          applicationId={selectedProject.id}
          onReviewSubmitted={handleReviewSubmitted}
          onClose={() => setShowReviewDialog(false)}
        />
      )}
    </div>
  );
};

const ProjectCard = ({ project, userType, onSelect, onSubmitWork, onShowReview }) => {
  const isClient = userType === 'client';
  const statusLabel = {
    accepted: '✅ Akzeptiert',
    in_progress: '⏳ In Bearbeitung',
    submitted: '📤 Eingereicht',
    in_review: '🔍 In Überprüfung',
    approved: '✅ Genehmigt',
    completed: '🎉 Abgeschlossen',
    disputed: '⚠️ Dispute'
  };

  return (
    <div style={styles.projectCard} onClick={() => onSelect(project)}>
      <div style={styles.projectHeader}>
        <div>
          <h3 style={styles.projectTitle}>{project.Job?.title || 'Projekt'}</h3>
          <p style={styles.freelancerName}>
            {isClient 
              ? `Freelancer: ${project.freelancer?.firstName}`
              : `Client: ${project.Job?.client?.firstName}`
            }
          </p>
        </div>
        <span style={styles.statusBadge}>{statusLabel[project.status] || project.status}</span>
      </div>

      <div style={styles.projectInfo}>
        <p><strong>Budget:</strong> <span style={styles.budget}>{project.bidAmount} €</span></p>
        <p><strong>Status:</strong> {project.status}</p>
      </div>

      <div style={styles.actions}>
        {project.status === 'accepted' && isClient && (
          <button style={styles.actionBtn}>
            💳 Zahlung abgeben
          </button>
        )}
        {project.status === 'in_progress' && !isClient && !project.freelancerSubmittedWork && (
          <button onClick={onSubmitWork} style={styles.actionBtn}>
            📤 Arbeit einreichen
          </button>
        )}
        {project.status === 'submitted' && isClient && (
          <button onClick={onShowReview} style={{...styles.actionBtn, backgroundColor: '#ff3333'}}>
            📋 Überprüfen
          </button>
        )}
      </div>
    </div>
  );
};

const styles = {
  mainContainer: {
    display: 'grid',
    gridTemplateColumns: '1fr 400px',
    gap: '2rem',
    backgroundColor: '#0f0f0f',
    minHeight: 'calc(100vh - 70px)',
    padding: '2rem'
  },
  container: {
    maxWidth: '100%'
  },
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    height: 'fit-content'
  },
  chatHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    color: '#00ff00',
    marginBottom: '0.5rem'
  },
  chatHeader_h2: {
    margin: 0,
    fontSize: '1.1rem'
  },
  closeBtn: {
    backgroundColor: '#333',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    padding: '0.25rem 0.75rem',
    cursor: 'pointer'
  },
  title: {
    fontSize: '2rem',
    color: '#00ff00',
    marginBottom: '2rem'
  },
  error: {
    backgroundColor: '#4a0000',
    color: '#ff6666',
    padding: '1rem',
    borderRadius: '4px',
    marginBottom: '1rem'
  },
  noProjects: {
    backgroundColor: '#1a1a1a',
    padding: '2rem',
    borderRadius: '8px',
    textAlign: 'center',
    color: '#888'
  },
  projectsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  projectCard: {
    backgroundColor: '#1a1a1a',
    padding: '1.5rem',
    borderRadius: '8px',
    border: '1px solid #00ff00',
    cursor: 'pointer',
    transition: 'all 0.3s'
  },
  projectHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem',
    paddingBottom: '1rem',
    borderBottom: '1px solid #333'
  },
  projectTitle: {
    color: '#00ff00',
    margin: '0 0 0.5rem 0',
    fontSize: '1.1rem'
  },
  freelancerName: {
    color: '#888',
    margin: 0,
    fontSize: '0.9rem'
  },
  statusBadge: {
    backgroundColor: '#2a2a2a',
    color: '#aaa',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.85rem'
  },
  projectInfo: {
    color: '#aaa',
    marginBottom: '1rem'
  },
  budget: {
    color: '#ff3333',
    fontWeight: 'bold'
  },
  actions: {
    display: 'flex',
    gap: '0.75rem',
    flexWrap: 'wrap'
  },
  actionBtn: {
    flex: 1,
    minWidth: '150px',
    padding: '0.5rem',
    backgroundColor: '#00ff00',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  statusInfo: {
    backgroundColor: '#1a1a1a',
    padding: '1rem',
    borderRadius: '8px',
    border: '1px solid #333',
    color: '#aaa',
    fontSize: '0.9rem'
  },
  submitBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#00ff00',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem'
  },
  reviewBtn: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#ff3333',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    marginTop: '1rem'
  }
};

export default ProjectsPage;
