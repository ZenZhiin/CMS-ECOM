import { LoginForm } from '@/components/organisms/LoginForm';
import styles from './page.module.css';

export default function Home() {
  return (
    <main className={styles.main}>
      {/* Decorative Background Elements */}
      <div className={styles.blob1}></div>
      <div className={styles.blob2}></div>

      <div className={styles.content}>
        <div className={styles.brand}>
          <div className={styles.logo}>Z</div>
          <span className="brand-font">Zhiin CMS</span>
        </div>

        <LoginForm />

        <footer className={styles.footer}>
          &copy; 2026 Zhiin Digital Architecture. All rights reserved.
        </footer>
      </div>
    </main>
  );
}
