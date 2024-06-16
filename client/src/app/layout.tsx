import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ClientNav from "@/components/ClientNav";
import { Toaster } from "@/components/ui/toaster";
import AppProvider from "@/Context/Context";
import LoadingComponent from "@/components/LoadingComponent";
import { GoogleOAuthProvider } from '@react-oauth/google';
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Freet.com",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <GoogleOAuthProvider clientId="251347409729-4ebihjc5jjhof6fqchid3u310msmrfr1.apps.googleusercontent.com">
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <LoadingComponent/>
              <ClientNav>
                <AppProvider>
                  {children}
                </AppProvider>
              </ClientNav>
           <Toaster/>
          
        </ThemeProvider>
        </GoogleOAuthProvider>
      </body>
    </html>
  );
}
