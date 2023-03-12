import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./components/scenes/LoginPage";
import AuthUserGuard from "./controls/AuthUserGuard";
import axios from "axios";
import MainLayout from "./components/scenes/MainLayout";
import MainProtal from "./components/scenes/MainPortal";

const App = () => {
  // axios.get("https://app-benasstr.cloud.okteto.net/api/health");
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <AuthUserGuard path="/sports">
          <MainProtal portalType="SPORTS" />
        </AuthUserGuard>
        <AuthUserGuard path="/categories">
          <MainProtal portalType="CATEGORIES" />
        </AuthUserGuard>
        <AuthUserGuard path="/sample">
          <MainProtal portalType="SAMPLE" />
        </AuthUserGuard>
        <AuthUserGuard path="/">
          <MainProtal portalType="?" />
        </AuthUserGuard>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
