import express from "express"
import jwt from "jsonwebtoken"
import prisma from "../configs/prisma.js"
import { OAuth2Client } from "google-auth-library"
import { v4 as uuidv4 } from "uuid"

const router = express.Router()

// 檢查環境變數
if (!process.env.SECRET_KEY) {
	console.error("Missing SECRET_KEY environment variable")
	process.exit(1)
}

const CLIENT_ID =
	"201131820318-om98jaudikrjuraavdmt8o0jlitaf7b1.apps.googleusercontent.com"
const client = new OAuth2Client(CLIENT_ID)

function createJWT(user) {
	// 產生 JWT
	const token = jwt.sign(
		{ userId: user.userId, email: user.email },
		process.env.SECRET_KEY,
		{ expiresIn: "24h" }
	)
	return token
}

router.post("/verify-token", async (req, res) => {
	try {
		const { credential } = req.body
		const ticket = await client.verifyIdToken({
			idToken: credential,
			audience: CLIENT_ID,
		})

		const payload = ticket.getPayload()
		const userEmail = payload.email
		const googleId = payload.sub

		// 檢查 Email 是否已存在
		let existingUser = await prisma.users.findUnique({
			where: {
				email: userEmail,
			},
		})

		// 如果 Email 存在，檢查是否有 google_id。如果有的話在該筆資料加上 google_id，這樣使用者可以一般登入也可以 google 登入
		if (existingUser) {
			if (!existingUser.google_id) {
				existingUser = await prisma.users.update({
					where: {
						email: userEmail,
					},
					data: {
						google_id: googleId,
					},
				})
			}
			const token = createJWT(existingUser)

			res.json({
				exists: true,
				user: existingUser,
				token: token,
			})
		} else {
			// 使用者不存在，詢問是否建立
			res.json({
				exists: false,
				googleData: {
					email: userEmail,
					name: payload.name,
					google_id: googleId,
				},
			})
		}
	} catch (error) {
		res.status(401).json({ error: "Invalid token" })
	}
})

router.post("/register", async (req, res) => {
	try {
		const { email, name, google_id } = req.body

		// 用 uuidv4
		const newUserId = uuidv4()

		const newUser = await prisma.users.create({
			data: {
				userId: newUserId,
				email,
				username: name,
				google_id,
				gender: "o", // Other，因為 google 不能輕易取到 gender
			},
		})

		const token = createJWT(newUser)

		res.json({
			exists: true,
			user: newUser,
			token: token,
		})
	} catch (error) {
		res.status(500).json({ error: "Failed to register user" })
	}
})

export default router
