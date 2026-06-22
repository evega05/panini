import { useWizard } from '../context/WizardContext'
import Hero from '../components/home/Hero'
import ServiceMarquee from '../components/home/ServiceMarquee'
import Stories from '../components/home/Stories'
import ServicesSection from '../components/home/ServicesSection'
import ProjectsGallery from '../components/home/ProjectsGallery'
import StatsSection from '../components/home/StatsSection'
import ProgressSection from '../components/home/ProgressSection'
import Testimonials from '../components/home/Testimonials'
import ProcessSection from '../components/home/ProcessSection'
import AboutSection from '../components/home/AboutSection'
import Certifications from '../components/home/Certifications'
import FAQSection from '../components/home/FAQSection'
import CoverageSection from '../components/home/CoverageSection'
import ContactSection from '../components/home/ContactSection'
import FloatingButtons from '../components/FloatingButtons'
import ExitPopup from '../components/ExitPopup'
import SurveyWidget from '../components/SurveyWidget'

export default function Home() {
  const { openWizard } = useWizard()

  return (
    <div>
      <Hero onPresupuesto={openWizard} />
      <ServiceMarquee />
      <Stories />
      <ServicesSection onPresupuesto={openWizard} />
      <ProjectsGallery />
      <StatsSection />
      <ProgressSection />
      <Testimonials />
      <ProcessSection />
      <AboutSection />
      <Certifications />
      <FAQSection />
      <CoverageSection />
      <ContactSection onPresupuesto={openWizard} />
      <FloatingButtons />
      <ExitPopup />
      <SurveyWidget onPresupuesto={openWizard} />
    </div>
  )
}
