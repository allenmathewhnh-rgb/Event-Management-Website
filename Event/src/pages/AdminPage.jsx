import './DashboardPage.css'

const adminStats = [
  { title: 'Active Events', value: '24', note: '6 new event drafts this week' },
  { title: 'Total Users', value: '1,284', note: '12% growth from last month' },
  { title: 'Revenue', value: '$18.4K', note: 'Bookings are trending upward' },
]

const adminTasks = [
  {
    title: 'Approve pending organizers',
    description: 'Review 8 new organizer applications and verify their event categories.',
  },
  {
    title: 'Update featured listings',
    description: 'Refresh the homepage spotlight before the weekend traffic picks up.',
  },
  {
    title: 'Monitor support queue',
    description: 'Resolve payment and booking issues reported in the admin inbox.',
  },
]

const adminTags = ['Analytics', 'Payments', 'Event Control', 'Reports', 'Support']

export default function AdminPage() {
  return (
    <section className="dashboard-page admin-page">
      <div className="dashboard-shell">
        <div className="dashboard-hero">
          <article className="dashboard-card dashboard-intro">
            <span className="dashboard-badge">Admin Panel</span>
            <h1>Manage events, users, and performance from one clean dashboard.</h1>
            <p>
              Track platform activity, keep featured content updated, and stay on top of
              operations with a layout that matches the user side of the app.
            </p>

            <div className="dashboard-actions">
              <button className="dashboard-primary-action">Create Event</button>
              <button className="dashboard-secondary-action">View Reports</button>
            </div>
          </article>

          <aside className="dashboard-card dashboard-highlight">
            <div>
              <span className="dashboard-badge">Today</span>
              <h2>Platform health is strong.</h2>
              <p>Most systems are stable and ticket sales are ahead of yesterday.</p>
            </div>

            <div className="dashboard-progress">
              <span>
                <strong>Approval progress</strong>
                <strong>78%</strong>
              </span>
              <div className="dashboard-progress-track">
                <div className="dashboard-progress-bar" style={{ width: '78%' }} />
              </div>
            </div>
          </aside>
        </div>

        <div className="dashboard-stats">
          {adminStats.map((stat) => (
            <article key={stat.title} className="dashboard-card stat-card">
              <h3>{stat.title}</h3>
              <strong>{stat.value}</strong>
              <p>{stat.note}</p>
            </article>
          ))}
        </div>

        <div className="dashboard-sections">
          <article className="dashboard-card panel-card">
            <h2>Priority actions</h2>
            <div className="dashboard-list">
              {adminTasks.map((task) => (
                <div key={task.title} className="dashboard-list-item">
                  <strong>{task.title}</strong>
                  <p>{task.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card panel-card">
            <h2>Quick access</h2>
            <p>Keep the most-used admin tools in one place with a style close to the user page.</p>
            <div className="dashboard-tags">
              {adminTags.map((tag) => (
                <span key={tag} className="dashboard-tag">
                  {tag}
                </span>
              ))}
            </div>
          </article>
        </div>
      </div>
    </section>
  )
}
