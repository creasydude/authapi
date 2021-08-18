import express from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import connectDB from './config/db.js';
import errorHandler from './middlewares/error.js';

//Routes Import
import authRoute from './routes/auth.js'

//Dependencies
dotenv.config({ path: './config.env' });
const app = express();
const PORT = process.env.PORT || 5000;
connectDB()

//Middlewares
app.use(bodyParser.json());
app.use(cookieParser(process.env.CP_SEC))

//Routes
app.use('/api/auth', authRoute)
//Err Handler
app.use(errorHandler);

//Listen APP
const server = app.listen(PORT, () => console.log(`Server Is Running On Port : ${PORT}`));
process.on("unhandledRejection", (err) => {
    console.log(`An Error Occured : ${err}`);
    server.close(() => process.exit(1));
})