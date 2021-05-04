import { useContext, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { UserContext } from "./contexts/userContext";

import { QueryClient, QueryClientProvider } from "react-query";
import { API, setAuthToken } from "./config/api";

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/global.css";

import Navbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Raisefund from "./pages/Raisefund";
import FormMakeFund from "./pages/FormMakeFund";
import ViewFund from "./pages/ViewFund";
import Detaildonate from "./pages/Detaildonate";
import NotFound from "./pages/NotFound";

if (localStorage.token) {
  setAuthToken(localStorage.token);
}

function App() {
  const [, dispatch] = useContext(UserContext);

  const checkUser = async () => {
    try {
      const response = await API.get("/check-auth");
      console.log(response);
      if (response.status == 404 || response.status == 500) {
        return dispatch({
          type: "AUTH_ERROR",
        });
      }
      let payload = response.data.data.user;
      payload.token = localStorage.token;
      dispatch({
        type: "USER_SUCCESS",
        payload,
      });
    } catch (error) {
      console.log(error);
      dispatch({
        type: "AUTH_ERROR",
      });
    }
  };

  useEffect(() => {
    checkUser();
  }, []);

  const client = new QueryClient();

  return (
    <QueryClientProvider client={client}>
      <Router>
        <Navbar />
        <Switch>
          <Route exact path='/' component={Home} />
          <PrivateRoute exact path='/raisefund' component={Raisefund} />
          <PrivateRoute exact path='/formmakefund' component={FormMakeFund} />
          <PrivateRoute
            exact
            path='/detaildonate/:id'
            component={Detaildonate}
          />
          <PrivateRoute exact path='/viewfund/:id' component={ViewFund} />
          <PrivateRoute exact path='/profile' component={Profile} />
          <Route exact component={NotFound} />
        </Switch>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
