const express= require("express");
const cors=require('cors');
const cookieParser=require('cookie-parser');
const connectToDb = require('./config/database.js');
const user=require('./routes/user.js');
const problem=require('./routes/problem.js');
require("dotenv").config();

const app =express();
// include middlewares. 

app.use(express.json());
app.use(cors({
    origin: 'http://localhost:3000', // Allow requests from this origin
    credentials: true,              // Allow credentials (cookies, headers)
}));
app.use(cookieParser());

const PORT = process.env.PORT || 3000;
// connect to db 
connectToDb();

// declare the routes
app.use("/api/v1",user);
app.use("/api/v2",problem);

app.listen(PORT, ()=>{
    console.log(`Server is running on ${PORT}`);
});

