import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeContext"; // 👈 Importa
import { AuthProvider } from "@/context/AuthContext";

export default function App({ Component, pageProps }) {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </AuthProvider>
  );
}
