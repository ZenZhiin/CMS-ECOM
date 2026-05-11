'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  ArrowLeft,
  Key,
  ShoppingBag,
  ChevronDown,
  ChevronRight,
  Package,
  Layers
} from 'lucide-react';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import { useSettings } from '@/context/SettingsContext';
import styles from './layout.module.css';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { settings } = useSettings();
  const [user, setUser] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    cms: true,
    ecommerce: true
  });

  useEffect(() => {
    const userData = authService.getUser();
    if (!userData) {
      router.push('/');
    } else {
      setUser(userData);
    }
  }, [router]);

  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  if (!user) return null;

  const cmsItems = [
    { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
    { icon: Database, label: 'Content Builder', href: '/dashboard/content-types' },
    { icon: FileText, label: 'Content Manager', href: '/dashboard/content' },
    { icon: ImageIcon, label: 'Media Library', href: '/dashboard/media' },
    { icon: Database, label: 'Navigation', href: '/dashboard/settings/navigation' },
    { icon: FileText, label: 'Forms', href: '/dashboard/forms' },
  ];

  const ecommerceItems = [
    { icon: ShoppingBag, label: 'Product Catalog', href: '/dashboard/commerce' },
    { icon: Settings, label: 'Settings', href: '/dashboard/commerce/settings' },
  ];

  const standaloneItems = [
    { icon: Users, label: 'Team', href: '/dashboard/team' },
    { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
    { icon: Key, label: 'API Keys', href: '/dashboard/settings/api-keys' },
  ];

  return (
    <div className={styles.container}>
      {/* Sidebar */}
      <aside className={`${styles.sidebar} ${isSidebarOpen ? '' : styles.collapsed}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>Z</div>
          {isSidebarOpen && <span className="brand-font">Panel</span>}
        </div>

        <nav className={styles.nav}>
          {/* CMS Group */}
          <div className={styles.navGroup}>
            <button
              className={styles.groupHeader}
              onClick={() => toggleGroup('cms')}
            >
              <div className={styles.groupTitle}>
                <Layers size={18} />
                {isSidebarOpen && <span>CMS Core</span>}
              </div>
              {isSidebarOpen && (
                openGroups.cms ? <ChevronDown size={14} /> : <ChevronRight size={14} />
              )}
            </button>
            {openGroups.cms && (
              <div className={styles.groupItems}>
                {cmsItems.map((item) => (
                  <Link key={item.label} href={item.href} className={styles.navItem}>
                    <item.icon size={18} />
                    {isSidebarOpen && <span>{item.label}</span>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Ecommerce Group */}
          {settings?.isEcommerceEnabled && (
            <div className={styles.navGroup}>
              <button
                className={styles.groupHeader}
                onClick={() => toggleGroup('ecommerce')}
              >
                <div className={styles.groupTitle}>
                  <Package size={18} />
                  {isSidebarOpen && <span>E-commerce</span>}
                </div>
                {isSidebarOpen && (
                  openGroups.ecommerce ? <ChevronDown size={14} /> : <ChevronRight size={14} />
                )}
              </button>
              {openGroups.ecommerce && (
                <div className={styles.groupItems}>
                  {ecommerceItems.map((item) => (
                    <Link key={item.label} href={item.href} className={styles.navItem}>
                      <item.icon size={18} />
                      {isSidebarOpen && <span>{item.label}</span>}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className={styles.standaloneItems}>
            {standaloneItems.map((item) => (
              <Link key={item.label} href={item.href} className={styles.navItem}>
                <item.icon size={18} />
                {isSidebarOpen && <span>{item.label}</span>}
              </Link>
            ))}
          </div>
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
            {isSidebarOpen ? <ArrowLeft size={20} /> : <Menu size={20} />}
          </button>

          <div className={styles.headerActions}>
            <ThemeToggle />
            <div className={styles.userProfile}>
              <div className={styles.userInfo}>
                <span className={styles.userName}>{user.email}</span>
                <span className={styles.userRole}>{user.role}</span>
              </div>
              <div className={styles.avatar}>{user.email[0].toUpperCase()}</div>
            </div>
          </div>
        </header>

        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
