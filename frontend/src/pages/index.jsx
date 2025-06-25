import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/landing-page/Navbar";
import Hero from "@/components/landing-page/Hero";
import ImageSlider from "@/components/landing-page/ImageSlider";

export default function PublicIndex() {
  const router = useRouter();
  const { token } = useAuth();

  const handleStart = () => {
    if (token) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900">
      <Navbar />
      <Hero onStart={handleStart} />
      <ImageSlider />
    </div>
  );
}
