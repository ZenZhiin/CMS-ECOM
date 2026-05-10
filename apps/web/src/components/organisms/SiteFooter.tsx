import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube
} from 'react-icons/fa6';
import styles from './SiteFooter.module.css';

const getBrandInitial = (platform: string) => {
  const p = platform.toLowerCase();
  if (p.includes('facebook')) return 'F';
  if (p.includes('instagram')) return 'I';
  if (p.includes('linkedin')) return 'L';
  if (p.includes('twitter') || p.includes('x')) return 'X';
  if (p.includes('youtube')) return 'Y';
  return platform.charAt(0).toUpperCase();
};

const SocialIcon = ({ link, size = 18 }: { link: any; size?: number }) => {
  // 1. Check for custom icon URL
  if (link.iconUrl) {
    return <img src={link.iconUrl} alt={link.label} style={{ width: size, height: size, objectFit: 'contain' }} />;
  }

  // 2. Check for known platform brand icons
  const p = (link.platform || link.label || '').toLowerCase();
  if (p.includes('facebook')) return <FaFacebookF size={size} />;
  if (p.includes('instagram')) return <FaInstagram size={size} />;
  if (p.includes('linkedin')) return <FaLinkedinIn size={size} />;
  if (p.includes('twitter') || p.includes('x')) return <FaXTwitter size={size} />;
  if (p.includes('youtube')) return <FaYoutube size={size} />;

  // 3. Fallback to First Letter
  return <span className={styles.initial}>{getBrandInitial(p || 'G')}</span>;
};

interface SiteFooterProps {
  siteName?: string;
  footerNavigation?: any[];
  socialLinks?: any[];
  footerText?: string;
  // Company Details
  companyName?: string;
  companyAddress?: string;
  companyPhone?: string;
  companyEmail?: string;
}

export const SiteFooter: React.FC<SiteFooterProps> = ({
  siteName = 'Zhiin Digital',
  footerNavigation = [],
  socialLinks = [],
  footerText = '',
  companyName,
  companyAddress,
  companyPhone,
  companyEmail
}) => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.main}>
          <div className={styles.brand}>
            <h2 className="brand-font">{siteName}</h2>
            <p className={styles.tagline}>{footerText || 'Empowering your digital presence with modern architecture.'}</p>

            <div className={styles.social}>
              {socialLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.socialIcon}
                  title={link.label}
                  data-platform={link.platform || link.label}
                >
                  <SocialIcon link={link} />
                </a>
              ))}
            </div>
          </div>

          <div className={styles.navSections}>
            <div className={styles.navGroup}>
              <h3>Menu</h3>
              <ul>
                {footerNavigation.map((link, idx) => (
                  <li key={idx}>
                    <a href={link.url}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className={styles.companyInfo}>
            <h3>Company</h3>
            <div className={styles.infoList}>
              {companyName && <p className={styles.companyName}>{companyName}</p>}
              {companyAddress && <p>{companyAddress}</p>}
              {companyPhone && <p>{companyPhone}</p>}
              {companyEmail && <p>{companyEmail}</p>}
            </div>
          </div>
        </div>

        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {new Date().getFullYear()} {siteName}. All rights reserved.
          </p>
          <div className={styles.legal}>
            <a href="/privacy-policy">Privacy Policy</a>
            <a href="/terms-of-service">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
