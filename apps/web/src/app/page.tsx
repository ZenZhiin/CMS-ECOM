import styles from './landing.module.css';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <main className={styles.main}>
      <div className={styles.blob}></div>

      <nav className={styles.nav}>
        <div className={styles.brand}>
          <div className={styles.logo}>Z</div>
          <span className="brand-font">Zhiin Digital</span>
        </div>
        <Link href="/admin">
          <button className={styles.adminBtn}>Admin Portal</button>
        </Link>
      </nav>

      <div className={styles.hero}>
        <h1 className="brand-font">The Future of <span className={styles.gradientText}>Content Architecture</span></h1>
        <p>A high-performance, headless CMS designed for modern digital experiences. Define, manage, and deliver content with unparalleled speed.</p>

        <div className={styles.actions}>
          <button className={styles.primaryBtn}>Explore Documentation</button>
          <button className={styles.secondaryBtn}>View Source</button>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h3>Atomic Design</h3>
          <p>Built with modular, reusable components for maximum scalability.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>Headless API</h3>
          <p>Deliver your content to any device with our lightning-fast JSON API.</p>
        </div>
        <div className={styles.featureCard}>
          <h3>Dynamic Schemas</h3>
          <p>Create custom content models in seconds with our visual builder.</p>
        </div>
      </div>
    </main>
  );
}
