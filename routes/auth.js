import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { register, login, forgetPassword, resetPassword, refreshToken, logout } from '../controllers/auth.js';
const Router = express.Router();

Router.post('/register', register);
Router.post('/login', login);
Router.post('/refreshToken', refreshToken);
Router.delete('/logout', logout)
Router.post('/forgetPassword', forgetPassword);
Router.put('/resetPassword/:resetToken', resetPassword);

Router.get('/test', userAuth, (req,res,next) => {
    res.send('hello')
} )

export default Router;