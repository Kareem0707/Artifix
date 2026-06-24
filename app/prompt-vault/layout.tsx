import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Prompt Vault | Best Prompts for ChatGPT & Midjourney',
  description: 'Unlock a massive library of engineered prompts for ChatGPT, Midjourney, and Claude to get the absolute best results.',
  keywords: ['AI prompts library', 'best ChatGPT prompts', 'مكتبة أوامر الذكاء الاصطناعي', 'برومبتات ميدجورني', 'Prompt Vault'],
  openGraph: {
    title: 'Prompt Vault | Best Prompts for ChatGPT',
    description: 'Unlock a massive library of engineered prompts for ChatGPT, Midjourney, and Claude.',
    url: 'https://artifix.tech/prompt-vault',
  },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
