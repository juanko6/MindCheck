import Navbar from '@/components/common/Navbar';


export default function TestSkeletonLoader({ darkMode }) {
  return (
    <div className={`min-h-screen flex flex-col items-center justify-center p-6 transition-colors duration-500 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <Navbar />

      <div className="w-120 h-6 rounded shimmer mb-6"></div>

      <div className={`p-6 rounded-lg shadow-md w-full max-w-xl transition-colors duration-500 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
        <div className="w-3/4 h-6 rounded mb-6 shimmer"></div>
        <div className="flex flex-col items-center gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full h-12 rounded-xl shimmer"></div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-4 mt-6 w-full max-w-xl">
        <div className="h-10 rounded opacity-60 shimmer"></div>
        <div className="h-10 rounded opacity-60 shimmer"></div>
      </div>
    </div>
  );
}
