import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Pulso Público — Atlas do Dinheiro Municipal",
  description: "Um painel aberto para enxergar como o orçamento das capitais brasileiras chega à vida cotidiana.",
  metadataBase: new URL("https://pulso-publico.example"),
  openGraph: {
    title: "Pulso Público",
    description: "Do cofre à rua: compare receitas, despesas e prioridades das capitais brasileiras.",
    type: "website",
    locale: "pt_BR",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: "Pulso Público — Do cofre à rua" }]
  },
  twitter: {
    card: "summary_large_image",
    title: "Pulso Público",
    description: "Do cofre à rua: um atlas do dinheiro municipal.",
    images: ["/og.png"]
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
