// app/providers.tsx
'use client';

import { HeroUIProvider, ToastProvider } from '@heroui/react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="light">
      <HeroUIProvider>
        <ToastProvider placement="top-left" toastOffset={80} />
        {children}
      </HeroUIProvider>
    </NextThemesProvider>
  );
}