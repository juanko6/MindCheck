export default function CircularLoader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="relative w-0 h-0">
        {/* Órbita grande */}
        <div className="absolute w-4 h-4 bg-blue-400 rounded-full shadow-md animate-orbitSlow" />
        {/* Órbita media */}
        <div className="absolute w-3.5 h-3.5 bg-purple-500 rounded-full shadow-md animate-orbitMedium delay-[150ms]" />
        {/* Órbita rápida */}
        <div className="absolute w-3 h-3 bg-green-400 rounded-full shadow-md animate-orbitFast delay-[300ms]" />
        {/* Órbita adicional */}
        <div className="absolute w-3 h-3 bg-orange-400 rounded-full shadow-md animate-orbitMedium delay-[600ms]" />
      </div>
    </div>
  );
}
