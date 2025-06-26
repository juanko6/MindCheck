import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/landing-page/Navbar";
import Hero from "@/components/landing-page/Hero";
import ImageSlider from "@/components/landing-page/ImageSlider";
import FeatureSlider from "@/components/landing-page/FeatureSlider";
import CopyWow from "@/components/landing-page/CopyWow";
import FeatureComparison from "@/components/landing-page/FeatureComparison";
import PromoBanner from "@/components/common/PromoBanner";
import StepByStep from "@/components/landing-page/StepByStep";
import FrecuentlyQuestion from "@/components/landing-page/FrecuentlyQuestion";
import ActionStripe from "@/components/landing-page/ActionStripe";

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
    <div className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero onStart={handleStart}>
        <ImageSlider />
      </Hero>
      <FeatureSlider />
      <CopyWow />
      <FeatureComparison />
      <PromoBanner tokens = "300" />
      <StepByStep />
      <FrecuentlyQuestion />
      <ActionStripe />

    </div>
  );
}
