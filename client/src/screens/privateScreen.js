import { Link } from "react-router-dom";
function PrivateScreen() {
    return (
        <div>
            <ul>
                <li><Link to="/">Main Page(Need Auth)</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/forgotPassword">Forgot Password</Link></li>
            </ul>
            this is private route
        </div>
    )
}

export default PrivateScreen;
