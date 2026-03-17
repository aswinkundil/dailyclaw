import DateNav from '../components/DateNav'
import GoalSection from '../components/GoalSection'
import PrioritySection from '../components/PrioritySection'
import TodoSection from '../components/TodoSection'
import NoteSection from '../components/NoteSection'
import HydrationTracker from '../components/HydrationTracker'
import './Dashboard.css'

export default function Dashboard() {
  return (
    <div className="dashboard">
      <DateNav />
      <div className="dashboard-grid">
        <div className="col-main">
          <GoalSection />
          <PrioritySection />
          <TodoSection />
        </div>
        <div className="col-side">
          <HydrationTracker />
          <NoteSection />
        </div>
      </div>
    </div>
  )
}
