import './globals.css'
import { Inter } from 'next/font/google'
import 'mapbox-gl/dist/mapbox-gl.css';

const inter = Inter({ subsets: ['latin'] })



export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
 
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        </body>
    </html>
  )
}
