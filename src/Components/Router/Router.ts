import { AuthPage } from "../Pages/AuthPage";
import { InstructionPage } from "./../Pages/InstructionPage";
import { MainPage } from "./../Pages/MainPage";

interface Route {
  path: string;
  element: React.ElementType;
}

export const privateRoutes: Route[] = [
  { path: "/main", element: MainPage },
  { path: "/", element: InstructionPage },
];

export const publicRoutes: Route[] = [{ path: "/login", element: AuthPage }];
