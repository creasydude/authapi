import { Link, useHistory } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

function ForgotPasswordScreen() {
    const history = useHistory()
    const [email, setEmail] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        if (localStorage.getItem("X-ACCESS-TOKEN")) {
            history.push('/')
        }
    }, [history])

    const fpHandler = async () => {
        try {
            const res = await axios({
                method: "POST",
                url: "/api/auth/forgetPassword",
                data: {
                    email
                }
            })
            setError(res.data.data)
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
            <p>Forgot Password</p>
            <input type='text' placeholder="Enter Email" onChange={(e) => setEmail(e.target.value)} />
            <button onClick={fpHandler}>Send Reset Pw Link</button>
            <p>{error}</p>
        </div>
    )
}

export default ForgotPasswordScreen;
