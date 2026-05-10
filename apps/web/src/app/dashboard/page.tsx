'use client';

import React, { useEffect, useState } from 'react';
import {
  FileText,
  Database,
  ImageIcon,
  Users,
  Clock,
  Key,
  Settings,
  Plus
} from 'lucide-react';
import { apiFetch } from '@/lib/api';
import Link from 'next/link';
import styles from './page.module.css';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    contentTypes: 0,
    entries: 0,
    media: 0,
    users: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [cts, entries, media, users] = await Promise.all([
        apiFetch('/content-types'),
        apiFetch('/content-entries'),
        apiFetch('/media'),
        apiFetch('/users')
      ]);
      
      setStats({
        contentTypes: cts.length,
        entries: entries.length,
        media: media.length,
        users: users.length
      });
    } catch (err) {
      console.error('Failed to fetch dashboard stats', err);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: 'Content Models', value: stats.contentTypes, icon: Database, color: '#8b5cf6', link: '/dashboard/content-types' },
    { label: 'Total Entries', value: stats.entries, icon: FileText, color: '#3b82f6', link: '/dashboard/content' },
    { label: 'Media Assets', value: stats.media, icon: ImageIcon, color: '#10b981', link: '/dashboard/media' },
    { label: 'Team Members', value: stats.users, icon: Users, color: '#f59e0b', link: '/dashboard/team' }
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className="brand-font">Dashboard Overview</h1>
        <p>Welcome back! Here is what is happening in your CMS.</p>
      </header>

      <div className={styles.statsGrid}>
        {statCards.map((stat) => (
          <Link href={stat.link} key={stat.label} className={styles.statCard}>
            <div className={styles.statIcon} style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
              <stat.icon size={24} />
            </div>
            <div className={styles.statInfo}>
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>{isLoading ? '...' : stat.value}</span>
            </div>
          </Link>
        ))}
      </div>

      <div className={styles.sections}>
        <section className={styles.recentActivity}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWrap}>
              <Plus size={20} className={styles.titleIcon} />
              <h2>Quick Actions</h2>
            </div>
          </div>

          <div className={styles.actionGrid}>
            <Link href="/dashboard/content-types/new" className={styles.actionItem}>
              <div className={styles.actionIcon}><Plus size={18} /></div>
              <span>Create New Content Model</span>
            </Link>
            <Link href="/dashboard/settings/api-keys" className={styles.actionItem}>
              <div className={styles.actionIcon}><Key size={18} /></div>
              <span>Manage API Delivery Keys</span>
            </Link>
            <Link href="/dashboard/settings/navigation" className={styles.actionItem}>
              <div className={styles.actionIcon}><Settings size={18} /></div>
              <span>Configure Navigation Menu</span>
            </Link>
          </div>
        </section>

        <section className={styles.trafficChart}>
          <div className={styles.sectionHeader}>
            <div className={styles.titleWrap}>
              <Clock size={20} className={styles.titleIcon} />
              <h2>System Status</h2>
            </div>
          </div>
          <div className={styles.statusContent}>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>API Service</span>
              <span className={styles.statusValue} style={{ color: '#10b981' }}>Operational</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Database</span>
              <span className={styles.statusValue} style={{ color: '#10b981' }}>Connected</span>
            </div>
            <div className={styles.statusItem}>
              <span className={styles.statusLabel}>Media Storage</span>
              <span className={styles.statusValue} style={{ color: '#10b981' }}>Available</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
