import express from 'express'; 
import cors from 'cors';
import loginRoutes from './routes/login.js';
import registerRoutes from './routes/register.js'; 
import logoutRoutes from './routes/logout.js';
import postRoutes from './routes/posts.js';
import profileRoutes from './routes/profile.js';
import subforumRoutes from './routes/subforum.js';

// entry point where express app is configured 
// cors middleware is applied globally and uses route files 

const app = express(); 
const port = 8080; 

// apply CORS globally to all routes 
const allowedOrigins = ['https://pyro-d9fcd.web.app'] //frontend URL

app.use(cors({
    origin: allowedOrigins, //allow only speicifc origins 
    methods: 'GET, POST, PUT, DELETE', // allow specific HTTP methods 
    credentials: true, //allow cookies if necessary (optional)
}));

// middleware to parse incoming JSON bodies 

//use routes 
app.use("/login", loginRoutes) // use authentication routes under the /login prefix 
app.use("/register", registerRoutes) // use authentication routes under the /register prefix 

// start the server 
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});