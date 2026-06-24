import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Content Architect | AI Neuromarketing Copywriter',
  description: 'Craft high-converting, psychology-driven copy for Facebook Ads, Instagram, and websites tailored to specific demographics using AI.',
  keywords: ['AI copywriter', 'neuromarketing AI', 'Facebook ads generator', 'كتابة محتوى إعلاني', 'صياغة إعلانات', 'Content Architect'],
  openGraph: {
    title: 'Content Architect | AI Neuromarketing Copywriter',
    description: 'Craft high-converting, psychology-driven copy tailored to specific demographics using AI.',
    url: 'https://artifix.tech/content-architect',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
