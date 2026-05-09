'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/features/auth/services/auth.service';
import {
  LayoutDashboard,
  Database,
  FileText,
  Image as ImageIcon,
  Users,
  Settings,
  LogOut,
  Menu,
  X,
  Key
} from 'lucide-react';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    const userData = authService.getUser();
    if (!userData) {
      router.push('/');
    } else {
      setUser(userData);
    }
  }, [router]);

  if (!user) return null;

  const navItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Database, label: 'Content Builder', href: '/dashboard/content-types' },
    { icon: FileText, label: 'Content Entries', href: '/dashboard/content' },
    { icon: ImageIcon, label: 'Media Library', href: '/dashboard/media' },
    { icon: Users, label: 'Team', href: '/dashboard/team' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    { icon: Database, label: 'Navigation', href: '/dashboard/settings/navigation' },
    { icon: Key, label: 'API Keys', href: '/dashboard/settings/api-keys' },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? '' : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>Z</div>
          {isSidebarOpen && <span className="brand-font">Zhiin CMS</span>}
        </div>

        <nav className={styles.nav}>
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className={styles.navItem}>
              <item.icon size={20} />
              {isSidebarOpen && <span>{item.label}</span>}
            </a>
          ))}
        </nav>

        <div className={styles.sidebarFooter}>
          <button onClick={() => authService.logout()} className={styles.logoutBtn}>
            <LogOut size={20} />
            {isSidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className={styles.main}>
        <header className={styles.header}>
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className={styles.toggleBtn}>
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className={styles.userProfile}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{user.email}</span>
              <span className={styles.userRole}>{user.role}</span>
            </div>
            <div className={styles.avatar}>{user.email[0].toUpperCase()}</div>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
