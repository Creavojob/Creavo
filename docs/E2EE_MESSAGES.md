# End-to-End Encrypted Messages (E2EE)

## Übersicht

Creavo implementiert End-to-End Verschlüsselung für alle Nachrichten zwischen Clients und Freelancern. Dies bedeutet, dass nur die beiden Gesprächspartner die Nachrichten lesen können - nicht einmal der Server kann die Inhalte entschlüsseln.

## Technologie

- **Kryptographie-Bibliothek**: TweetNaCl (NaCl = Networking and Cryptography library)
- **Verschlüsselungsalgorithmus**: X25519-XSalsa20-Poly1305 (Box encryption)
- **Key Exchange**: Elliptic Curve Diffie-Hellman (ECDH)

## Ablauf

### 1. Key Setup (Einmalig pro User)

Wenn ein User zum ersten Mal den Chat öffnet:

1. **Keypair Generation**: Ein Public/Private Key-Paar wird generiert
2. **Password Protection**: Der Private Key wird mit dem User-Passwort verschlüsselt
3. **Local Storage**: Verschlüsselter Private Key wird lokal gespeichert
4. **Server Upload**: Public Key wird zum Server hochgeladen
5. **Session Storage**: Entschlüsselter Private Key wird in der Session gespeichert

```javascript
// Beispiel
const { publicKey, secretKey } = generateKeyPair();
const { encryptedSecretKey, nonce, salt } = encryptSecretKeyWithPassword(secretKey, password);
storeKeys(publicKey, encryptedSecretKey, nonce, salt);
await setPublicKey(publicKey, encryptedPrivateKeyForBackup);
```

### 2. Nachricht Senden

1. Sender verschlüsselt die Nachricht mit dem **Public Key des Empfängers**
2. Verschlüsselte Nachricht + Nonce werden zum Server gesendet
3. Server speichert nur die verschlüsselte Version

```javascript
const { encryptedMessage, nonce } = encryptMessage(
  message,
  recipientPublicKey,
  mySecretKey
);

await sendMessage(conversationId, encryptedMessage, null, nonce, myPublicKey);
```

### 3. Nachricht Empfangen

1. Empfänger lädt verschlüsselte Nachrichten vom Server
2. Jede Nachricht wird mit dem **Private Key des Empfängers** entschlüsselt
3. Original-Nachricht wird angezeigt

```javascript
const decryptedContent = decryptMessage(
  encryptedContent,
  nonce,
  senderPublicKey,
  mySecretKey
);
```

## Besondere Features

### Admin-Zugriff bei Streitfällen

Bei Disputes können Admins Nachrichten lesen, ABER nur wenn:

1. **Beide Parteien** (Client UND Freelancer) den Streitfall markiert haben
2. Der Admin hat eigene E2EE Keys eingerichtet
3. Nachrichten werden zusätzlich für den Admin verschlüsselt

```javascript
// Wenn beide Parteien flaggen
if (conversation.disputeStatus === 'both_flagged') {
  // Admin kann Nachrichten lesen (mit eigenem Private Key)
}
```

### Password-Based Unlock

Nach jedem Login oder Page Refresh:

1. User muss Verschlüsselungs-Passwort eingeben
2. Private Key wird aus localStorage entschlüsselt
3. Private Key wird in Session geladen
4. User kann Nachrichten lesen/schreiben

## Sicherheitsmerkmale

### ✅ Was ist sicher?

- **Server kann Nachrichten nicht lesen**: Nur verschlüsselte Daten werden gespeichert
- **Man-in-the-Middle geschützt**: Public Key Authentifizierung
- **Forward Secrecy**: Jede Nachricht hat eine eigene Nonce
- **Password-Protected Keys**: Private Keys sind mit User-Passwort verschlüsselt

### ⚠️ Wichtige Hinweise

- **Passwort vergessen = Datenverlust**: Wenn User ihr Verschlüsselungs-Passwort vergessen, können alte Nachrichten nicht mehr entschlüsselt werden
- **Device-Bound**: Keys sind auf dem Gerät gespeichert. Multi-Device-Support würde Key-Sync erfordern
- **Backup erforderlich**: User sollten ihre verschlüsselten Keys sichern

## Komponenten

### Frontend

#### `/frontend/src/utils/crypto.js`
Kryptographie-Utilities:
- `generateKeyPair()` - Neue Keys generieren
- `encryptMessage()` - Nachricht verschlüsseln
- `decryptMessage()` - Nachricht entschlüsseln
- `encryptSecretKeyWithPassword()` - Private Key mit Passwort schützen
- `decryptSecretKeyWithPassword()` - Private Key entschlüsseln

#### `/frontend/src/pages/ChatPage.js`
Chat-Interface mit E2EE:
- Key Setup Check
- Password Unlock
- Message Encryption/Decryption
- Dispute Flagging

#### `/frontend/src/components/KeySetup.js`
Initiales Setup für User Keys

#### `/frontend/src/pages/AdminEncryptionSetup.js`
Admin-spezifisches Encryption Setup für Dispute-Zugriff

### Backend

#### `/backend/src/models/User.js`
```javascript
publicKey: TEXT              // User's public key (X25519)
encryptedPrivateKey: TEXT    // Backup (password-encrypted private key)
```

