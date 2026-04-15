import "./globals.css";

export const metadata = {
  title: "HeavenlyPlants – Indoor Plant QR System",
  description: "Track your indoor plants, view their life stories, care instructions, and ownership history.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
