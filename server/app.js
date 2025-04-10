import express from 'express'
import cors from "cors"  // a way for browsers and servers to interact

import loginRouter from "./routes/login.js";
import registerRouter from "./routes/register.js";
import postRouter from "./routes/posts.js";
import subforumRouter from './routes/subforum.js';
import profileRouter from './routes/profile.js';
import commentRouter from './routes/comments.js';
import voteRouter from './routes/votes.js';
import matchingRouter from './routes/matching.js';
import chatbotRouter from './routes/chatbot.js';

const app = express()

app.use(express.json()); // any json.body will be accepted and passed through req.body

const allowedOrigins = ['https://pyro-d9fcd.web.app', 'http://localhost:3000', 'https://pyro-6fwb.onrender.com/', 'localhost:3000'] 

app.use(cors({
  origin: allowedOrigins,  // Adjust this to your frontend URL,
  credentials: true  // Allow sending cookies across origins
}))

app.use(loginRouter);
app.use(registerRouter);
app.use(postRouter);
app.use(subforumRouter);
app.use(profileRouter);
app.use(commentRouter);
app.use(voteRouter);
app.use(matchingRouter);
app.use(chatbotRouter);



app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

const port = 8080;
app.listen(port, () => {
  console.log('Server is running on port ' + port)
})

/*
different status code meanings!

200 --> OK
201 --> Created
400 --> Bad request
401 --> Unauthorized
404 --> Not found
406 --> Not acceptable
500 --> Internal server error
*/