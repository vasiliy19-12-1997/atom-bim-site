import { AuthPage } from "../Pages/AuthPage";
import { InstructionPage } from "./../Pages/InstructionPage";
import { MainPage } from "./../Pages/MainPage";

interface Route {
  path: string;
  element: React.ElementType;
}

export const privateRoutes: Route[] = [
  { path: "/atom-bim-site/main", element: MainPage },
  { path: "/atom-bim-site", element: InstructionPage },
];

export const publicRoutes: Route[] = [
  { path: "/atom-bim-site/login", element: AuthPage },
];
