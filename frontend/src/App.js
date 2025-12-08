import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navigation from './components/Navigation';
import ConceptPage from './pages/ConceptPage';
import HomePage from './pages/HomePage';
import AuthPage from './pages/AuthPage';
import JobsListPage from './pages/JobsListPage';
import DebugJobsPage from './pages/DebugJobsPage';
import CreateJobPage from './pages/CreateJobPage';
import ProjectsPage from './pages/ProjectsPage';
import JobsAdminPage from './pages/JobsAdminPage';
import RequestsPage from './pages/RequestsPage';
import ApplicationsPage from './pages/ApplicationsPage';
import MessagesPage from './pages/MessagesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import PrivacyPage from './pages/PrivacyPage';
import TermsPage from './pages/TermsPage';
import ImprintPage from './pages/ImprintPage';
import FAQPage from './pages/FAQPage';
import MessageThreadPage from './pages/MessageThreadPage';
import AdminDashboard from './pages/AdminDashboard';

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  
  // Warte, bis der User geladen wurde
  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: '#fff'}}>Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/auth" />;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/concept" element={<ConceptPage />} />
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/jobs" element={<JobsListPage />} />
          <Route path="/debug-react-jobs" element={<DebugJobsPage />} />
          <Route path="/admin/jobs" element={<JobsAdminPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/imprint" element={<ImprintPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route 
            path="/jobs/create" 
            element={
              <PrivateRoute>
                <CreateJobPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/projects" 
            element={
              <PrivateRoute>
                <ProjectsPage />
              </PrivateRoute>
            } 
          />
          <Route path="/requests" element={<PrivateRoute><RequestsPage /></PrivateRoute>} />
          <Route path="/applications" element={<PrivateRoute><ApplicationsPage /></PrivateRoute>} />
          <Route path="/messages" element={<PrivateRoute><MessagesPage /></PrivateRoute>} />
          <Route path="/messages/:applicationId" element={<PrivateRoute><MessageThreadPage /></PrivateRoute>} />
          <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
