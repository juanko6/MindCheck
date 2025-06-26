import { useRef, useEffect, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQItem({ question, answer, isOpen, onToggle }) {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(contentRef.current.scrollHeight);
    } else {
      setHeight(0);
    }
  }, [isOpen]);

  return (
    <div className="mb-2 overflow-hidden rounded-md shadow-sm">
      <button
        onClick={onToggle}
        className="w-full bg-[#A4B2BD] text-left p-4 flex justify-between items-center"
      >
        <span className="rubik-italic text-2sm font-medium">{question}</span>
        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
      </button>

      {/* Respuesta con el mismo fondo */}
      <div
        style={{
          maxHeight: `${height}px`,
          transition: "max-height 0.3s ease",
        }}
        className="bg-[#A4B2BD] text-2sm text-gray-900 overflow-hidden px-4"
      >
        <div ref={contentRef} className="py-2 rubik-light">
          {answer}
        </div>
      </div>
    </div>
  );
}
