const express = require('express');
const router = express.Router();
const { OAuth2Client } = require('google-auth-library');
const prisma = require('../configs/db');
const { v4: uuidv4 } = require('uuid')

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
    const userEmail = payload.email;
    const googleId = payload.sub;

    // 檢查 Email 是否已存在
    let existingUser = await prisma.profile.findUnique({  
      where: {
        email: userEmail,
      }
    });

    // 如果 Email 存在，檢查是否有 google_id。如果有的話在該筆資料加上 google_id，這樣使用者可以一般登入也可以 google 登入
    if (existingUser) {
      if (!existingUser.google_id) {
        existingUser = await prisma.profile.update({  
          where: {
            email: userEmail
          },
          data: {
            google_id: googleId
          }
        });
        console.log('Updated user with Google ID');
      }
      res.json({
        exists: true, 
        user: existingUser
      });
    } else {
      // 使用者不存在，詢問是否建立
      res.json({
        exists: false,  
        googleData: {
          email: userEmail,
          name: payload.name,
          google_id: googleId
        }
      });
    }
  } catch (error) {
    console.error('Error verifying token:', error);
    res.status(401).json({ error: 'Invalid token' });
  }
});

router.post('/register', async (req, res) => {
  try {
    const { email, name, google_id } = req.body;

      // 用 uuidv4
      const newUserId = uuidv4()

      const newUser = await prisma.profile.create({
        data: {
          userId: newUserId,
          email,
          username: name,
          google_id,
          gender: "O" // Other，因為 google 不能輕易取到 gender
        }
      });

    res.json({
      exists: true,
      user: newUser
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

module.exports = router;