import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchGoals, createGoal, updateGoal, deleteGoal } from '../store'
import './GoalSection.css'

export default function GoalSection() {
  const { items, loading } = useSelector(s => s.goals)
  const selectedDate = useSelector(s => s.ui.selectedDate)
  const dispatch = useDispatch()
  const [editingId, setEditingId] = useState(null)
  const [editContent, setEditContent] = useState('')
  const [newContent, setNewContent] = useState('')

  useEffect(() => {
    dispatch(fetchGoals(selectedDate))
    setEditingId(null)
    setNewContent('')
  }, [selectedDate, dispatch])

  const handleCreate = () => {
    if (!newContent.trim()) return
    dispatch(createGoal({ date: selectedDate, content: newContent.trim() }))
    setNewContent('')
  }

  const handleUpdate = (id) => {
    dispatch(updateGoal({ id, content: editContent }))
    setEditingId(null)
  }

  const handleDelete = (id) => dispatch(deleteGoal(id))

  const startEdit = (goal) => {
    setEditingId(goal.id)
    setEditContent(goal.content)
  }

  return (
    <div className="card goal-section" aria-label="Goal for the Day">
      <div className="card-header">
        <h2><span className="icon">🎯</span> Goal for the Day</h2>
        <span className="badge badge-accent">{items.length}</span>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: '60px' }} />
      ) : (
        <>
          {items.map(goal => (
            <div key={goal.id} className="goal-entry">
              {editingId === goal.id ? (
                <div className="goal-edit">
                  <textarea
                    className="textarea"
                    value={editContent}
                    onChange={e => setEditContent(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleUpdate(goal.id) }}
                    autoFocus
                    aria-label="Edit goal content"
                  />
                  <div className="goal-edit-actions">
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(goal.id)}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="list-item">
                  <div className="item-content goal-text">{goal.content || <span className="empty-hint">Empty goal…</span>}</div>
                  <div className="item-actions">
                    <button className="btn-icon" onClick={() => startEdit(goal)} aria-label="Edit goal" title="Edit">✏️</button>
                    <button className="btn-icon" onClick={() => handleDelete(goal.id)} aria-label="Delete goal" title="Delete">🗑️</button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {items.length === 0 && (
            <p className="empty-state">No goal set for this day. Add one below!</p>
          )}

          <div className="add-row">
            <div className="inline-form">
              <textarea
                className="textarea"
                placeholder="What's your main goal today?"
                value={newContent}
                onChange={e => setNewContent(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && e.ctrlKey) handleCreate() }}
                rows={2}
                aria-label="New goal content"
              />
              <button className="btn btn-primary" onClick={handleCreate} disabled={!newContent.trim()}>Add</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
