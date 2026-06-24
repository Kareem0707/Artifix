import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Font Fixer | Arabic Text Corrector for Design',
  description: 'Instantly fix reversed or disconnected Arabic text for Premiere Pro, After Effects, Photoshop, and other design software.',
  keywords: ['Arabic font fixer', 'fix arabic text in photoshop', 'تصحيح الخط العربي', 'عكس الحروف العربية', 'بريمير برو', 'Font Fixer'],
  openGraph: {
    title: 'Font Fixer | Arabic Text Corrector for Design',
    description: 'Instantly fix reversed or disconnected Arabic text for Premiere Pro, After Effects, and Photoshop.',
    url: 'https://artifix.tech/font-fixer',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
