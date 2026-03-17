import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchNotes, createNote, updateNote, deleteNote } from '../store'
import './NoteSection.css'

export default function NoteSection() {
  const { items, loading } = useSelector(s => s.notes)
  const selectedDate = useSelector(s => s.ui.selectedDate)
  const dispatch = useDispatch()
  const [newContent, setNewContent] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')

  useEffect(() => {
    dispatch(fetchNotes(selectedDate))
    setEditingId(null)
    setNewContent('')
  }, [selectedDate, dispatch])

  const handleCreate = () => {
    if (!newContent.trim()) return
    dispatch(createNote({ date: selectedDate, content: newContent.trim() }))
    setNewContent('')
  }

  const handleUpdate = (id) => {
    dispatch(updateNote({ id, content: editContent }))
    setEditingId(null)
  }

  const handleDelete = (id) => dispatch(deleteNote(id))

  const startEdit = (note) => {
    setEditingId(note.id)
    setEditContent(note.content)
  }

  return (
    <div className="card note-section" aria-label="Notes">
      <div className="card-header">
        <h2><span className="icon">📝</span> Notes</h2>
        <span className="badge badge-info">{items.length}</span>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: '60px' }} />
      ) : (
        <>
          <div className="note-list">
            {items.map(note => (
              <div key={note.id} className="note-card">
                {editingId === note.id ? (
                  <div className="note-edit">
                    <textarea
                      className="textarea"
                      value={editContent}
                      onChange={e => setEditContent(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleUpdate(note.id) }}
                      autoFocus
                      aria-label="Edit note content"
                    />
                    <div className="note-edit-actions">
                      <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(note.id)}>Save</button>
                      <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="note-text">{note.content}</p>
                    <div className="note-actions">
                      <button className="btn-icon" onClick={() => startEdit(note)} aria-label="Edit note" title="Edit">✏️</button>
                      <button className="btn-icon" onClick={() => handleDelete(note.id)} aria-label="Delete note" title="Delete">🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <p className="empty-state">No notes for this day. Jot something down!</p>
          )}

          <div className="add-row">
            <div className="inline-form" style={{ alignItems: 'flex-start' }}>
              <textarea
                className="textarea"
                placeholder="Write a note…"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleCreate() }}
                rows={2}
                aria-label="New note content"
              />
              <button className="btn btn-primary" onClick={handleCreate} disabled={!newContent.trim()}>Add</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
