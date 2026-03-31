import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from './components/layout';
import { LoginPage, MembersPage } from './pages';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Public: Login ── */}
        <Route path="/" element={<LoginPage />} />

        {/* ── Protected: Dashboard shell ── */}
        <Route
          path="/dashboard/members"
          element={
            <MainLayout>
              <MembersPage />
            </MainLayout>
          }
        />

        {/* Catch-all → redirect to members */}
        <Route path="*" element={<Navigate to="/dashboard/members" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
