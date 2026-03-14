import { Route, Routes, Navigate } from "react-router-dom";
import { AdminLayout } from "./layouts/AdminLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { HoroscopesListPage } from "./pages/HoroscopesListPage";
import { HoroscopeFormPage } from "./pages/HoroscopeFormPage";
import { GenerateHoroscopePage } from "./pages/GenerateHoroscopePage";
import { SettingsPage } from "./pages/SettingsPage";
import { UserActivityPage } from "./pages/UserActivityPage";
import { UsersPage } from "./pages/UsersPage";

export const App = () => {
  return (
    <AdminLayout>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/horoscopes" element={<HoroscopesListPage />} />
        <Route path="/horoscopes/:id" element={<HoroscopeFormPage mode="edit" />} />
        <Route path="/generate" element={<GenerateHoroscopePage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/users/:userId/activity" element={<UserActivityPage />} />
        <Route path="/analytics" element={<UsersPage />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AdminLayout>
  );
};

