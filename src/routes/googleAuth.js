const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = "201131820318-om98jaudikrjuraavdmt8o0jlitaf7b1.apps.googleusercontent.com"

const client = new OAuth2Client(CLIENT_ID);

router.post('/verify-token', async (req, res) => {
  try {
    const { credential } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    
    res.json({
      email: payload.email,
      name: payload.name,
      picture: payload.picture
    });
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;