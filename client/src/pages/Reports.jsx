import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchReport } from '../store'
import { format, subDays } from 'date-fns'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Line } from 'react-chartjs-2'
import './Reports.css'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, Filler)

const chartColors = {
  accent: '#6c63ff',
  accentLight: 'rgba(108, 99, 255, 0.3)',
  success: '#34d399',
  successLight: 'rgba(52, 211, 153, 0.3)',
  water: '#38bdf8',
  waterLight: 'rgba(56, 189, 248, 0.2)',
  warning: '#fbbf24',
  warningLight: 'rgba(251, 191, 36, 0.3)',
  gridColor: 'rgba(255,255,255,0.06)',
  textColor: '#9ca3af',
}

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { color: chartColors.textColor, font: { family: 'Inter', size: 12 } } },
    tooltip: {
      backgroundColor: '#1e2030',
      titleColor: '#e8eaed',
      bodyColor: '#9ca3af',
      borderColor: 'rgba(255,255,255,0.1)',
      borderWidth: 1,
      cornerRadius: 8,
      padding: 10,
    },
  },
  scales: {
    x: {
      ticks: { color: chartColors.textColor, font: { family: 'Inter', size: 11 } },
      grid: { color: chartColors.gridColor },
    },
    y: {
      beginAtZero: true,
      ticks: { color: chartColors.textColor, font: { family: 'Inter', size: 11 } },
      grid: { color: chartColors.gridColor },
    },
  },
}

export default function Reports() {
  const dispatch = useDispatch()
  const { data, loading } = useSelector(s => s.reports)
  const [reportType, setReportType] = useState('weekly')
  const [refDate, setRefDate] = useState(new Date().toISOString().slice(0, 10))

  useEffect(() => {
    dispatch(fetchReport({ type: reportType, date: refDate }))
  }, [reportType, refDate, dispatch])

  if (loading || !data) {
    return (
      <div className="reports-page">
        <div className="reports-header">
          <h1>📊 Reports</h1>
        </div>
        <div className="card"><div className="skeleton" style={{ height: '300px' }} /></div>
      </div>
    )
  }

  const labels = data.daily.map(d => format(new Date(d.date + 'T00:00:00'), 'MMM d'))

  const taskChartData = {
    labels,
    datasets: [
      {
        label: 'Priorities Completed',
        data: data.daily.map(d => d.priorities.completed),
        backgroundColor: chartColors.accentLight,
        borderColor: chartColors.accent,
        borderWidth: 2,
        borderRadius: 6,
      },
      {
        label: 'Todos Completed',
        data: data.daily.map(d => d.todos.completed),
        backgroundColor: chartColors.successLight,
        borderColor: chartColors.success,
        borderWidth: 2,
        borderRadius: 6,
      },
    ],
  }

  const hydrationChartData = {
    labels,
    datasets: [
      {
        label: 'Glasses of Water',
        data: data.daily.map(d => d.hydration),
        fill: true,
        borderColor: chartColors.water,
        backgroundColor: chartColors.waterLight,
        pointBackgroundColor: chartColors.water,
        pointBorderColor: '#fff',
        pointRadius: 4,
        tension: 0.4,
      },
    ],
  }

  const s = data.summary

  return (
    <div className="reports-page">
      <div className="reports-header">
        <h1>📊 Reports</h1>
        <div className="reports-controls">
          <div className="toggle-group" role="radiogroup" aria-label="Report type">
            <button
              className={`toggle-btn ${reportType === 'weekly' ? 'active' : ''}`}
              onClick={() => setReportType('weekly')}
              role="radio"
              aria-checked={reportType === 'weekly'}
            >Weekly</button>
            <button
              className={`toggle-btn ${reportType === 'monthly' ? 'active' : ''}`}
              onClick={() => setReportType('monthly')}
              role="radio"
              aria-checked={reportType === 'monthly'}
            >Monthly</button>
          </div>
          <input
            type="date"
            className="date-picker"
            value={refDate}
            onChange={e => setRefDate(e.target.value)}
            aria-label="Report reference date"
          />
        </div>
      </div>

      <p className="reports-range">
        {format(new Date(data.startDate + 'T00:00:00'), 'MMM d, yyyy')} — {format(new Date(data.endDate + 'T00:00:00'), 'MMM d, yyyy')}
      </p>

      {/* Summary Cards */}
      <div className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon">⭐</div>
          <div className="summary-value">{s.completedPriorities}/{s.totalPriorities}</div>
          <div className="summary-label">Priorities Done</div>
          <div className="summary-badge">
            <span className="badge badge-accent">{s.priorityCompletionRate}%</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">✅</div>
          <div className="summary-value">{s.completedTodos}/{s.totalTodos}</div>
          <div className="summary-label">Todos Done</div>
          <div className="summary-badge">
            <span className="badge badge-success">{s.todoCompletionRate}%</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">💧</div>
          <div className="summary-value">{s.avgHydration}</div>
          <div className="summary-label">Avg Glasses / Day</div>
          <div className="summary-badge">
            <span className="badge badge-info">{s.totalHydration} total</span>
          </div>
        </div>
        <div className="summary-card">
          <div className="summary-icon">📝</div>
          <div className="summary-value">{s.totalNotes}</div>
          <div className="summary-label">Notes Written</div>
          <div className="summary-badge">
            <span className="badge badge-warning">{s.totalGoals} goals</span>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card chart-card">
          <h2>Tasks Completed Per Day</h2>
          <div className="chart-container">
            <Bar data={taskChartData} options={{ ...baseOptions, plugins: { ...baseOptions.plugins, title: { display: false } } }} />
          </div>
        </div>
        <div className="card chart-card">
          <h2>Hydration Trend</h2>
          <div className="chart-container">
            <Line data={hydrationChartData} options={{ ...baseOptions, plugins: { ...baseOptions.plugins, title: { display: false } } }} />
          </div>
        </div>
      </div>
    </div>
  )
}
