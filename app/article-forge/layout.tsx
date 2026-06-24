import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Article Forge | AI SEO Article Writer',
  description: 'Generate comprehensive, SEO-optimized, human-like articles in seconds using advanced AI. Target global audiences and bypass AI detectors easily.',
  keywords: ['AI article writer', 'SEO content generator', 'كتابة مقالات بالذكاء الاصطناعي', 'سيو', 'مولد مقالات', 'Article Forge'],
  openGraph: {
    title: 'Article Forge | AI SEO Article Writer',
    description: 'Generate comprehensive, SEO-optimized, human-like articles in seconds using advanced AI.',
    url: 'https://artifix.tech/article-forge',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
