import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Visual Transformer | AI Image Generator & Editor',
  description: 'Generate stunning, photorealistic images from text or transform existing images with powerful AI models.',
  keywords: ['AI image generator', 'Midjourney alternative', 'توليد صور بالذكاء الاصطناعي', 'تصميم صور', 'Visual Transformer'],
  openGraph: {
    title: 'Visual Transformer | AI Image Generator',
    description: 'Generate stunning, photorealistic images from text or transform existing images with powerful AI models.',
    url: 'https://artifix.tech/visual-transformer',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
