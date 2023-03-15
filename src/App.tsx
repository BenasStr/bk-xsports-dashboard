import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./components/scenes/LoginPage";
import AuthUserGuard from "./controls/AuthUserGuard";
import axios from "axios";
import MainLayout from "./components/scenes/MainLayout";
import MainProtal from "./components/scenes/MainPortal";
import AccountPage from "./components/scenes/userPage/AccountPage";

const App = () => {
  // axios.get("https://app-benasstr.cloud.okteto.net/api/health");
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <AuthUserGuard path="/sports/add">
          <MainProtal portalType="SPORTS_ADD"/>
        </AuthUserGuard>
        <AuthUserGuard path="/sports/:sportId/edit">
          <MainProtal portalType="SPORTS_EDIT" />
        </AuthUserGuard>
        <AuthUserGuard path="/sports">
          <MainProtal portalType="SPORTS" />
        </AuthUserGuard>
        <AuthUserGuard path="/categories/add">
          <MainProtal portalType="CATEGORIES_ADD"/>
        </AuthUserGuard>
        <AuthUserGuard path="/categories/:categoryId/edit">
          <MainProtal portalType="CATEGORIES_EDIT"/>
        </AuthUserGuard>
        <AuthUserGuard path="/categories">
          <MainProtal portalType="CATEGORIES" />
        </AuthUserGuard>
        <AuthUserGuard path="/sample">
          <MainProtal portalType="SAMPLE" />
        </AuthUserGuard>
        <AuthUserGuard path="/users">
          <MainProtal portalType="USERS" />
        </AuthUserGuard>
        <AuthUserGuard path="/account">
          <MainProtal portalType="ACCOUNT"/>
        </AuthUserGuard>
        <AuthUserGuard path="/">
          <MainProtal portalType="?" />
        </AuthUserGuard>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
