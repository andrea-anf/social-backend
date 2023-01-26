const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const helmet = require("helmet");
const morgan = require("morgan");
const cors = require("cors")
const cookieParser = require("cookie-parser");
const sessions = require('express-session');

const userRoute = require("./routes/users")
const authRoute = require("./routes/auth")
const postRoute = require("./routes/posts")

dotenv.config();
mongoose.set('strictQuery', false);
mongoose.connect(
    process.env.MONGO_URL, 
    {useNewUrlParser: true, useUnifiedTopology: true},
    () => {
    console.log("connected to MongoDB");
});

//to accept calls
app.use(cors())

const oneDay = 1000 * 60 * 60 * 24;
app.use(sessions({
    secret: "thisismysecrctekey",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false
}));
app.use(cookieParser());

//middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);
app.use("/api/posts", postRoute);

app.listen(8800, () => {
    console.log("backend is working")
})

