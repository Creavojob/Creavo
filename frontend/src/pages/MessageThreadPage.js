import React from 'react';
import { useParams } from 'react-router-dom';
import ChatComponent from '../components/ChatComponent';
import { useState, useEffect } from 'react';
import { applicationsAPI } from '../services/api';

const MessageThreadPage = () => {
  const { applicationId } = useParams();
  const [title, setTitle] = useState('Projekt');

  useEffect(() => {
    const load = async () => {
      try {
        const res = await applicationsAPI.getById(applicationId);
        const app = res.data;
        if (app && app.job) setTitle(app.job.title);
      } catch (err) {
        console.error('Error loading application', err);
      }
    };
    load();
  }, [applicationId]);

  return (
    <div style={{ padding: '2rem', backgroundColor: '#0f0f0f', minHeight: '80vh' }}>
      <ChatComponent applicationId={applicationId} projectTitle={title} />
    </div>
  );
};

export default MessageThreadPage;
