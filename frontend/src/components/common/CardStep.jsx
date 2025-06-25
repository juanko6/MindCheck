// components/landing-page/CardStep.jsx

export default function CardStep({
    bgColor = "bg-[#0F1B2B]",
    bgImage = null,
    title,
    titleClasses = "",
    icon = null,
    iconSize = "w-[64px] h-[64px]",
    description = "",
}) {
    return (
            <div
            className={`relative rounded-2xl p-6 text-white w-full text-center overflow-hidden flex flex-col items-center justify-start ${bgColor}`}
            >
            {/* Fondo con imagen con zoom y transparencia */}
            {bgImage && (
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: `url(${bgImage})`,
                    backgroundSize: "150%", // Zoom al fondo
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                    opacity: 0.1, // Transparencia
                }}
            />
            )}

                {/* Contenido frontal */}
            <div className="relative z-10">
                {/* Título */}
                <h3 className={`text-[24px] leading-snug mb-4 ${titleClasses}`}>
                    {title}
                </h3>

                {/* Ícono */}
                {icon && (
                    <div className="mb-4 flex justify-center">
                        <img
                        src={icon}
                        alt="icono ilustrativo"
                        className={`${iconSize} object-contain`}
                        />
                    </div>
                )}

                {/* Descripción */}
                <p className="text-[14px] leading-tight rubik-light">{description}</p>
            </div>
        </div>
    );
}