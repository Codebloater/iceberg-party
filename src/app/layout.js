import "./globals.css";

export const metadata = {
  title: "IceBerg Party | Best Place for Penguins to Be",
  description: "IceBerg party is Pudgy Penguine Themed NFT Memory Card Game"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={"w-full min-h-screen "}>{children}</body>
    </html>
  );
}
