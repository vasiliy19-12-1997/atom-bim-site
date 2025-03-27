import { AuthPage } from "../Pages/AuthPage/AuthPage";
import { EIRPage } from "../Pages/EIRPage/EIRPage";
import { FAQPage } from "../Pages/FAQPage/FAQPage";
import { InstructionPage } from "../Pages/InstructionPage/InstructionPage";
import { LibraryPage } from "../Pages/LibraryPage/LibraryPage";
import { MainPage } from "../Pages/MainPage/MainPage";
import { VideoPage } from "../Pages/VideoPage/VideoPage";
import { Test } from "../Pages/Test/Test";
import { Route } from "../Types/types";

export const privateRoutes: Route[] = [
  { path: "/", element: MainPage },
  { path: "/eir", element: EIRPage },
  { path: "/instruction", element: InstructionPage },
  { path: "/library", element: LibraryPage },
  { path: "/video", element: VideoPage },
  { path: "/faq", element: FAQPage },
  { path: "/test", element: Test },
];

export const publicRoutes: Route[] = [
  { path: "/login", element: AuthPage },
  { path: "/test", element: Test },
];
