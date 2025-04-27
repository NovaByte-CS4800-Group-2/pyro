import express from 'express'
import cors from "cors"  // a way for browsers and servers to interact

import registerRouter from "./routes/register.js";
import postRouter from "./routes/posts.js";
import subforumRouter from './routes/subforum.js';
import profileRouter from './routes/profile.js';
import commentRouter from './routes/comments.js';
import voteRouter from './routes/votes.js';
import matchingRouter from './routes/matching.js';
import chatbotRouter from './routes/chatbot.js';
import NotificationRouter from './routes/notifications.js';

const app = express()

app.use(express.json()); // any json.body will be accepted and passed through req.body

const allowedOrigins = ['https://pyro-d9fcd.web.app', 'http://localhost:3000', 'https://pyro-6fwb.onrender.com', 'https://pyro-frontend-3yk6e8k22-turtlelover56s-projects.vercel.app'] 

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS: ' + origin));
    }
  },
  credentials: true
}));

// Route handlers
app.use(registerRouter);
app.use(postRouter);
app.use(subforumRouter);
app.use(profileRouter);
app.use(commentRouter);
app.use(voteRouter);
app.use(matchingRouter);
app.use(chatbotRouter);
app.use(NotificationRouter);

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log('Server is running on port ' + port)
})

/**
 * Status Code Reference:
 * 200 --> OK
 * 201 --> Created
 * 400 --> Bad Request
 * 401 --> Unauthorized
 * 404 --> Not Found
 * 406 --> Not Acceptable
 * 500 --> Internal Server Error
 */