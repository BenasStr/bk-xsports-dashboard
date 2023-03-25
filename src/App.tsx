import { BrowserRouter, Switch, Route } from "react-router-dom";
import LoginPage from "./components/scenes/LoginPage";
import AuthUserGuard from "./controls/AuthUserGuard";
import MainProtal from "./components/scenes/MainPortal";

const App = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/login">
          <LoginPage />
        </Route>
        <AuthUserGuard path="/sports/:sportId/categories/:categoryId/tricks">
          <MainProtal portalType="TRICKS" />
        </AuthUserGuard>
        <AuthUserGuard path="/sports/:sportId/categories">
          <MainProtal portalType="CATEGORIES" />
        </AuthUserGuard>
        <AuthUserGuard path="/sports">
          <MainProtal portalType="SPORTS" />
        </AuthUserGuard>
        <AuthUserGuard path="/variants">
          <MainProtal portalType="VARIANTS" />
        </AuthUserGuard>
        <AuthUserGuard path="/users">
          <MainProtal portalType="USERS" />
        </AuthUserGuard>
        <AuthUserGuard path="/account">
          <MainProtal portalType="ACCOUNT"/>
        </AuthUserGuard>
        <AuthUserGuard path="/">
          <MainProtal portalType="SPORTS"/>
        </AuthUserGuard>
      </Switch>
    </BrowserRouter>
  );
};

export default App;
