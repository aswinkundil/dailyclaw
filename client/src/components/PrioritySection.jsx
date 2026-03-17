import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchPriorities, createPriority, updatePriority, deletePriority } from '../store'
import './PrioritySection.css'

const MAX = 3

export default function PrioritySection() {
  const { items, loading } = useSelector(s => s.priorities)
  const selectedDate = useSelector(s => s.ui.selectedDate)
  const dispatch = useDispatch()
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    dispatch(fetchPriorities(selectedDate))
    setEditingId(null)
    setNewTitle('')
  }, [selectedDate, dispatch])

  const handleCreate = () => {
    if (!newTitle.trim() || items.length >= MAX) return
    dispatch(createPriority({ date: selectedDate, title: newTitle.trim() }))
    setNewTitle('')
  }

  const handleToggle = (item) => {
    dispatch(updatePriority({ id: item.id, completed: !item.completed }))
  }

  const handleUpdate = (id) => {
    if (!editTitle.trim()) return
    dispatch(updatePriority({ id, title: editTitle.trim() }))
    setEditingId(null)
  }

  const handleDelete = (id) => dispatch(deletePriority(id))

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditTitle(item.title)
  }

  const remaining = MAX - items.length

  return (
    <div className="card priority-section" aria-label="Top 3 Priorities">
      <div className="card-header">
        <h2><span className="icon">⭐</span> Top 3 Priorities</h2>
        <span className="badge badge-warning">{items.length}/{MAX}</span>
      </div>

      {loading ? (
        <div><div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} /><div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} /><div className="skeleton" style={{ height: '20px' }} /></div>
      ) : (
        <>
          <div className="priority-list">
            {items.map((item, idx) => (
              <div key={item.id} className={`list-item priority-item ${item.completed ? 'done' : ''}`}>
                <span className="priority-number">{idx + 1}</span>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={!!item.completed}
                  onChange={() => handleToggle(item)}
                  aria-label={`Mark priority "${item.title}" as ${item.completed ? 'incomplete' : 'complete'}`}
                />
                {editingId === item.id ? (
                  <div className="inline-form" style={{ flex: 1 }}>
                    <input
                      className="input"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleUpdate(item.id); if (e.key === 'Escape') setEditingId(null) }}
                      autoFocus
                      aria-label="Edit priority title"
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(item.id)}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <span className={`item-content ${item.completed ? 'completed-text' : ''}`}>{item.title}</span>
                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => startEdit(item)} aria-label="Edit priority" title="Edit">✏️</button>
                      <button className="btn-icon" onClick={() => handleDelete(item.id)} aria-label="Delete priority" title="Delete">🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {remaining > 0 && (
            <div className="add-row">
              <div className="inline-form">
                <input
                  className="input"
                  placeholder={`Add priority (${remaining} remaining)…`}
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
                  aria-label="New priority title"
                />
                <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={!newTitle.trim()}>Add</button>
              </div>
            </div>
          )}

          {items.length === 0 && (
            <p className="empty-state">Set up to {MAX} priorities for this day.</p>
          )}
        </>
      )}
    </div>
  )
}
