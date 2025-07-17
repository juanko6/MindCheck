import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="es">
      <Head>
        {/* Open Graph para WhatsApp y Facebook */}
        <meta property="og:title" content="💡 Aprende más rápido con la magia de la IA" />
        <meta
          property="og:description"
          content="Convierte tus PDFs en quizzes inteligentes en segundos. MindCheck es tu nuevo compañero de estudio. ⚡️Gratis, rápido y adictivo."
        />
        <meta property="og:image" content="https://mindcheck.juanko.com/og-image.png" />
        <meta property="og:url" content="https://mindcheck.juanko.com/" />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="💡 Aprende más rápido con la magia de la IA" />
        <meta
          name="twitter:description"
          content="Convierte tus PDFs en quizzes inteligentes en segundos. MindCheck es tu nuevo compañero de estudio. ⚡️Gratis, rápido y adictivo."
        />
        <meta name="twitter:image" content="https://mindcheck.juanko.com/og-image.png" />
      </Head>
      <body className="antialiased">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
