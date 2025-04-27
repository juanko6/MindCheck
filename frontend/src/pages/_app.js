import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeContext"; // 👈 Importa

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider>
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
