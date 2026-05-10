import React from 'react';
import styles from './SiteFooter.module.css';

interface SiteFooterProps {
  siteName: string;
  footerNavigation: Array<{ label: string; url: string }>;
  socialLinks: Array<{ label: string; url: string; platform: string }>;
  footerText?: string;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({ siteName, footerNavigation, socialLinks, footerText }) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.top}>
          <div className={styles.brand}>
            <div className={styles.logo}>Z</div>
            <span className="brand-font">{siteName}</span>
          </div>
          <p className={styles.tagline}>{footerText || 'A high-performance digital experience.'}</p>
          
          <div className={styles.socials}>
            {socialLinks.map((link, i) => (
              <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className={styles.socialLink}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
        
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className={styles.links}>
            {footerNavigation.map((link, i) => (
              <a key={i} href={link.url}>{link.label}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
