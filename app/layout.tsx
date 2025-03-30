import './globals.css';
 import type { Metadata } from 'next';
 import { ThemeProvider } from "@/components/theme-provider"; 
 export const metadata: Metadata = {
   title: 'Hotel Social CMS',
   description: 'Social media content management system for hotels',
 };
 
 export default function RootLayout({
   children,
 }: {
   children: React.ReactNode;
 }) {
   return (
     <html lang="en" suppressHydrationWarning>
       <body>
           <ThemeProvider
             attribute="class"
             defaultTheme="system"
             enableSystem
             disableTransitionOnChange
           >
             {children}
           </ThemeProvider>
       </body>
     </html>
   )};