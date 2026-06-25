import { useRef, useState, useCallback } from 'react'
import { Reveal } from '../../hooks/useReveal'

const PROJECTS = [
  {
    photo: 'photo-1484154218962-a197022b5858',
    category: 'Reforma Integral',
    title: 'Bilbao, 2024',
    url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=680&q=80',
  },
  {
    photo: 'photo-1618221195710-dd6b41faaea6',
    category: 'Diseño Interior',
    title: 'Getxo, 2024',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=680&q=80',
  },
  {
    photo: 'photo-1560448204-e02f11c3d0e2',
    category: 'Reforma de Piso',
    title: 'Barakaldo, 2023',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=680&q=80',
  },
  {
    photo: 'photo-1621905251189-08b45d6a269e',
    category: 'Instalación Eléctrica',
    title: 'Leioa, 2024',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=680&q=80',
  },
  {
    photo: 'photo-1558618666-fcd25c85cd64',
    category: 'Reforma Completa',
    title: 'Basauri, 2023',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=680&q=80',
  },
  {
    photo: 'photo-1504328345606-18bbc8c9d7d1',
    category: 'Reforma & Instalación',
    title: 'Sestao, 2024',
    url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=680&q=80',
  },
]

interface ProjectsGalleryProps {
  onPresupuesto?: () => void
}

export default function ProjectsGallery({ onPresupuesto }: ProjectsGalleryProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const dragMoved = useRef(false)

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true)
    dragMoved.current = false
    setStartX(e.pageX - (scrollRef.current?.offsetLeft ?? 0))
    setScrollLeft(scrollRef.current?.scrollLeft ?? 0)
  }, [])

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    if (Math.abs(walk) > 4) dragMoved.current = true
    scrollRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const onMouseUp = useCallback(() => setIsDragging(false), [])

  return (
    <section id="proyectos" style={{ background: '#f5f4f2', paddingTop: 120 }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 48px' }}>
        <Reveal>
          <p style={{
            fontSize: '.72rem',
            letterSpacing: '.22em',
            textTransform: 'uppercase',
            color: '#6b6b6b',
            marginBottom: 14,
            fontFamily: 'Inter, sans-serif',
          }}>
            Proyectos recientes
          </p>
          <h2 style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: 'clamp(2.2rem,4.5vw,4.5rem)',
            fontWeight: 400,
            color: '#0a0a0a',
            lineHeight: 1.08,
            marginBottom: 52,
          }}>
            Nuestro{' '}
            <em style={{ color: '#6b6b6b', fontStyle: 'italic' }}>trabajo</em>
          </h2>
        </Reveal>
      </div>

      {/* Drag-to-scroll gallery */}
      <div
        ref={scrollRef}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        style={{
          display: 'flex',
          gap: 20,
          overflowX: 'auto',
          padding: '0 48px 80px',
          scrollbarWidth: 'none',
          cursor: isDragging ? 'grabbing' : 'grab',
          userSelect: 'none',
          WebkitOverflowScrolling: 'touch',
        }}
        className="gallery-scroll"
      >
        {PROJECTS.map((project, idx) => (
          <ProjectCard key={project.photo} project={project} idx={idx} dragMoved={dragMoved} onPresupuesto={onPresupuesto} />
        ))}
      </div>

      <style>{`
        .gallery-scroll::-webkit-scrollbar { display: none; }
        .project-card {
          flex-shrink: 0;
          width: 340px;
          height: 480px;
          border-radius: 18px;
          overflow: hidden;
          position: relative;
          transition: transform .3s ease;
        }
        .project-card:hover {
          transform: scale(1.025);
        }
        .project-card:hover .project-img {
          transform: scale(1.05);
        }
        .project-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform .5s ease;
        }
      `}</style>
    </section>
  )
}

function ProjectCard({
  project,
  idx,
  dragMoved,
  onPresupuesto,
}: {
  project: typeof PROJECTS[0]
  idx: number
  dragMoved: React.MutableRefObject<boolean>
  onPresupuesto?: () => void
}) {
  return (
    <Reveal delay={idx * 0.06}>
      <div
        className="project-card"
        style={{ cursor: 'pointer' }}
        onClick={() => { if (dragMoved.current) return; onPresupuesto?.() }}
      >
        <img
          src={project.url}
          alt={project.category}
          className="project-img"
          draggable={false}
        />
        {/* Bottom gradient overlay */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '55%',
          background: 'linear-gradient(to top, rgba(0,0,0,.75) 0%, transparent 100%)',
        }} />
        <div style={{
          position: 'absolute',
          bottom: 28,
          left: 28,
          right: 28,
        }}>
          <p style={{
            fontSize: '.68rem',
            letterSpacing: '.18em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,.6)',
            marginBottom: 6,
            fontFamily: 'Inter, sans-serif',
          }}>
            {project.category}
          </p>
          <p style={{
            fontFamily: '"Instrument Serif", serif',
            fontSize: '1.2rem',
            color: '#fff',
            fontWeight: 400,
          }}>
            {project.title}
          </p>
        </div>
      </div>
    </Reveal>
  )
}
