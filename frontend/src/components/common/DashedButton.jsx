// components/common/DashedButton.jsx

export default function DashedButton({
  children,
  bgColor = "bg-yellow-400",
  textColor = "text-black",
  className = "",
  onClick,
  withBorder = true,
  fullWidth = false,
}) {

    const innerButton = (
    <button
      onClick={onClick}
      className={`px-6 py-2 rounded-md font-semibold text-sm shadow-sm ${bgColor} ${textColor} ${className}`}
    >
      {children}
    </button>
  );

  const borderClass = `border-[5px] border-dashed border-gray-400 rounded-xl ${
    fullWidth ? "w-full" : "inline-block"
  }`;

  return withBorder ? (
    <div className={borderClass}>
      {innerButton}
    </div>
  ) : (
    innerButton
  );
}
