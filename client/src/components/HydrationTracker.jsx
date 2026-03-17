import { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { fetchHydration, updateHydration } from '../store'
import './HydrationTracker.css'

const MAX_GLASSES = 12

export default function HydrationTracker() {
  const { data, loading } = useSelector(s => s.hydration)
  const selectedDate = useSelector(s => s.ui.selectedDate)
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(fetchHydration(selectedDate))
  }, [selectedDate, dispatch])

  const glasses = data?.glasses || 0

  const setGlasses = (count) => {
    const clamped = Math.max(0, Math.min(MAX_GLASSES, count))
    dispatch(updateHydration({ date: selectedDate, glasses: clamped }))
  }

  const percentage = Math.round((glasses / 8) * 100) // 8 glasses = 100% daily target

  return (
    <div className="card hydration-section" aria-label="Hydration Tracker">
      <div className="card-header">
        <h2><span className="icon">💧</span> Hydration Tracker</h2>
        <span className="badge badge-info">{glasses} glasses</span>
      </div>

      {loading ? (
        <div className="skeleton" style={{ height: '80px' }} />
      ) : (
        <>
          <div className="hydration-visual">
            <div className="water-bar-container">
              <div className="water-bar" style={{ width: `${Math.min(100, percentage)}%` }}>
                <span className="water-bar-label">{percentage}%</span>
              </div>
            </div>
            <p className="hydration-target">
              {glasses >= 8
                ? '🎉 Daily target reached!'
                : `${8 - glasses} more to reach daily target (8 glasses)`}
            </p>
          </div>

          <div className="glass-grid" role="group" aria-label="Water glasses">
            {Array.from({ length: MAX_GLASSES }, (_, i) => (
              <button
                key={i}
                className={`glass-btn ${i < glasses ? 'filled' : ''}`}
                onClick={() => setGlasses(i < glasses ? i : i + 1)}
                aria-label={`${i + 1} glass${i + 1 > 1 ? 'es' : ''}`}
                title={`${i + 1} glass${i + 1 > 1 ? 'es' : ''}`}
              >
                <span className="glass-icon">{i < glasses ? '💧' : '○'}</span>
              </button>
            ))}
          </div>

          <div className="hydration-controls">
            <button className="btn btn-ghost btn-sm" onClick={() => setGlasses(glasses - 1)} disabled={glasses <= 0}>
              − Remove
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => setGlasses(glasses + 1)} disabled={glasses >= MAX_GLASSES}>
              + Add Glass
            </button>
          </div>
        </>
      )}
    </div>
  )
}
