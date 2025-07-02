// components/common/IconDashedButton.jsx

import Image from "next/image";
export default function IconDashedButton({
  onClick,
  imagePath,
  title,
  description,
  className = "",
  fullWidth = true,
}) {
  const containerClass = `border-[5px] border-dashed border-gray-400 rounded-xl p-2 ${
    fullWidth ? "w-full" : "inline-block"
  } cursor-pointer hover:bg-gray-500 transition ${className}`;

  return (
    <div onClick={onClick} className={containerClass}>
      <div className="flex items-center gap-4">
        <div className="bg-white p-2 rounded-md flex items-center justify-center">
          <Image src={imagePath} alt="Ícono" width={60} height={60} />
        </div>
        <div className="text-left">
          <p className="text-2lg rubik-semibold">{title}</p>
          <p className="text-lg rubik-regular">{description}</p>
        </div>
      </div>
    </div>
  );
}
