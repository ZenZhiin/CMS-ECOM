import React from 'react';
import { SiteHeader } from '@/components/organisms/SiteHeader';
import { SiteFooter } from '@/components/organisms/SiteFooter';

async function getSiteSettings() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/delivery/settings/global`, {
      headers: {
        'x-api-key': process.env.INTERNAL_API_KEY || ''
      },
      next: { revalidate: 60 } // Cache settings for 1 minute
    });

    if (!response.ok) return { siteName: 'Zhiin CMS', navigation: [] };
    return response.json();
  } catch (err) {
    return { siteName: 'Zhiin CMS', navigation: [] };
  }
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const settings = await getSiteSettings();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SiteHeader siteName={settings.siteName} navigation={settings.navigation} />
      <div style={{ flex: 1, paddingTop: '72px' }}>
        {children}
      </div>
      <SiteFooter 
        siteName={settings.siteName} 
        footerNavigation={settings.navigation} 
        socialLinks={settings.socialLinks}
        footerText={settings.footerText}
        companyName={settings.companyName}
        companyAddress={settings.companyAddress}
        companyPhone={settings.companyPhone}
        companyEmail={settings.companyEmail}
      />
    </div>
  );
}
