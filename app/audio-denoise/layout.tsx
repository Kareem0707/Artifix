import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Audio Denoise | AI Background Noise Removal',
  description: 'Clean up your audio recordings by removing background noise, echo, and wind using AI. Perfect for podcasters and YouTubers.',
  keywords: ['AI audio denoise', 'remove background noise', 'تنقية الصوت بالذكاء الاصطناعي', 'عزل الضوضاء', 'Audio Denoise'],
  openGraph: {
    title: 'Audio Denoise | AI Background Noise Removal',
    description: 'Clean up your audio recordings by removing background noise, echo, and wind using AI.',
    url: 'https://artifix.tech/audio-denoise',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
