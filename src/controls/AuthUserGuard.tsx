import React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { useSessionStorage } from "../hooks";

const AuthUserGuard: React.FunctionComponent<
  React.PropsWithChildren<RouteProps>
> = ({ children, ...rest }) => {
  const { sessionStorage } = useSessionStorage();
  const authed = !!sessionStorage;

  return (
    <Route
      {...rest}
      render={({ location }) => {
        return authed ? (
          children
        ) : (
          <Redirect to={{ pathname: "/login", state: { from: location } }} />
        );
      }}
    ></Route>
  );
};

export default AuthUserGuard;
