'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import styles from './SiteHeader.module.css';

interface NavItem {
  label: string;
  url: string;
  children?: NavItem[];
}

interface SiteHeaderProps {
  siteName: string;
  navigation: NavItem[];
}

const NavLink: React.FC<{ item: NavItem; level?: number }> = ({ item, level = 0 }) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <div 
      className={`${styles.navItem} ${hasChildren ? styles.hasDropdown : ''}`}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <Link href={item.url} className={styles.navLink}>
        {item.label}
        {hasChildren && <ChevronDown size={14} className={styles.chevron} />}
      </Link>

      {hasChildren && isOpen && (
        <div className={`${styles.dropdown} ${level > 0 ? styles.submenu : ''}`}>
          {item.children?.map((child, i) => (
            <NavLink key={i} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
};

import { ThemeToggle } from '@/components/atoms/ThemeToggle';

export const SiteHeader: React.FC<SiteHeaderProps> = ({ siteName, navigation }) => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          <div className={styles.logo}>Z</div>
          <span className="brand-font">{siteName}</span>
        </Link>

        <div className={styles.right}>
          <nav className={styles.nav}>
            {navigation.map((item, i) => (
              <NavLink key={i} item={item} />
            ))}
          </nav>
          
          <div className={styles.actions}>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};
