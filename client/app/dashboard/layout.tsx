"use client"
import "@/app/globals.css";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { SessionProvider } from "next-auth/react";


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
	<html lang="en">
	  <body className="flex flex-col min-h-screen">
	  <SessionProvider>
	  <header className="fixed top-0 left-0 w-full shadow-md z-50">
		  <Header />
		</header>
		<main className="flex-grow mt-16 mb-16 overflow-auto">
		  {children}
		</main>
		<footer className="fixed bottom-0 left-0 w-full shadow-md z-50">
		  <Footer />
		</footer>
		</SessionProvider>
	  </body>
	</html>
  );
}