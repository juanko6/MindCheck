// components/common/StripeWow.jsx

export default function StripeWow({
  color = '#ffffff',
  bgImage = '',
  bgSize = 'contain', // Puedes ajustar esto a 'cover' si prefieres
  bgOpacity = 0.05,
  children,
}) {
  return (
    <section
      className="w-full flex items-center justify-center py-24 px-4 md:px-8 relative overflow-hidden"
      style={{ 
        backgroundColor: color 
    
    }}
    >
      {bgImage && (
        <img
        src={bgImage}
        alt="background"
        className="absolute pointer-events-none select-none"
        style={{
            opacity: bgOpacity,
            width: '700px',   // Puedes ajustar este valor
            height: 'auto',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            position: 'absolute',
            zIndex: 0,
        }}
        />
      )}
      <div className="relative z-10 w-full max-w-screen-md px-4 text-center">{children}</div>
    </section>
  );
}
