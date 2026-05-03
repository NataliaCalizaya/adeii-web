import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import QuienesSomosPage from './pages/QuienesSomosPage'
import EventosPage from './pages/EventosPage'
import ApuntesPage from './pages/ApuntesPage'
import ValidarCertificadoPage from './pages/ValidarCertificadoPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import MiPanelPage from './pages/MiPanelPage'
import AdminPage from './pages/AdminPage'
import GaleriaPage from './pages/GaleriaPage'

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          {/* Rutas con layout (Navbar + Footer) */}
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/quienes-somos" element={<QuienesSomosPage />} />
            <Route path="/eventos" element={<EventosPage />} />
            <Route path="/galeria" element={<GaleriaPage />} />
            <Route path="/apuntes" element={<ApuntesPage />} />
            <Route path="/validar-certificado" element={<ValidarCertificadoPage />} />
            <Route path="/mi-panel" element={<MiPanelPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Route>

          {/* Login / Register sin layout completo */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 404 */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center text-center px-4">
              <div>
                <h1 className="text-6xl font-bold text-primary font-public-sans mb-4">404</h1>
                <p className="text-on-surface-variant mb-6">La página que buscás no existe.</p>
                <a href="/" className="btn-primary">Volver al inicio</a>
              </div>
            </div>
          } />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  )
}
