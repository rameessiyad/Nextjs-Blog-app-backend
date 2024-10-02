const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandling');
const apiRoute = require('./routes');

require('dotenv').config();

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true,            //access-control-allow-credentials:true
    optionSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
//route
app.use("/api/v1", apiRoute)

//error handling middleware
app.use(notFound);
app.use(errorHandler);



const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    connectDB();
})