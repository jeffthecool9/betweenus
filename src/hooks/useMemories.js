import { useState, useEffect } from 'react'

const KEY = 'betweenus_memories_v2'

export function useMemories() {
  const [memories, setMemories] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY)
      return raw ? JSON.parse(raw) : []
    } catch { return [] }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(memories))
  }, [memories])

  const addMemory = (data) => {
    const m = { id: Date.now(), createdAt: new Date().toISOString(), ...data }
    setMemories(p => [...p, m])
    return m
  }

  const deleteMemory = (id) => setMemories(p => p.filter(m => m.id !== id))

  const getByLocation = (locId) => memories.filter(m => m.locationId === locId)

  return { memories, addMemory, deleteMemory, getByLocation }
}
