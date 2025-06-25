// components/common/FeatureCard.jsx

import DashedButton from "./DashedButton";
import Image from "next/image";

export default function FeatureCard({
  iconSrc,
  title,
  description,
  background = "bg-gray-100",
  textColor = "text-gray-700",
}) {
  return (
    <div className={`rounded-xl shadow-md p-6 w-70 ${background} flex flex-col justify-between`}>
      <div className="mb-4">
        <Image src={iconSrc} alt="icon" width={60} height={60} className="mb-4" />
        <h2 className={`text-[20px] rubik-semibold leading-tight ${textColor}`}>
          {title}
        </h2>
        <p className={`text-sm rubik-light mt-2 ${textColor}`}>{description}</p>
      </div>

      <div className="mt-4">
        <DashedButton
          bgColor="bg-gray-300"
          withBorder={false}
          textColor="text-black"
          className="text-sm px-4 py-2"
        >
          Pruébalo!
        </DashedButton>
      </div>
    </div>
  );
}
