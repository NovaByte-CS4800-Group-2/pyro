// app/providers.tsx
'use client'

import {HeroUIProvider, ToastProvider} from '@heroui/react'

export function Providers({children}: { children: React.ReactNode }) {
  	return (
		<HeroUIProvider>
			<ToastProvider placement="top-left" toastOffset={80} />
			{children}
		</HeroUIProvider>
  	)
}