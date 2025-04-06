import "./globals.css";
import Header from "./ui/header";
import Footer from "./ui/footer";
import { Providers } from "./providers";
import Chatbot from "./ui/chatbot";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
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