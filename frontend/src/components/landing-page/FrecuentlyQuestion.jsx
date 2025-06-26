import { useState } from "react";
import FAQItem from "../common/FAQItem";

export default function FrecuentlyQuestion() {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex((prev) => (prev === index ? null : index));
  };

  const faqs = [
    {
      question: "¿MindCheck es realmente gratis?",
      answer:
        "Sí. Registrarte no cuesta nada y recibes 300 tokens de prueba. Luego puedes ganar más participando o comprarlos.",
    },
    {
      question: "¿Qué formatos acepta?",
      answer:
        "Actualmente aceptamos documentos en formato .pdf. Pronto ampliaremos soporte a otros formatos.",
    },
    {
      question: "¿Mis documentos están seguros?",
      answer:
        "Se guardan cifrados y solo tú tienes acceso. Puedes borrarlos en cualquier momento.",
    },
    {
      question: "¿Funciona en el móvil?",
      answer:
        "Sí, MindCheck está optimizado para funcionar en cualquier dispositivo, incluyendo móviles y tabletas.",
    },
    {
      question: "¿Puedo compartir mis tests?",
      answer:
        "Muy pronto podrás generar links o códigos para compartir tus tests con amigos o estudiantes.",
    },
    {
      question: "¿La IA comete errores?",
      answer:
        "Nadie es perfecto, pero nuestro motor revisa coherencia y dificultad antes de mostrarte cada pregunta.",
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-16 px-4">
      <div className="max-w-screen-xl mx-auto pl-5 pr-5 md:pl-30 md:pr-30">
        <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 mb-10">
          <h3 className="text-left text-3xl rubik-light-italic mb-2 text-gray-800 mr-20">
            <span className="rubik-semibold">Preguntas</span>
            <span className="rubik-light-italic"> Frecuentes.</span>
          </h3>
          <p className="text-left rubik-light text-[17px] text-gray-600 mt-2">
            <span className="rubik-semibold">Tú preguntas, nosotros aclaramos</span> <br />
            Así es como empieza una buena experiencia.
          </p>
        </div>

        <div className="md:w-2/3 ml-auto">
          {faqs.map((faq, index) => (
            <FAQItem
              key={index}
              question={faq.question}
              answer={faq.answer}
              isOpen={activeIndex === index}
              onToggle={() => toggleQuestion(index)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
