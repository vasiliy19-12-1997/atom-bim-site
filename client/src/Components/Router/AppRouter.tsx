import React from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./Router";

interface AppRouterProps {
  isAuthenticated: boolean;
}

export const AppRouter: React.FC<AppRouterProps> = ({ isAuthenticated }) => {
  const routesToRender = isAuthenticated ? privateRoutes : publicRoutes;

  const location = useLocation();
  if (!isAuthenticated && !location.pathname.includes("login")) {
    return <Navigate to="/login" />;
  }
  if (isAuthenticated && location.pathname.includes("login")) {
    return <Navigate to="/" />;
  }
  return (
    <Routes location={location}>
      {routesToRender.map((route) => (
        <Route key={route.path} path={route.path} element={<route.element />} />
      ))}
    </Routes>
  );
};
