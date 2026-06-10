import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function MemoryModal({ location, memories, onAdd, onClose }) {
  const [tab, setTab] = useState(memories.length > 0 ? 'view' : 'add')
  const [form, setForm] = useState({ title: '', note: '', date: new Date().toISOString().slice(0, 10), emoji: '♡' })
  const [saved, setSaved] = useState(false)

  const emojis = ['♡', '✈️', '🌸', '🌙', '⭐', '🍜', '📸', '🐾', '🎉', '💌']

  const handleSave = () => {
    if (!form.title.trim()) return
    onAdd({
      locationId: location.id,
      locationName: location.name,
      lat: location.lat,
      lng: location.lng,
      ...form,
    })
    setSaved(true)
    setTimeout(() => { setSaved(false); setTab('view'); setForm({ title: '', note: '', date: new Date().toISOString().slice(0, 10), emoji: '♡' }) }, 1000)
  }

  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="memory-modal"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.95 }}
        transition={{ type: 'spring', stiffness: 300, damping: 28 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="modal-header">
          <div>
            <p className="modal-location-tag">{location.tag || '📍 Memory Spot'}</p>
            <h2 className="modal-title">{location.name}</h2>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        {/* Tabs */}
        {memories.length > 0 && (
          <div className="modal-tabs">
            <button className={`modal-tab ${tab === 'view' ? 'active' : ''}`} onClick={() => setTab('view')}>
              Memories ({memories.length})
            </button>
            <button className={`modal-tab ${tab === 'add' ? 'active' : ''}`} onClick={() => setTab('add')}>
              + Add New
            </button>
          </div>
        )}

        <AnimatePresence mode="wait">
          {tab === 'view' ? (
            <motion.div
              key="view"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="modal-body"
            >
              {memories.map(m => (
                <div key={m.id} className="memory-entry">
                  <div className="memory-emoji">{m.emoji}</div>
                  <div className="memory-content">
                    <p className="memory-entry-title">{m.title}</p>
                    {m.note && <p className="memory-entry-note">{m.note}</p>}
                    <p className="memory-entry-date">{m.date}</p>
                  </div>
                </div>
              ))}
              <button className="btn-add-first" onClick={() => setTab('add')}>
                + Add a memory here
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="add"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="modal-body"
            >
              {/* Emoji picker */}
              <div className="emoji-row">
                {emojis.map(e => (
                  <button
                    key={e}
                    className={`emoji-btn ${form.emoji === e ? 'selected' : ''}`}
                    onClick={() => setForm(f => ({ ...f, emoji: e }))}
                  >
                    {e}
                  </button>
                ))}
              </div>

              <input
                className="memory-input"
                placeholder="What happened here? ♡"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              />

              <textarea
                className="memory-textarea"
                placeholder="Tell the story... (optional)"
                value={form.note}
                onChange={e => setForm(f => ({ ...f, note: e.target.value }))}
                rows={3}
              />

              <input
                type="date"
                className="memory-input"
                value={form.date}
                onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              />

              <motion.button
                className="btn-save-memory"
                onClick={handleSave}
                whileTap={{ scale: 0.97 }}
                animate={saved ? { backgroundColor: '#4ade80' } : {}}
              >
                {saved ? '✓ Saved!' : 'Save Memory'}
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  )
}
