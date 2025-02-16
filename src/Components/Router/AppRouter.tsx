import React from "react";
import { Route, Routes } from "react-router-dom";
import { privateRoutes, publicRoutes } from "./Router";

interface AppRouterProps {
  isAuthenticated: boolean;
}

export const AppRouter: React.FC<AppRouterProps> = ({ isAuthenticated }) => {
  const routesToRender = isAuthenticated ? privateRoutes : publicRoutes;

  return (
    <Routes>
      {routesToRender.map((route) => (
        <Route key={route.path} path={route.path} element={<route.element />} />
      ))}
    </Routes>
  );
};
