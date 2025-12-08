import React, { useState, useEffect, useRef } from 'react';
import { messagesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ChatComponent = ({ applicationId, projectTitle }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    fetchMessages();
    // Poll for new messages every 2 seconds
    const interval = setInterval(fetchMessages, 2000);
    return () => clearInterval(interval);
  }, [applicationId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const response = await messagesAPI.getMessages(applicationId);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      await messagesAPI.sendMessage(applicationId, newMessage, 'text');
      setNewMessage('');
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>💬 {projectTitle}</h3>
      
      <div style={styles.messagesContainer}>
        {messages.length === 0 ? (
          <div style={styles.noMessages}>Keine Nachrichten noch. Starten Sie eine Konversation!</div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              style={{
                ...styles.message,
                ...( msg.sender?.id === user?.id ? styles.messageOwn : styles.messageOther),
                backgroundColor: msg.messageType === 'system' ? '#2a2a2a' : 
                                msg.messageType === 'feedback' ? '#3a2a0a' :
                                msg.sender?.id === user?.id ? '#003a00' : '#1a2a3a'
              }}
            >
              <div style={styles.messageSender}>
                {msg.sender?.firstName || 'Unknown'}
              </div>
              <div style={styles.messageContent}>{msg.content}</div>
              <div style={styles.messageTime}>
                {new Date(msg.createdAt).toLocaleTimeString()}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSendMessage} style={styles.form}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nachricht eingeben..."
          style={styles.input}
          disabled={loading}
        />
        <button type="submit" style={styles.sendBtn} disabled={loading}>
          {loading ? '⏳' : '📤'}
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
    backgroundColor: '#1a1a1a',
    borderRadius: '8px',
    border: '1px solid #333',
    overflow: 'hidden'
  },
  title: {
    margin: '0',
    padding: '1rem',
    borderBottom: '1px solid #333',
    color: '#00ff00',
    fontSize: '1rem'
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '1rem',
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  noMessages: {
    textAlign: 'center',
    color: '#666',
    margin: 'auto'
  },
  message: {
    padding: '0.75rem',
    borderRadius: '4px',
    maxWidth: '80%',
    wordWrap: 'break-word'
  },
  messageOwn: {
    alignSelf: 'flex-end',
    color: '#00ff00'
  },
  messageOther: {
    alignSelf: 'flex-start',
    color: '#88ccff'
  },
  messageSender: {
    fontSize: '0.8rem',
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    opacity: 0.7
  },
  messageContent: {
    fontSize: '0.95rem',
    marginBottom: '0.25rem'
  },
  messageTime: {
    fontSize: '0.75rem',
    opacity: 0.5
  },
  form: {
    display: 'flex',
    gap: '0.5rem',
    padding: '1rem',
    borderTop: '1px solid #333',
    backgroundColor: '#0f0f0f'
  },
  input: {
    flex: 1,
    padding: '0.5rem',
    backgroundColor: '#2a2a2a',
    color: '#e0e0e0',
    border: '1px solid #333',
    borderRadius: '4px',
    fontSize: '0.9rem'
  },
  sendBtn: {
    padding: '0.5rem 1rem',
    backgroundColor: '#00ff00',
    color: '#0f0f0f',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default ChatComponent;
