import "./globals.css";
import Header from "./ui/header";
import Footer from "./ui/footer";


export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 w-full shadow-md z-50">
          <Header />
        </header>
        <main className="flex flex-col flex-grow mt-18 mb-18 overflow-auto">
          {children}
        </main>
        <footer className="fixed bottom-0 left-0 w-full shadow-md z-50">
          <Footer />
        </footer>
      </body>
    </html>
  );
}