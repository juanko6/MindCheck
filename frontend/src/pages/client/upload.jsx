import { useEffect } from "react";
import { useRouter } from "next/router";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import CircularLoader from "@/components/common/CircularLoader";
import DashedCardOption from "@/components/common/DashedCardOption";
import TestHistoryCard from "@/components/common/TestHistoryCard";
import { fetchUserTests } from "@/services/testService";
import Image from "next/image";
import { useState } from "react";

export default function UploaderPage() {
  const router = useRouter();
  const { darkMode } = useTheme();
  const { token, loading } = useAuth();
  const [tests, setTests] = useState([]);

  useEffect(() => {
    if (!loading && !token) {
      router.push("/login");
    } else if (token) {
      fetchUserTests(token)
        .then(setTests)
        .catch((e) => console.error("Error cargando tests:", e));
    }
  }, [loading, token]);

  if (loading || !token) return <CircularLoader />;

  return (
    <div className={`p-6 w-full transition-colors duration-500 ${darkMode ? "bg-[#0B1120] text-white" : "bg-white text-gray-900"}`}>
      {/* Título */}
      {/*<h1 className="text-3xl font-bold mb-4">Generar test</h1>*/}

      {/* Opciones de carga */}
      <div className="pt-4 grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <DashedCardOption
          icon="/assets/dashboard/ic-upload.svg"
          text="Sube tu documento"
          onClick={() => router.push("/client/upload-file")}
        />
        <DashedCardOption
          icon="/assets/dashboard/ic-paste.svg"
          text="Copia y pega tus apuntes"
          onClick={() => router.push("/client/text-input")}
        />

      </div>

      {/* Historial */}
      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2 flex items-center gap-2">
          <Image src="/assets/dashboard/ic-history.svg" alt="Historial" width={24} height={24} />
          Historial de test
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {tests.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 col-span-full">Aún no tienes tests generados.</p>
          ) : (
            tests.slice(0, 4).map((test) => (
              <TestHistoryCard key={test.id} test={test} />
            ))
          )}
        </div>


      </div>
    </div>
  );
}
