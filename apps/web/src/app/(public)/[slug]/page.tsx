import React from 'react';
import { notFound } from 'next/navigation';
import { FormRenderer } from '@/components/organisms/FormRenderer';
import { Mail, Phone, MapPin } from 'lucide-react';
import styles from './page.module.css';

interface PageProps {
  params: Promise<{ slug: string }>;
}

async function getPageData(slug: string) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery/${slug}`, {
      headers: {
        'x-api-key': process.env.INTERNAL_API_KEY || ''
      },
      next: { revalidate: 60 }
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

  const entry = entries[0];
  const { data } = entry;

  // Prioritize certain fields for layout
  const title = data.title || data.headline || data.name || 'Untitled';
  const subheadline = data.subheadline || data.vision || '';
  const heroImage = data.heroImage || null;

  return (
    <main className={styles.wrapper}>
      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.container}>
          <h1 className="brand-font">{title}</h1>
          {subheadline && <p className={styles.subheadline}>{subheadline}</p>}
        </div>
      </section>

      {heroImage && (
        <section className={styles.imageSection}>
          <div className={styles.container}>
            <img src={heroImage} alt={title} className={styles.heroImage} />
          </div>
        </section>
      )}

      <div className={styles.container}>
        <div className={styles.contentGrid}>
          <div className={styles.mainContent}>
            {Object.entries(data).map(([key, value]: [string, any]) => {
              // Skip already rendered or system fields
              if (['title', 'headline', 'name', 'subheadline', 'vision', 'heroImage', 'slug', 'formSlug'].includes(key)) {
                return null;
              }

              if (key === 'bio' || (typeof value === 'string' && value.length > 200)) {
                return (
                  <div key={key} className={styles.richText}>
                    <div dangerouslySetInnerHTML={{ __html: value }} />
                  </div>
                );
              }

              if (key === 'teamSection') {
                return (
                  <div key={key} className={styles.teamSection}>
                    <h2 className="brand-font">Our Team</h2>
                    <div dangerouslySetInnerHTML={{ __html: value }} />
                  </div>
                );
              }

              // Handle Contact Details specifically
              if (key === 'email') return (
                <div key={key} className={styles.contactItem}>
                  <Mail size={20} />
                  <span>{value}</span>
                </div>
              );
              if (key === 'phone') return (
                <div key={key} className={styles.contactItem}>
                  <Phone size={20} />
                  <span>{value}</span>
                </div>
              );
              if (key === 'address') return (
                <div key={key} className={styles.contactItem}>
                  <MapPin size={20} />
                  <span>{value}</span>
                </div>
              );

              return (
                <div key={key} className={styles.genericField}>
                  <label>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                  <p>{value}</p>
                </div>
              );
            })}
          </div>

          {entry.form && (
            <aside className={styles.formSidebar}>
              <div className={styles.formCard}>
                <h3 className="brand-font">{entry.form.name}</h3>
                <FormRenderer 
                  slug={entry.form.slug} 
                  name={entry.form.name} 
                  fields={entry.form.fields} 
                />
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}
