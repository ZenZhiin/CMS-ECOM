import React from 'react';
import {
  FilePlus,
  BarChart3,
  Clock,
  TrendingUp,
  FileCheck,
  AlertCircle
} from 'lucide-react';
import styles from './page.module.css';

export default function DashboardPage() {
  const stats = [
    { label: 'Total Pages', value: '24', icon: FilePlus, color: '#6366f1' },
    { label: 'Published', value: '18', icon: FileCheck, color: '#10b981' },
    { label: 'Drafts', value: '6', icon: AlertCircle, color: '#f59e0b' },
    { label: 'Avg. Views', value: '1.2k', icon: TrendingUp, color: '#8b5cf6' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="brand-font">Dashboard Overview</h1>
        <p>Welcome to Zhiin CMS. Here's what's happening with your content.</p>
      </header>

      {/* Stats Grid */}
      <div className={styles.statsGrid}>
        {stats.map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{stat.value}</span>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.sections}>
        {/* Recent Activity */}
        <section className={styles.recentActivity}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWrap}>
              <Clock size={20} className={styles.titleIcon} />
              <h2>Recent Activity</h2>
            </div>
            <button className={styles.viewAll}>View All</button>
          </div>

          <div className={styles.activityList}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={styles.activityItem}>
                <div className={styles.activityAvatar}>JD</div>
                <div className={styles.activityContent}>
                  <p><strong>John Doe</strong> updated <strong>Pricing Page</strong></p>
                  <span>2 hours ago</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Traffic Chart Placeholder */}
        <section className={styles.trafficChart}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWrap}>
              <BarChart3 size={20} className={styles.titleIcon} />
              <h2>Content Performance</h2>
            </div>
          </div>
          <div className={styles.chartPlaceholder}>
            <div className={styles.bar} style={{ height: '40%' }}></div>
            <div className={styles.bar} style={{ height: '70%' }}></div>
            <div className={styles.bar} style={{ height: '50%' }}></div>
            <div className={styles.bar} style={{ height: '90%' }}></div>
            <div className={styles.bar} style={{ height: '60%' }}></div>
            <div className={styles.bar} style={{ height: '80%' }}></div>
          </div>
        </section>
      </div>
    </div>
  );
}
