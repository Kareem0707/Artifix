import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Video Upscaler | 4K AI Video Enhancer',
  description: 'Enhance and upscale your blurry videos to crisp 4K resolution using AI. Improve framerates and colors instantly.',
  keywords: ['AI video upscaler', '4k video enhancer', 'توضيح الفيديوهات بالذكاء الاصطناعي', 'تحسين جودة الفيديو', 'Video Upscaler'],
  openGraph: {
    title: 'Video Upscaler | 4K AI Video Enhancer',
    description: 'Enhance and upscale your blurry videos to crisp 4K resolution using AI.',
    url: 'https://artifix.tech/video-upscaler',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
