import type { Metadata } from "next";
import "@cigar/design/styles.css";
import { ClientLayout } from "../components/ClientLayout";

export const metadata: Metadata = {
  title: "Cigar — Find cigars you'll like. See the best price.",
  description: "US-only. Recommendation + deal-finding. We refer; we don't sell.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
