import { useState } from 'react'

const STORIES = [
  {
    id: 'photo-1484154218962-a197022b5858',
    label: 'Bilbao · 2024',
    url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'photo-1618221195710-dd6b41faaea6',
    label: 'Getxo · 2024',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'photo-1560448204-e02f11c3d0e2',
    label: 'Barakaldo · 2023',
    url: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'photo-1621905251189-08b45d6a269e',
    label: 'Leioa · 2024',
    url: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'photo-1558618666-fcd25c85cd64',
    label: 'Basauri · 2023',
    url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=200&q=70',
  },
  {
    id: 'photo-1504328345606-18bbc8c9d7d1',
    label: 'Sestao · 2024',
    url: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=800&q=80',
    thumb: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?auto=format&fit=crop&w=200&q=70',
  },
]

export default function Stories() {
  const [activeStory, setActiveStory] = useState<number | null>(null)

  return (
    <>
      <div
        style={{
          background: '#fff',
          padding: '28px 0',
          borderBottom: '1px solid #f0f0f0',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: 20,
            overflowX: 'auto',
            padding: '4px 32px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="stories-scroll"
        >
          {STORIES.map((story, idx) => (
            <button
              key={story.id}
              onClick={() => setActiveStory(idx)}
              style={{
                flexShrink: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              {/* Gradient ring */}
              <div
                style={{
                  width: 76,
                  height: 76,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0a0a0a, #6b6b6b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <div
                  style={{
                    width: 68,
                    height: 68,
                    borderRadius: '50%',
                    border: '2px solid #fff',
                    overflow: 'hidden',
                  }}
                >
                  <img
                    src={story.thumb}
                    alt={story.label}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
              </div>
              <span
                style={{
                  fontSize: '.65rem',
                  color: '#6b6b6b',
                  fontFamily: 'Inter, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                {story.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Story viewer modal */}
      {activeStory !== null && (
        <div
          onClick={() => setActiveStory(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 900,
            background: 'rgba(0,0,0,.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <button
            onClick={() => setActiveStory(null)}
            style={{
              position: 'absolute',
              top: 24,
              right: 24,
              background: 'rgba(255,255,255,.15)',
              border: 'none',
              color: '#fff',
              width: 44,
              height: 44,
              borderRadius: '50%',
              fontSize: 20,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
            }}
          >
            ✕
          </button>
          <div
            onClick={e => e.stopPropagation()}
            style={{ maxWidth: '90vw', maxHeight: '90vh', position: 'relative' }}
          >
            <img
              src={STORIES[activeStory].url}
              alt={STORIES[activeStory].label}
              style={{
                maxWidth: '90vw',
                maxHeight: '82vh',
                objectFit: 'contain',
                borderRadius: 16,
              }}
            />
            <p
              style={{
                color: 'rgba(255,255,255,.7)',
                textAlign: 'center',
                marginTop: 12,
                fontSize: '.82rem',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              {STORIES[activeStory].label}
            </p>
          </div>
          {/* Prev / Next */}
          {activeStory > 0 && (
            <button
              onClick={e => { e.stopPropagation(); setActiveStory(i => (i ?? 1) - 1) }}
              style={{
                position: 'absolute',
                left: 24,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,.15)',
                border: 'none',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                fontSize: 20,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >
              ‹
            </button>
          )}
          {activeStory < STORIES.length - 1 && (
            <button
              onClick={e => { e.stopPropagation(); setActiveStory(i => (i ?? 0) + 1) }}
              style={{
                position: 'absolute',
                right: 24,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,.15)',
                border: 'none',
                color: '#fff',
                width: 44,
                height: 44,
                borderRadius: '50%',
                fontSize: 20,
                cursor: 'pointer',
                backdropFilter: 'blur(8px)',
              }}
            >
              ›
            </button>
          )}
        </div>
      )}

      <style>{`
        .stories-scroll::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}
