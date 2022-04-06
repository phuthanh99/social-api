const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

const userRouter = require('./routes/users')
const authRouter = require('./routes/auth')
const postRouter = require('./routes/post')



dotenv.config();
const port = 8000;

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err) => {
    if (!err) {
        console.log('MongoDB Connection Succeeded.');
    } else {
        console.log('Error in DB connection');
    }
});

// middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"))

app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/posts", postRouter);


app.listen(port, () => {
    console.log(`Backend sever is running, listening on port http://localhost:${port}`);
});