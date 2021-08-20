import { Route, Redirect } from 'react-router-dom';

function PrivateRoute({ children, ...rest }) {
    const isAuthHandler = () => {
        return localStorage.getItem("X-ACCESS-TOKEN") ? true : false;
    }
    return (
        <Route
            {...rest}
            render={({ location }) =>
                isAuthHandler() ? (
                    children
                ) :
                    (
                        <Redirect to={{ pathname: "/login", state: { from: location } }} />
                    )
            }
        />
    );
}

export default PrivateRoute;
