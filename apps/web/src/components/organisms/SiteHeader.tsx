'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, ShoppingCart, User } from 'lucide-react';
import { useSettings } from '@/context/SettingsContext';
import { useCommerce } from '@/context/CommerceContext';
import { ThemeToggle } from '@/components/atoms/ThemeToggle';
import styles from './SiteHeader.module.css';

interface NavItem {
  label: string;
  url: string;
  children?: NavItem[];
}

interface SiteHeaderProps {
  siteName: string;
  siteLogo?: string | null;
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

export const SiteHeader: React.FC<SiteHeaderProps> = ({ siteName, siteLogo, navigation }) => {
  const { settings } = useSettings();
  const { cartCount, isCustomerLoggedIn } = useCommerce();

  const isEcomEnabled = settings?.isEcommerceEnabled;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.brand}>
          {siteLogo ? (
            <img src={siteLogo} alt={siteName} className={styles.siteLogo} />
          ) : (
            <div className={styles.logo}>{siteName.charAt(0).toUpperCase()}</div>
          )}
          <span className="brand-font">{siteName}</span>
        </Link>

        <div className={styles.right}>
          <nav className={styles.nav}>
            {navigation.map((item, i) => (
              <NavLink key={i} item={item} />
            ))}
            {isEcomEnabled && (
              <NavLink item={{ label: 'Shop', url: '/shop' }} />
            )}
          </nav>

          <div className={styles.actions}>
            <ThemeToggle />

            {isEcomEnabled && (
              <div className={styles.commerceActions}>
                <Link href="/cart" className={styles.iconBtn}>
                  <ShoppingCart size={20} />
                  {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                </Link>
                <Link href="/account" className={styles.iconBtn}>
                  <User size={20} className={isCustomerLoggedIn ? styles.activeUser : ''} />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
