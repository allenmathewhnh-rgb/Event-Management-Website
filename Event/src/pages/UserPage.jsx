import './DashboardPage.css'

const userStats = [
  { title: 'Upcoming Events', value: '06', note: 'Your next booking starts this Friday' },
  { title: 'Saved Activities', value: '13', note: 'Add more plans for this month' },
  { title: 'Reward Points', value: '940', note: 'Use them on premium seats or offers' },
]

const userPlans = [
  {
    title: 'Complete your weekend plan',
    description: 'Pick one movie, one live event, and one activity from your saved list.',
  },
  {
    title: 'Invite your friends',
    description: 'Share your bookings and build a group plan with one tap.',
  },
  {
    title: 'Check personalized picks',
    description: 'Your recommendations were refreshed based on your last bookings.',
  },
]

const userTags = ['My Tickets', 'Wishlist', 'Recommendations', 'Profile', 'Offers']

export default function UserPage() {
  return (
    <section className="dashboard-page user-page">
      <div className="dashboard-shell">
        <div className="dashboard-hero">
          <article className="dashboard-card dashboard-intro">
            <span className="dashboard-badge">User Dashboard</span>
            <h1>See your bookings, rewards, and picks in a page that matches the admin view.</h1>
            <p>
              The structure stays almost the same so both pages feel connected, while the colors
              and content shift slightly to fit the user experience.
            </p>

            <div className="dashboard-actions">
              <button className="dashboard-primary-action">Explore Events</button>
              <button className="dashboard-secondary-action">My Tickets</button>
            </div>
          </article>

          <aside className="dashboard-card dashboard-highlight">
            <div>
              <span className="dashboard-badge">Personal Feed</span>
              <h2>Your week is filling up nicely.</h2>
              <p>Two new recommendations match your favorite movies and live shows.</p>
            </div>

            <div className="dashboard-progress">
              <span>
                <strong>Profile completion</strong>
                <strong>84%</strong>
              </span>
              <div className="dashboard-progress-track">
                <div className="dashboard-progress-bar" style={{ width: '84%' }} />
              </div>
            </div>
          </aside>
        </div>

        <div className="dashboard-stats">
          {userStats.map((stat) => (
            <article key={stat.title} className="dashboard-card stat-card">
              <h3>{stat.title}</h3>
              <strong>{stat.value}</strong>
              <p>{stat.note}</p>
            </article>
          ))}
        </div>

        <div className="dashboard-sections">
          <article className="dashboard-card panel-card">
            <h2>Your next steps</h2>
            <div className="dashboard-list">
              {userPlans.map((plan) => (
                <div key={plan.title} className="dashboard-list-item">
                  <strong>{plan.title}</strong>
                  <p>{plan.description}</p>
                </div>
              ))}
            </div>
          </article>

          <article className="dashboard-card panel-card">
            <h2>Quick access</h2>
            <p>These shortcuts mirror the admin page so both views feel visually consistent.</p>
            <div className="dashboard-tags">
              {userTags.map((tag) => (
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
