import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";

const LandingPage = lazy(() =>
  import("@/pages/LandingPage").then(({ LandingPage }) => ({ default: LandingPage })),
);
const LoginPage = lazy(() =>
  import("@/pages/LoginPage").then(({ LoginPage }) => ({ default: LoginPage })),
);
const RegisterPage = lazy(() =>
  import("@/pages/RegisterPage").then(({ RegisterPage }) => ({ default: RegisterPage })),
);
const DashboardPage = lazy(() =>
  import("@/pages/DashboardPage").then(({ DashboardPage }) => ({ default: DashboardPage })),
);
const RepositoryPage = lazy(() =>
  import("@/pages/RepositoryPage").then(({ RepositoryPage }) => ({ default: RepositoryPage })),
);
const ChatPage = lazy(() =>
  import("@/pages/ChatPage").then(({ ChatPage }) => ({ default: ChatPage })),
);
const ProfilePage = lazy(() =>
  import("@/pages/ProfilePage").then(({ ProfilePage }) => ({ default: ProfilePage })),
);
const SettingsPage = lazy(() =>
  import("@/pages/SettingsPage").then(({ SettingsPage }) => ({ default: SettingsPage })),
);

export function AppRoutes() {
  return (
    <Suspense fallback={null}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/repository/:repoId" element={<RepositoryPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<LandingPage />} />
      </Routes>
    </Suspense>
  );
}
