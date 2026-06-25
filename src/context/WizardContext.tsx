import { createContext, useContext, useState, type ReactNode } from 'react'

interface WizardContextValue {
  isOpen: boolean
  preselectedGremioId: string | null
  openWizard: (gremioId?: string) => void
  closeWizard: () => void
}

const WizardContext = createContext<WizardContextValue>({
  isOpen: false,
  preselectedGremioId: null,
  openWizard: () => {},
  closeWizard: () => {},
})

export function WizardProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false)
  const [preselectedGremioId, setPreselectedGremioId] = useState<string | null>(null)

  const openWizard = (gremioId?: string) => {
    setPreselectedGremioId(gremioId ?? null)
    setIsOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeWizard = () => {
    setIsOpen(false)
    setPreselectedGremioId(null)
    document.body.style.overflow = ''
  }

  return (
    <WizardContext.Provider value={{ isOpen, preselectedGremioId, openWizard, closeWizard }}>
      {children}
    </WizardContext.Provider>
  )
}

export function useWizard() {
  return useContext(WizardContext)
}
