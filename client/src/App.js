import { Switch, Route } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import PrivateRoute from './routes/privateRoute';
import jwtDecode from 'jwt-decode';

import PrivateScreen from './screens/privateScreen';
import LoginScreen from './screens/loginScreen';
import RegisterScreen from './screens/registerScreen';
import ActiveAccountScreen from './screens/activeAccountScreen';
import ForgotPasswordScreen from './screens/forgotPasswordScreen';
import ResetPasswordScreen from './screens/resetPasswordScreen';

function App() {
  useEffect(() => {
    const accessToken = localStorage.getItem("X-ACCESS-TOKEN");
    const refreshToken = async () => {
      try {
        const res = await axios({
          method: "POST",
          url: "/api/auth/refreshToken",
          withCredentials: true,
        })
        localStorage.setItem("X-ACCESS-TOKEN", res.data.accessToken);
      } catch (error) {
        localStorage.removeItem("X-ACCESS-TOKEN");
      }
    }
    if (accessToken) {
      const { exp } = jwtDecode(accessToken)
      if (exp < Date.now() / 1000) {
        refreshToken()
      }
    }
  })
  return (
    <div>
      <Switch>
        <PrivateRoute exact path="/">
          <PrivateScreen />
        </PrivateRoute>
        <Route exact path="/login">
          <LoginScreen />
        </Route>
        <Route exact path="/register">
          <RegisterScreen />
        </Route>
        <Route exact path="/active/:activeToken">
          <ActiveAccountScreen />
        </Route>
        <Route exact path="/forgotPassword">
          <ForgotPasswordScreen />
        </Route>
        <Route exact path="/resetPassword/:resetToken">
          <ResetPasswordScreen />
        </Route>
      </Switch>
    </div>
  );
}

export default App;
