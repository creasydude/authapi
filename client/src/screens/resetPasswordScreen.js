import { useParams, useHistory } from "react-router"
import { useEffect, useState } from "react";
import axios from "axios";
function ResetPasswordScreen() {
    const history = useHistory();
    const { resetToken } = useParams();
    const [showPw, setShowPw] = useState();
    const [password, setPassword] = useState();
    const [error, setError] = useState();

    useEffect(() => {
        const checkResetToken = async () => {
            try {
                const res = await axios({
                    method: "PUT",
                    url: `/api/auth/resetPassword/${resetToken}`,
                })
                setShowPw(res.data.success);
            } catch (error) {
                setError(error.response.data.error)
                setShowPw(false);
                setTimeout(() => {
                    setError('');
                }, 3000);
            }
        };
        checkResetToken()
    }, [resetToken])

    const resetPasswordHandler = async () => {
        try {
            const res = await axios({
                method: "PUT",
                url: `/api/auth/resetPassword/${resetToken}`,
                data: {
                    password
                }
            })
            setError(res.data.data);
            setTimeout(() => {
                history.push('/login');
            }, 3000);
        } catch (error) {
            setError(error.response.data.error)
            setTimeout(() => {
                setError('');
            }, 3000);
        }
    }

    return (
        <div>
            {showPw ? (
                <>
                    <p>Reset Password</p>
                    <input type='password' placeholder="Enter Password" onChange={(e) => setPassword(e.target.value)} />
                    <button onClick={resetPasswordHandler}>Change Password</button>
                    <p>{error}</p>
                </>
            ) : (
                <>
                    <p>Link is invalid or expired</p>
                </>
            )}
        </div>
    )
}

export default ResetPasswordScreen;
