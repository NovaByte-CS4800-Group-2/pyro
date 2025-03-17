import express from 'express';
import firebaseAdmin from 'firebase-admin';
import mysql from 'mysql2';

// Initialize Firebase Admin SDK
firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.applicationDefault(),
});

// Set up SQL Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Server123', // Your database password
  database: 'notes_app',
});

const app = express();
app.use(express.json());

// Function to verify Firebase ID token
const verifyIdToken = async (idToken) => {
  try {
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error('Unauthorized');
  }
};

// Endpoint to create or update user in SQL database
app.post('/add-user', async (req, res) => {
  const { idToken, userData } = req.body;

  try {
    // Verify the Firebase ID token
    const decodedToken = await verifyIdToken(idToken);
    const userId = decodedToken.uid;

    // Check if the user already exists in the database
    db.query('SELECT * FROM users WHERE user_id = ?', [userId], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.length > 0) {
        // User already exists, update the user data
        db.query(
          'UPDATE users SET username = ?, email = ? WHERE user_id = ?',
          [userData.username, userData.email, userId],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).json({ message: 'User updated successfully' });
          }
        );
      } else {
        // Create a new user in the database
        db.query(
          'INSERT INTO users (user_id, username, email) VALUES (?, ?, ?)',
          [userId, userData.username, userData.email],
          (err, result) => {
            if (err) return res.status(500).json({ error: err.message });
            return res.status(200).json({ message: 'User created successfully' });
          }
        );
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized' });
  }
});

// Start the server
app.listen(8080, () => {
  console.log('Server running on http://localhost:8080');
});
