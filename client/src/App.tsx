import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext.js';
import { AuthProvider } from './context/AuthContext.js';
import { Navbar } from './components/layout/Navbar.js';
import { Footer } from './components/layout/Footer.js';

import { Home } from './pages/Home.js';
import { Projects } from './pages/Projects.js';
import { ProjectDetail } from './pages/ProjectDetail.js';
import { AdminLogin } from './pages/AdminLogin.js';
import { AdminDashboard } from './pages/AdminDashboard.js';
import { AdminProjectNew } from './pages/AdminProjectNew.js';
import { AdminProjectEdit } from './pages/AdminProjectEdit.js';
import { NotFound } from './pages/NotFound.js';

const ExternalRedirect: React.FC<{ url: string }> = ({ url }) => {
  React.useEffect(() => {
    window.location.replace(url);
  }, [url]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
      <div className="w-8 h-8 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-xs font-mono text-slate-500 dark:text-zinc-400">Redirecting to official channel...</p>
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/projects/:slug" element={<ProjectDetail />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/projects/new" element={<AdminProjectNew />} />
                <Route path="/admin/projects/:id/edit" element={<AdminProjectEdit />} />
                
                {/* Social Redirect Routes */}
                <Route path="/youtube" element={<ExternalRedirect url="https://www.youtube.com/@TechCuriousYT" />} />
                <Route path="/yt" element={<ExternalRedirect url="https://www.youtube.com/@TechCuriousYT" />} />
                <Route path="/instagram" element={<ExternalRedirect url="https://www.instagram.com/techcuriouss?stkn=b3l6a3QyaWp1OXBp" />} />
                <Route path="/insta" element={<ExternalRedirect url="https://www.instagram.com/techcuriouss?stkn=b3l6a3QyaWp1OXBp" />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
