import "./globals.css";
import Header from "./ui/header";
import Footer from "./ui/footer";
import Chatbot from "./ui/chatbot";
import { Providers } from "./providers";
import { auth } from "@/app/firebase/config";
import { browserSessionPersistence } from "firebase/auth";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  // Set session persistence (log-out on close).
  auth.setPersistence(browserSessionPersistence);
  
  // Return html
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <header className="fixed top-0 left-0 w-full shadow-md z-50">
              <Header />
            </header>
            <main className="flex flex-col flex-grow mt-16 mb-16 overflow-auto">
              {children}
            </main>
            <footer className="fixed bottom-0 left-0 w-full shadow-md z-50">
              <Footer />
            </footer>
            <Chatbot/>
          </div>
        </Providers>
      </body>
    </html>
  );
}