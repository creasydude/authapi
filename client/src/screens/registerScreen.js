import { useState, useEffect } from "react";
import axios from 'axios';
import { Link, useHistory } from "react-router-dom";

function RegisterScreen() {
    const history = useHistory();
    const [username, setUsername] = useState();
    const [password, setPassword] = useState();
    const [email, setEmail] = useState();
    const [registerComplete, setRegisterComplete] = useState(false);
    const [error, setError] = useState();

    useEffect(() => {
        if (localStorage.getItem("X-ACCESS-TOKEN")) {
            history.push('/')
        }
    }, [history])

    const registerHandler = async () => {
        try {
            const res = await axios({
                method: "POST",
                url: "/api/auth/register",
                data: {
                    username,
                    email,
                    password
                }
            })
            console.log(res)
            setRegisterComplete(true);
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
            {registerComplete ? <p>Register Completed, Now Check Your Email And Click The Verify Link</p> : (
                <>
                    <p>Register</p>
                    <input type='text' placeholder="Enter Username" onChange={(e) => setUsername(e.target.value)} />
                    <input type='text' placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
                    <input type='password' placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={registerHandler}>Register</button>
                    <p>{error}</p>
                </>
            )}
        </div>
    )
}

export default RegisterScreen;
