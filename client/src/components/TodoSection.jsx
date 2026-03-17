import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchTodos, createTodo, updateTodo, deleteTodo } from '../store'
import './TodoSection.css'

export default function TodoSection() {
  const { items, loading } = useSelector(s => s.todos)
  const selectedDate = useSelector(s => s.ui.selectedDate)
  const dispatch = useDispatch()
  const [newTitle, setNewTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  useEffect(() => {
    dispatch(fetchTodos(selectedDate))
    setEditingId(null)
    setNewTitle('')
  }, [selectedDate, dispatch])

  const handleCreate = () => {
    if (!newTitle.trim()) return
    dispatch(createTodo({ date: selectedDate, title: newTitle.trim() }))
    setNewTitle('')
  }

  const handleToggle = (item) => {
    dispatch(updateTodo({ id: item.id, completed: !item.completed }))
  }

  const handleUpdate = (id) => {
    if (!editTitle.trim()) return
    dispatch(updateTodo({ id, title: editTitle.trim() }))
    setEditingId(null)
  }

  const handleDelete = (id) => dispatch(deleteTodo(id))

  const startEdit = (item) => {
    setEditingId(item.id)
    setEditTitle(item.title)
  }

  const completed = items.filter(i => i.completed).length

  return (
    <div className="card todo-section" aria-label="Other Todos">
      <div className="card-header">
        <h2><span className="icon">✅</span> Other Todos</h2>
        <span className="badge badge-success">{completed}/{items.length}</span>
      </div>

      {loading ? (
        <div><div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} /><div className="skeleton" style={{ height: '20px', marginBottom: '8px' }} /><div className="skeleton" style={{ height: '20px' }} /></div>
      ) : (
        <>
          <div className="todo-list">
            {items.map(item => (
              <div key={item.id} className={`list-item todo-item ${item.completed ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  className="checkbox"
                  checked={!!item.completed}
                  onChange={() => handleToggle(item)}
                  aria-label={`Mark todo "${item.title}" as ${item.completed ? 'incomplete' : 'complete'}`}
                />
                {editingId === item.id ? (
                  <div className="inline-form" style={{ flex: 1 }}>
                    <input
                      className="input"
                      value={editTitle}
                      onChange={e => setEditTitle(e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter') handleUpdate(item.id); if (e.key === 'Escape') setEditingId(null) }}
                      autoFocus
                      aria-label="Edit todo title"
                    />
                    <button className="btn btn-primary btn-sm" onClick={() => handleUpdate(item.id)}>Save</button>
                    <button className="btn btn-ghost btn-sm" onClick={() => setEditingId(null)}>✕</button>
                  </div>
                ) : (
                  <>
                    <span className={`item-content ${item.completed ? 'completed-text' : ''}`}>{item.title}</span>
                    <div className="item-actions">
                      <button className="btn-icon" onClick={() => startEdit(item)} aria-label="Edit todo" title="Edit">✏️</button>
                      <button className="btn-icon" onClick={() => handleDelete(item.id)} aria-label="Delete todo" title="Delete">🗑️</button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {items.length === 0 && (
            <p className="empty-state">No todos yet. Add some tasks below!</p>
          )}

          <div className="add-row">
            <div className="inline-form">
              <input
                className="input"
                placeholder="Add a todo…"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleCreate() }}
                aria-label="New todo title"
              />
              <button className="btn btn-primary btn-sm" onClick={handleCreate} disabled={!newTitle.trim()}>Add</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
