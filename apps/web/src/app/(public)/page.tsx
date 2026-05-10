import styles from './landing.module.css';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import DynamicPage from './[slug]/page';

async function getHomeData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery/home`, {
      headers: {
        'x-api-key': process.env.INTERNAL_API_KEY || ''
      },
      next: { revalidate: 60 }
    });

    if (!response.ok) return null;
    const data = await response.json();
    return data && data.length > 0 ? data : null;
  } catch (err) {
    return null;
  }
}

export default async function LandingPage() {
  const homeData = await getHomeData();

  // If we have home content in the CMS, render the dynamic page
  if (homeData) {
    return <DynamicPage params={Promise.resolve({ slug: 'home' })} />;
  }

  // Fallback to original static landing page if no "home" content exists
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
          <Link href="/admin">
            <button className={styles.primaryBtn}>Get Started</button>
          </Link>
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
