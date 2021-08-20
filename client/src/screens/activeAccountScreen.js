import axios from "axios"
import { useParams, useHistory } from "react-router"
import { useEffect, useState } from "react";

function ActiveAccountScreen() {
    const history = useHistory();
    const { activeToken } = useParams();
    const [error, setError] = useState();
    useEffect(() => {
        const activeAccountHandler = async () => {
            try {
                const res = await axios({
                    method: "PUT",
                    url: `/api/auth/verifyUser/${activeToken}`,
                })
                setError(res.data.data)
                setTimeout(() => {
                    history.push('/login')
                }, 2000);
            } catch (error) {
                setError(error.response.data.error);
            }
        }
        activeAccountHandler()
    }, [activeToken])
    return (
        <div>
            {error}
        </div>
    )
}

export default ActiveAccountScreen;
