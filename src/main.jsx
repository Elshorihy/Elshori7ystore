import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles/app.css';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';
import { AuthProvider } from './services/AuthContext';
import Home from './pages/Home';
import Apps from './pages/Apps';
import AppDetails from './pages/AppDetails';
import Community from './pages/Community';
import { Login, Register } from './pages/Auth';
import Profile from './pages/Profile';
import Developer from './pages/Developer';
import Admin from './pages/Admin';
import SearchPage from './pages/Search';
import Notifications from './pages/Notifications';
import AI from './pages/AI';
import NotFound from './pages/NotFound';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error) {
    console.error('Elshori7y runtime error:', error);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div className="runtime-error" dir="rtl">
        <div className="runtime-error-card">
          <div className="brand-mark big">E</div>
          <h1>حصل خطأ أثناء تشغيل Elshori7y</h1>
          <p>التطبيق لم يتمكن من تحميل الواجهة بشكل صحيح.</p>
          <details>
            <summary>تفاصيل الخطأ</summary>
            <pre>{String(this.state.error?.message || this.state.error)}</pre>
          </details>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            إعادة تحميل الموقع
          </button>
        </div>
      </div>
    );
  }
}

const root = document.getElementById('root');

if (!root) {
  throw new Error('Elshori7y: #root element was not found.');
}

window.addEventListener('error', (event) => {
  console.error('Elshori7y window error:', event.error || event.message);
});
window.addEventListener('unhandledrejection', (event) => {
  console.error('Elshori7y unhandled rejection:', event.reason);
});

createRoot(root).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/apps" element={<Apps />} />
                <Route path="/apps/:id" element={<AppDetails />} />
                <Route path="/community" element={<Community />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/profile/:uid" element={<Profile />} />
                <Route path="/developer" element={<Developer />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/ai" element={<AI />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Layout>
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);
