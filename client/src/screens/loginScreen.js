import { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import axios from "axios";

function LoginScreen() {
    const history = useHistory()
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        if (localStorage.getItem("X-ACCESS-TOKEN")) {
            history.push('/')
        }
    }, [history])

    const loginHandler = async () => {
        try {
            const res = await axios({
                method: "POST",
                url: "/api/auth/login",
                data: {
                    email,
                    password
                }
            });
            localStorage.setItem("X-ACCESS-TOKEN", res.data.accessToken);
            history.push('/');
        } catch (error) {
            setError(error.response.data.error)
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }
    return (
        <div>
            <ul>
                <li><Link to="/">Main Page(Need Auth)</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/forgotPassword">Forgot Password</Link></li>
            </ul>
            <p>Login</p>
            <input type='text' placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
            <input type='password' placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
            <button onClick={loginHandler}>Login</button>
            <p>{error}</p>
        </div>
    )
}

export default LoginScreen;
