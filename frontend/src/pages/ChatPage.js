import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import chatAPI from '../services/chatAPI';
import {
  encryptMessage,
  decryptMessage,
  getSessionSecretKey,
  getStoredKeys,
  decryptSecretKeyWithPassword,
  setSessionSecretKey,
  downloadKeysBackup,
  hasStoredKeys,
  isSessionUnlocked
} from '../utils/crypto';
import KeySetup from '../components/KeySetup';
import socket from '../services/socket';

const ChatPage = () => {
    // WebSocket Setup
    useEffect(() => {
      if (!user || !isSessionUnlocked() || !selectedConversation) return;
      socket.connect();
      socket.emit('join_conversation', selectedConversation.id);

      // Empfang verschlüsselter Nachrichten
      socket.on('new_encrypted_message', (data) => {
        if (data.conversationId === selectedConversation.id) {
          setMessages((prev) => [...prev, data]);
        }
      });

      return () => {
        socket.off('new_encrypted_message');
        socket.disconnect();
      };
    }, [user, selectedConversation, isSessionUnlocked]);
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsKeySetup, setNeedsKeySetup] = useState(false);
  const [needsPasswordUnlock, setNeedsPasswordUnlock] = useState(false);
  const [unlockPassword, setUnlockPassword] = useState('');
  const [showDisputeConfirm, setShowDisputeConfirm] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    checkEncryptionSetup();
    
    // Online/Offline Detection
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!needsKeySetup && !needsPasswordUnlock) {
      loadConversations();
    }
  }, [needsKeySetup, needsPasswordUnlock, loadConversations]);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation, loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const checkEncryptionSetup = () => {
    if (!hasStoredKeys()) {
      // User hasn't set up encryption yet
      setNeedsKeySetup(true);
      setNeedsPasswordUnlock(false);
      return;
    }

    // Check if secret key is in session
    if (!isSessionUnlocked()) {
      // User needs to unlock with password
      setNeedsPasswordUnlock(true);
      setNeedsKeySetup(false);
      return;
    }

    // All good!
    setNeedsKeySetup(false);
    setNeedsPasswordUnlock(false);
  };

  const handleKeySetupComplete = () => {
    setNeedsKeySetup(false);
    // After setup, still need to unlock
    setNeedsPasswordUnlock(true);
  };

  const handleUnlock = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const storedKeys = getStoredKeys();
      const secretKey = decryptSecretKeyWithPassword(
        storedKeys.encryptedSecretKey,
        storedKeys.keyNonce,
        storedKeys.keySalt,
        unlockPassword
      );
      
      setSessionSecretKey(secretKey);
      setNeedsPasswordUnlock(false);
      setUnlockPassword('');
      setRetryCount(0);
    } catch (err) {
      console.error('Unlock error:', err);
      setRetryCount(prev => prev + 1);
      
      if (err.name === 'DecryptionError' && err.message.includes('Wrong password')) {
        setError(`Falsches Passwort (Versuch ${retryCount + 1}/5)`);
      } else {
        setError('Fehler beim Entsperren: ' + err.message);
      }
      
      // After 5 failed attempts, offer key recovery
      if (retryCount >= 4) {
        setError('Zu viele Fehlversuche. Bitte Keys aus Backup wiederherstellen oder neu einrichten.');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadConversations = async () => {
    if (!isOnline) {
      setError('Keine Internetverbindung');
      return;
    }
    
    try {
      const response = await chatAPI.getConversations();
      setConversations(response.data);
      setError('');
    } catch (err) {
      console.error('Load conversations error:', err);
      setError('Fehler beim Laden der Konversationen');
      
      // Retry logic
      if (err.response?.status >= 500) {
        setTimeout(() => loadConversations(), 3000);
      }
    }
  };

  const loadMessages = async (conversationId) => {
    setLoading(true);
    setError('');
    
    try {
      const response = await chatAPI.getMessages(conversationId);
      const conversation = conversations.find(c => c.id === conversationId) || selectedConversation;
      
      if (!conversation) {
        throw new Error('Conversation not found');
      }

      const mySecretKey = getSessionSecretKey();
      const storedKeys = getStoredKeys();

      if (!mySecretKey) {
        setError('Bitte entsperren Sie Ihre Nachrichten zuerst');
        setNeedsPasswordUnlock(true);
        return;
      }

      const decryptedMessages = await Promise.all(
        response.data.map(async (msg) => {
          try {
            // Skip system messages
            if (msg.messageType === 'dispute_flag' || msg.nonce === 'SYSTEM') {
              return {
                ...msg,
                content: '🚩 Dispute markiert',
                decrypted: true,
                isSystem: true
              };
            }

            // Determine sender's public key
            const senderPublicKey = msg.sender.id === user.id 
              ? storedKeys.publicKey 
              : msg.senderPublicKey;

            if (!senderPublicKey) {
              return {
                ...msg,
                content: '[Sender hat keine Verschlüsselung eingerichtet]',
                decrypted: false,
                error: 'NO_SENDER_KEY'
              };
            }

            // Decrypt message
            const decryptedContent = decryptMessage(
              msg.encryptedContent,
              msg.nonce,
              senderPublicKey,
              mySecretKey
            );

            return {
              ...msg,
              content: decryptedContent,
              decrypted: true
            };
          } catch (err) {
            console.error('Decryption error for message:', msg.id, err);
            
            let errorMessage = '[❌ Entschlüsselung fehlgeschlagen]';
            if (err.name === 'DecryptionError') {
              if (err.message.includes('wrong keys')) {
                errorMessage = '[❌ Falsche Schlüssel]';
              } else if (err.message.includes('corrupted')) {
                errorMessage = '[❌ Beschädigte Nachricht]';
              }
            }
            
            return {
              ...msg,
              content: errorMessage,
              decrypted: false,
              error: err.message
            };
          }
        })
      );
      
      setMessages(decryptedMessages);
    } catch (err) {
      console.error('Load messages error:', err);
      
      if (!isOnline) {
        setError('Keine Internetverbindung');
      } else if (err.response?.status === 401) {
        setError('Sitzung abgelaufen - bitte neu anmelden');
      } else if (err.response?.status === 403) {
        setError('Kein Zugriff auf diese Konversation');
      } else {
        setError('Fehler beim Laden der Nachrichten');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    if (!isOnline) {
      setError('Keine Internetverbindung - Nachricht kann nicht gesendet werden');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const conversation = selectedConversation;
      const recipientUser = conversation.client.id === user.id ? conversation.freelancer : conversation.client;
      const mySecretKey = getSessionSecretKey();
      const storedKeys = getStoredKeys();

      if (!mySecretKey) {
        setError('Session abgelaufen - bitte entsperren');
        setNeedsPasswordUnlock(true);
        return;
      }

      const { encryptedContent, nonce } = encryptMessage(newMessage, mySecretKey);
      const payload = {
        conversationId: selectedConversation.id,
        encryptedContent,
        nonce,
        senderPublicKey: storedKeys.publicKey
      };

      socket.emit('encrypted_message', payload);
      setNewMessage('');
    } catch (err) {
      console.error('Send message error:', err);
      setError('Fehler beim Verschlüsseln oder Senden: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadBackup = () => {
    try {
      downloadKeysBackup();
      alert('Backup erfolgreich heruntergeladen! Bitte sicher aufbewahren.');
    } catch (err) {
      console.error('Backup download error:', err);
      setError('Fehler beim Erstellen des Backups: ' + err.message);
    }
  };

  const handleFlagDispute = async () => {
    // Minimal stub to satisfy linter and provide basic UX.
    try {
      // TODO: call API to flag dispute for selectedConversation
      setShowDisputeConfirm(false);
      setError('');
      alert('Streitfall gemeldet (Platzhalter)');
    } catch (err) {
      console.error('Flag dispute error:', err);
      setError('Fehler beim Melden des Streitfalls');
    }
  };

  if (needsKeySetup) {
    return <KeySetup onComplete={handleKeySetupComplete} />;
  }

  if (needsPasswordUnlock) {
    return (
      <div style={styles.unlockOverlay}>
        <div style={styles.unlockModal}>
          <h2>🔒 Nachrichten entsperren</h2>
          <p>Geben Sie Ihr Verschlüsselungs-Passwort ein, um Ihre Nachrichten zu lesen.</p>
          {error && <div style={styles.error}>{error}</div>}
          <form onSubmit={handleUnlock}>
            <input
              type="password"
              value={unlockPassword}
              onChange={(e) => setUnlockPassword(e.target.value)}
              placeholder="Verschlüsselungs-Passwort"
              style={styles.input}
              required
              disabled={loading}
            />
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? '⏳ Entsperre...' : '🔓 Entsperren'}
            </button>
          </form>
          {retryCount >= 5 && (
            <div style={{marginTop: '20px', textAlign: 'center'}}>
              <p style={{color: '#ff9800'}}>Passwort vergessen?</p>
              <button 
                onClick={() => {/* TODO: Recovery flow */}} 
                style={{...styles.button, backgroundColor: '#666', marginTop: '10px'}}
              >
                Keys aus Backup wiederherstellen
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>💬 Verschlüsselte Nachrichten</h1>
        {!isOnline && (
          <div style={styles.offlineBanner}>
            ⚠️ Offline - Keine Internetverbindung
          </div>
        )}
        <button onClick={handleDownloadBackup} style={styles.backupButton} title="Keys sichern">
          💾 Backup erstellen
        </button>
      </div>

      {error && <div style={styles.error}>{error}</div>}

      <div style={styles.chatContainer}>
        {/* Conversations List */}
        <div style={styles.conversationsList}>
          <h3>Konversationen</h3>
          {conversations.length === 0 ? (
            <p style={styles.emptyState}>Keine Konversationen</p>
          ) : (
            conversations.map(conv => {
              const otherUser = conv.client.id === user.id ? conv.freelancer : conv.client;
              return (
                <div
                  key={conv.id}
                  style={{
                    ...styles.conversationItem,
                    ...(selectedConversation?.id === conv.id ? styles.conversationItemActive : {})
                  }}
                  onClick={() => setSelectedConversation(conv)}
                >
                  <div style={styles.conversationInfo}>
                    <strong>{otherUser.firstName} {otherUser.lastName}</strong>
                    <div style={styles.jobTitle}>{conv.job.title}</div>
                  </div>
                  {conv.unreadCountClient > 0 && conv.client.id === user.id && (
                    <span style={styles.unreadBadge}>{conv.unreadCountClient}</span>
                  )}
                  {conv.unreadCountFreelancer > 0 && conv.freelancer.id === user.id && (
                    <span style={styles.unreadBadge}>{conv.unreadCountFreelancer}</span>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Messages Area */}
        <div style={styles.messagesArea}>
          {!selectedConversation ? (
            <div style={styles.emptyState}>
              <p>Wählen Sie eine Konversation aus</p>
            </div>
          ) : (
            <>
              <div style={styles.messagesHeader}>
                <div style={styles.headerContent}>
                  <div>
                    <h3>
                      {selectedConversation.client.id === user.id
                        ? `${selectedConversation.freelancer.firstName} ${selectedConversation.freelancer.lastName}`
                        : `${selectedConversation.client.firstName} ${selectedConversation.client.lastName}`}
                    </h3>
                    <div style={styles.jobTitle}>{selectedConversation.job.title}</div>
                  </div>
                  <button 
                    onClick={() => setShowDisputeConfirm(true)}
                    style={styles.disputeButton}
                    title="Streitfall melden"
                  >
                    🚩 Streitfall
                  </button>
                </div>
                {selectedConversation.adminAccessEnabled && (
                  <div style={styles.adminBadge}>🔓 Admin-Zugriff aktiviert</div>
                )}
                {selectedConversation.disputeStatus && selectedConversation.disputeStatus !== 'none' && (
                  <div style={styles.disputeStatusBadge}>
                    {selectedConversation.disputeStatus === 'both_flagged' && '⚠️ Beide Parteien haben Streitfall gemeldet'}
                    {selectedConversation.disputeStatus === 'client_flagged' && '🚩 Client hat Streitfall gemeldet'}
                    {selectedConversation.disputeStatus === 'freelancer_flagged' && '🚩 Freelancer hat Streitfall gemeldet'}
                  </div>
                )}
              </div>

              <div style={styles.messagesList}>
                {loading && messages.length === 0 ? (
                  <p style={styles.loadingText}>Lade Nachrichten...</p>
                ) : messages.length === 0 ? (
                  <p style={styles.emptyState}>Keine Nachrichten. Senden Sie die erste!</p>
                ) : (
                  messages.map(msg => (
                    <div
                      key={msg.id}
                      style={{
                        ...styles.message,
                        ...(msg.sender.id === user.id ? styles.messageOwn : styles.messageOther)
                      }}
                    >
                      <div style={styles.messageContent}>{msg.content}</div>
                      <div style={styles.messageTime}>
                        {new Date(msg.createdAt).toLocaleString('de-DE', {
                          day: '2-digit',
                          month: '2-digit',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <form onSubmit={handleSendMessage} style={styles.messageForm}>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nachricht schreiben... (verschlüsselt)"
                  style={styles.messageInput}
                  disabled={loading}
                />
                <button
                  type="submit"
                  style={styles.sendButton}
                  disabled={loading || !newMessage.trim()}
                >
                  {loading ? '...' : '📨'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>

      {/* Dispute Confirmation Modal */}
      {showDisputeConfirm && (
        <div style={styles.modalOverlay} onClick={() => setShowDisputeConfirm(false)}>
          <div style={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <h3>🚩 Streitfall melden</h3>
            <p>
              Möchten Sie diese Konversation als Streitfall markieren? 
              Dies ermöglicht dem Admin den Zugriff auf die Nachrichten, wenn beide Parteien
              den Streitfall markiert haben.
            </p>
            <div style={styles.modalButtons}>
              <button onClick={() => setShowDisputeConfirm(false)} style={styles.cancelButton}>
                Abbrechen
              </button>
              <button onClick={handleFlagDispute} style={styles.confirmButton}>
                Bestätigen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '10px'
  },
  offlineBanner: {
    flex: '1 1 100%',
    backgroundColor: '#ff9800',
    color: '#000',
    padding: '10px',
    borderRadius: '8px',
    textAlign: 'center',
    fontWeight: 'bold'
  },
  backupButton: {
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  chatContainer: {
    display: 'flex',
    gap: '20px',
    height: '70vh',
    marginTop: '20px'
  },
  conversationsList: {
    flex: '0 0 300px',
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '15px',
    overflowY: 'auto'
  },
  conversationItem: {
    padding: '12px',
    backgroundColor: '#2a2a2a',
    borderRadius: '8px',
    marginBottom: '10px',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  conversationItemActive: {
    backgroundColor: '#00d4ff',
    color: '#000'
  },
  conversationInfo: {
    flex: 1
  },
  jobTitle: {
    fontSize: '12px',
    color: '#999',
    marginTop: '4px'
  },
  unreadBadge: {
    backgroundColor: '#f44336',
    color: '#fff',
    borderRadius: '50%',
    width: '24px',
    height: '24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: 'bold'
  },
  messagesArea: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: '12px',
    padding: '15px',
    display: 'flex',
    flexDirection: 'column'
  },
  messagesHeader: {
    borderBottom: '2px solid #333',
    paddingBottom: '10px',
    marginBottom: '15px'
  },
  headerContent: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '8px'
  },
  disputeButton: {
    padding: '8px 12px',
    backgroundColor: '#ff9800',
    border: 'none',
    borderRadius: '6px',
    color: '#000',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  },
  adminBadge: {
    display: 'inline-block',
    backgroundColor: '#ff9800',
    color: '#000',
    padding: '4px 8px',
    borderRadius: '4px',
    fontSize: '12px',
    marginTop: '8px'
  },
  disputeStatusBadge: {
    display: 'inline-block',
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '6px 12px',
    borderRadius: '4px',
    fontSize: '13px',
    marginTop: '8px'
  },
  messagesList: {
    flex: 1,
    overflowY: 'auto',
    marginBottom: '15px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },
  message: {
    padding: '10px 15px',
    borderRadius: '12px',
    maxWidth: '70%',
    wordWrap: 'break-word'
  },
  messageOwn: {
    alignSelf: 'flex-end',
    backgroundColor: '#00d4ff',
    color: '#000'
  },
  messageOther: {
    alignSelf: 'flex-start',
    backgroundColor: '#2a2a2a',
    color: '#fff'
  },
  messageContent: {
    marginBottom: '4px'
  },
  messageTime: {
    fontSize: '11px',
    opacity: 0.7
  },
  messageForm: {
    display: 'flex',
    gap: '10px'
  },
  messageInput: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '2px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '14px'
  },
  sendButton: {
    padding: '12px 20px',
    backgroundColor: '#00d4ff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '20px'
  },
  emptyState: {
    textAlign: 'center',
    color: '#999',
    padding: '40px 20px'
  },
  loadingText: {
    textAlign: 'center',
    color: '#00d4ff'
  },
  error: {
    backgroundColor: '#f44336',
    color: '#fff',
    padding: '10px',
    borderRadius: '8px',
    marginBottom: '15px'
  },
  unlockOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000
  },
  unlockModal: {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '400px',
    width: '100%',
    color: '#fff'
  },
  input: {
    width: '100%',
    padding: '12px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '2px solid #333',
    backgroundColor: '#2a2a2a',
    color: '#fff',
    fontSize: '16px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '12px',
    backgroundColor: '#00d4ff',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  modalOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.8)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1001
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    padding: '30px',
    borderRadius: '12px',
    maxWidth: '500px',
    width: '100%',
    color: '#fff',
    border: '2px solid #333'
  },
  modalButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  cancelButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#666',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  },
  confirmButton: {
    flex: 1,
    padding: '12px',
    backgroundColor: '#f44336',
    border: 'none',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer'
  }
};

export default ChatPage;
