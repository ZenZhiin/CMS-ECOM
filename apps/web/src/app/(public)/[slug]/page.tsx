import React from 'react';
import { notFound } from 'next/navigation';
import { apiFetch } from '@/lib/api';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPageData(slug: string) {
  try {
    // We use the delivery API we just built
    // Note: We'll need a "Internal" API key or allow local calls without key for the frontend renderer
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery/${slug}`, {
      headers: {
        'x-api-key': process.env.INTERNAL_API_KEY || ''
      },
      next: { revalidate: 60 } // Cache for 1 minute
    });

    if (!response.ok) return null;
    return response.json();
  } catch (err) {
    return null;
  }
}

export default async function DynamicPage({ params }: PageProps) {
  const { slug } = await params;
  const entries = await getPageData(slug);

  if (!entries || entries.length === 0) {
    notFound();
  }

  // For dynamic pages, we'll take the first published entry for that slug
  const entry = entries[0];
  const { data } = entry;

  return (
    <main className={styles.wrapper}>
      <div className={styles.container}>
        {Object.entries(data).map(([key, value]: [string, any]) => {
          // Dynamic Rendering Logic based on field value/type
          if (key.toLowerCase().includes('image') || (typeof value === 'string' && value.startsWith('http'))) {
            return (
              <section key={key} className={styles.imageSection}>
                <img src={value} alt={key} className={styles.heroImage} />
              </section>
            );
          }

          if (key.toLowerCase() === 'title' || key.toLowerCase() === 'name') {
            return (
              <section key={key} className={styles.hero}>
                <h1 className="brand-font">{value}</h1>
              </section>
            );
          }

          if (typeof value === 'string' && value.length > 100) {
            return (
              <section key={key} className={styles.contentSection}>
                <div dangerouslySetInnerHTML={{ __html: value }} />
              </section>
            );
          }

          return (
            <section key={key} className={styles.textSection}>
              <p>{value}</p>
            </section>
          );
        })}
      </div>
    </main>
  );
}
