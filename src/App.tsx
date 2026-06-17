import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { WizardProvider } from './context/WizardContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BudgetWizard from './components/BudgetWizard'
import Home from './pages/Home'
import GremioLanding from './pages/GremioLanding'
import Profesionales from './pages/Profesionales'
import NotFound from './pages/NotFound'

function InnerApp() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <>
      <Navbar />
      <main>
        {/* Non-home pages need top padding to clear the fixed navbar */}
        {!isHome && <div style={{ height: 76 }} />}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/servicios/:slug" element={<GremioLanding />} />
          <Route path="/servicios/:slug/:municipio" element={<GremioLanding />} />
          <Route path="/profesionales" element={<Profesionales />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <BudgetWizard />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <WizardProvider>
        <InnerApp />
      </WizardProvider>
    </BrowserRouter>
  )
}
