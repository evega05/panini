import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { WizardProvider } from './context/WizardContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import BudgetWizard from './components/BudgetWizard'
import Home from './pages/Home'
import GremioLanding from './pages/GremioLanding'
import Profesionales from './pages/Profesionales'
import NotFound from './pages/NotFound'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <BudgetWizard />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <WizardProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/servicios/:slug" element={<GremioLanding />} />
            <Route path="/servicios/:slug/:municipio" element={<GremioLanding />} />
            <Route path="/profesionales" element={<Profesionales />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </WizardProvider>
    </BrowserRouter>
  )
}
