import "@/styles/globals.css";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import Layout from "@/components/dashboard/Layout"; // 👈 Importa el layout

export default function App({ Component, pageProps, router }) {
  const useDashboardLayout =
    router.pathname.startsWith("/dashboard") || router.pathname.startsWith("/client");

  return (
    <AuthProvider>
      <ThemeProvider>
        {useDashboardLayout ? (
          <Layout>
            <Component {...pageProps} />
          </Layout>
        ) : (
          <Component {...pageProps} />
        )}
      </ThemeProvider>
    </AuthProvider>
  );
}
