import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Image Upscaler | AI Resolution Enhancer',
  description: 'Upscale your low-resolution images to 4K or 8K without losing quality using advanced AI algorithms.',
  keywords: ['AI image upscaler', 'enhance image resolution', 'تكبير الصور', 'تحسين جودة الصور', 'Image Upscaler'],
  openGraph: {
    title: 'Image Upscaler | AI Resolution Enhancer',
    description: 'Upscale your low-resolution images to 4K or 8K without losing quality.',
    url: 'https://artifix.tech/image-upscaler',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
