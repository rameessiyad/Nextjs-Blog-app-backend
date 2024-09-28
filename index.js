const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandling');
const apiRoute = require('./routes');

require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//error handling middleware
app.use(notFound);
app.use(errorHandler);

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

//route
app.use('/api/v1', apiRoute);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})