#### `/backend/src/models/Message.js`
```javascript
encryptedContent: TEXT       // Encrypted message content
nonce: STRING                // Encryption nonce
senderPublicKey: TEXT        // Sender's public key for verification
encryptedForAdmin: TEXT      // Optional: encrypted copy for admin
```

#### `/backend/src/models/Conversation.js`
```javascript
disputeStatus: ENUM          // none, client_flagged, freelancer_flagged, both_flagged
disputeFlaggedByClient: DATE
disputeFlaggedByFreelancer: DATE
adminAccessEnabled: BOOLEAN
```

#### `/backend/src/routes/chat.js`
API Endpoints:
- `GET /api/chat/conversations` - Liste aller Konversationen
- `POST /api/chat/conversations` - Neue Konversation erstellen
- `GET /api/chat/conversations/:id/messages` - Nachrichten abrufen (verschlüsselt)
- `POST /api/chat/conversations/:id/messages` - Nachricht senden (verschlüsselt)
- `POST /api/chat/conversations/:id/flag-dispute` - Streitfall markieren
- `GET /api/chat/keys/:userId` - Public Key eines Users abrufen
- `POST /api/chat/keys` - Eigenen Public Key setzen/updaten
- `GET /api/chat/admin/disputes` - Admin: Alle Disputes
- `GET /api/chat/admin/conversations/:id/messages` - Admin: Dispute Messages

#### `/backend/src/services/chatService.js`
Business Logic für Chat & E2EE

## Nutzung

### Für normale Users (Client/Freelancer)

1. Beim ersten Besuch von `/chat`:
   - Verschlüsselungs-Passwort festlegen (min. 8 Zeichen)
   - Keys werden automatisch generiert und gespeichert

2. Bei jedem weiteren Besuch:
   - Verschlüsselungs-Passwort eingeben zum Entsperren
   - Nachrichten senden/empfangen (transparent verschlüsselt)

3. Bei Problemen:
   - "🚩 Streitfall" Button klicken
   - Wenn beide Parteien flaggen → Admin kann helfen

### Für Admins

1. Admin Dashboard → Tab "🚩 Streitfälle"
2. Beim ersten Mal: Admin E2EE Setup
   - Starkes Passwort festlegen (min. 12 Zeichen)
3. Streitfälle ansehen
4. Nur Disputes mit Status "both_flagged" können gelesen werden
5. Nachrichten werden automatisch entschlüsselt angezeigt

## Testing

### Test-Szenario 1: Normale Kommunikation

```bash
# Als Client
1. Login als Client
2. /chat öffnen
3. Key Setup durchführen
4. Nachricht an Freelancer senden

# Als Freelancer  
1. Login als Freelancer
2. /chat öffnen
3. Key Setup durchführen
4. Nachricht lesen (sollte entschlüsselt sein)
5. Antworten
```

### Test-Szenario 2: Dispute Handling

```bash
# Als Client
1. In Konversation "🚩 Streitfall" klicken
2. Bestätigen

# Als Freelancer
1. Gleiche Konversation öffnen
2. Ebenfalls "🚩 Streitfall" klicken

# Als Admin
1. Admin Dashboard → Streitfälle Tab
2. Admin Encryption Setup (falls nicht done)
3. Dispute auswählen (sollte "both_flagged" sein)
4. Nachrichten lesen (automatisch entschlüsselt)
```

## Troubleshooting

### "Entschlüsselung fehlgeschlagen"

**Ursachen:**
- Falscher Private Key
- Korrupte Nachricht
- Public Key des Senders nicht verfügbar

**Lösung:**
- Password korrekt eingeben
- Keys neu einrichten (Warnung: alte Nachrichten verloren!)

### "User has not set up encryption yet"

**Ursache:** Empfänger hat noch keinen Public Key

**Lösung:** Empfänger muss einmalig `/chat` besuchen und Setup durchführen

### Admin kann Dispute nicht sehen

**Ursachen:**
- Nicht beide Parteien haben geflaggt
- Admin hat keine E2EE Keys

**Lösung:**
- Warten bis beide Parteien flaggen
- Admin Encryption Setup durchführen

## Zukünftige Verbesserungen

- [ ] **Key Rotation**: Periodischer Wechsel der Keys
- [ ] **Multi-Device Support**: Key-Sync über verschlüsselten Cloud-Backup
- [ ] **Perfect Forward Secrecy**: Ephemeral Keys pro Session
- [ ] **Message Expiration**: Automatisches Löschen nach X Tagen
- [ ] **Read Receipts**: Encrypted read confirmations
- [ ] **File Encryption**: E2EE für angehängte Dateien
- [ ] **Group Chat Support**: Multi-Party Encryption
- [ ] **Key Verification**: QR-Code oder Fingerprint Verification

## Sicherheitsaudit

⚠️ **Wichtig**: Dieses System wurde noch nicht von externen Security-Experten auditiert. Für produktive Nutzung mit sensiblen Daten wird ein professionelles Sicherheitsaudit empfohlen.

## Rechtliches

E2EE bedeutet, dass Creavo den Inhalt der Nachrichten nicht kontrollieren kann. Dies könnte rechtliche Implikationen haben (GDPR, Digital Services Act, etc.). Rechtliche Beratung wird empfohlen.
