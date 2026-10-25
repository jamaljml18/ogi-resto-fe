import "./globals.css";

export const metadata = {
  title: "Ogi Resto - Order Menu Harian",
  description: "Aplikasi pemesanan menu harian karyawan di Ogi Resto",
  icons: {
    icon: "/favicon.svg",
    apple: "/favicon.svg",
  },
};

export const viewport = {width:"device-width",initialScale:1,userScalable:true};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link
          rel="alternate icon"
          href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><defs><linearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'><stop offset='0%25' stop-color='%23e11d48'/><stop offset='100%25' stop-color='%23f43f5e'/></linearGradient></defs><rect width='100' height='100' rx='24' fill='url(%23g)'/><text x='50%25' y='54%25' font-size='58' text-anchor='middle' dominant-baseline='middle'>🍽️</text></svg>"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
