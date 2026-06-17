import { useEffect, useRef, useState, type ReactNode } from 'react'
import { createElement } from 'react'

export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.08, rootMargin: '0px 0px -5% 0px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [])
  return createElement(
    'div',
    {
      ref,
      className,
      style: {
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : 'translateY(28px)',
        transition: `opacity .72s ease ${delay}s, transform .72s ease ${delay}s`,
      },
    },
    children
  )
}
