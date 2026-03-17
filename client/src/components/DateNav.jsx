import { useSelector, useDispatch } from 'react-redux'
import { setSelectedDate } from '../store'
import { format, addDays, subDays, isToday } from 'date-fns'
import './DateNav.css'

export default function DateNav() {
  const selectedDate = useSelector(s => s.ui.selectedDate)
  const dispatch = useDispatch()

  const date = new Date(selectedDate + 'T00:00:00')
  const formattedDate = format(date, 'EEEE, MMMM d, yyyy')
  const isTodayDate = isToday(date)

  const goPrev = () => dispatch(setSelectedDate(subDays(date, 1).toISOString().slice(0, 10)))
  const goNext = () => dispatch(setSelectedDate(addDays(date, 1).toISOString().slice(0, 10)))
  const goToday = () => dispatch(setSelectedDate(new Date().toISOString().slice(0, 10)))
  const handleDateChange = (e) => dispatch(setSelectedDate(e.target.value))

  return (
    <div className="date-nav" role="navigation" aria-label="Date navigation">
      <div className="date-nav-left">
        <button className="btn-icon" onClick={goPrev} aria-label="Previous day" title="Previous day">◀</button>
        <div className="date-display">
          <h1 className="date-title">{formattedDate}</h1>
          {isTodayDate && <span className="badge badge-accent">Today</span>}
        </div>
        <button className="btn-icon" onClick={goNext} aria-label="Next day" title="Next day">▶</button>
      </div>
      <div className="date-nav-right">
        <input
          type="date"
          className="date-picker"
          value={selectedDate}
          onChange={handleDateChange}
          aria-label="Select date"
        />
        {!isTodayDate && (
          <button className="btn btn-ghost btn-sm" onClick={goToday}>
            Today
          </button>
        )}
      </div>
    </div>
  )
}
