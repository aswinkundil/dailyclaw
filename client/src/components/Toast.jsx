import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { removeToast } from '../store'
import './Toast.css'

export default function Toast() {
  const toasts = useSelector(s => s.ui.toasts)
  const dispatch = useDispatch()

  useEffect(() => {
    toasts.forEach(t => {
      const timer = setTimeout(() => dispatch(removeToast(t.id)), 3000)
      return () => clearTimeout(timer)
    })
  }, [toasts, dispatch])

  return (
    <div className="toast-container" role="alert" aria-live="polite">
      {toasts.map(t => (
        <div key={t.id} className={`toast toast-${t.type || 'success'}`}>
          <span>{t.type === 'error' ? '✕' : '✓'}</span>
          {t.message}
        </div>
      ))}
    </div>
  )
}
