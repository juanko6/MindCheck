import { Check, X } from 'lucide-react';

export default function FeatureComparison() {
  const features = [
    'IA personalizada',
    'Selección de páginas',
    'Gamificación',
    'Explicación de fallos',
    'Listo en < 60 s',
  ];

  const columns = [
    {
      title: 'MindCheck',
      values: [true, true, true, true, true],
    },
    {
      title: 'Tests genéricos online',
      values: [false, false, false, false, false],
    },
    {
      title: 'Resúmenes PDF',
      values: [false, true, false, false, false],
      notes: ['✔ Selección limitada'],
    },
    {
      title: 'Flashcards manuales',
      values: [false, false, false, false, false],
      notes: ['✖ Tiempo manual'],
    },
  ];

  return (
    <section className="w-full bg-gray-50 py-16 px-4">
        <div className="max-w-screen-xl mx-auto pl-5 pr-5 md:pl-30 md:pr-30">
            <div className="flex flex-col md:flex-row md:items-baseline md:gap-4 mb-10">
            <h3 className="text-left text-3xl rubik-light-italic mb-2 text-gray-800 mr-20">
                <span className="rubik-light-italic">¿Qué nos hace</span>{' '}
                <span className="rubik-semibold">diferentes?</span>
            </h3>
            <p className="text-left rubik-light text-[17px] text-gray-600 mt-2">
                Porque no es solo un test. Es una <br />experiencia de aprendizaje personalizada.
            </p>
            </div>

        {/* Tabla en escritorio */}
        <div className="hidden md:block overflow-x-auto">
            <table className="w-full border-separate border-spacing-0 rounded-xl overflow-hidden">
            <thead>
                <tr className="bg-yellow-400 text-white text-left">
                <th className="p-4 text-sm font-bold text-gray-900 bg-yellow-400 rubik-semibold-italic rounded-tl-2xl"></th>
                {columns.map((col, i) => (
                    <th
                    key={i}
                    className={`p-4 text-sm font-bold text-gray-900 bg-yellow-400 rubik-semibold-italic ${
                        i === columns.length - 1 ? 'rounded-tr-2xl' : ''
                    }`}
                    >
                    {col.title.replace(/^[^\w]+/, '')}
                    </th>
                ))}
                </tr>
            </thead>
            <tbody className="bg-white text-center text-sm">
                {features.map((feature, rowIndex) => (
                <tr key={rowIndex} className="border-t border-b border-slate-200 rubik-semibold-italic">
                    <td className="p-4 font-medium text-left">{feature}</td>
                    {columns.map((col, colIndex) => (
                    <td key={colIndex} className="p-4">
                        {col.values[rowIndex] ? (
                        <Check className="text-green-600 w-5 h-5 mx-auto" />
                        ) : (
                        <X className="text-red-500 w-5 h-5 mx-auto" />
                        )}
                    </td>
                    ))}
                </tr>
                ))}
            </tbody>
            </table>
        </div>

        {/* Cards en móvil */}
        <div className="flex flex-col gap-6 md:hidden">
            {columns.map((col, colIndex) => (
            <div key={colIndex} className="bg-white rounded-2xl shadow-sm overflow-hidden">
                <div className="bg-yellow-400 px-4 py-3 font-semibold text-sm text-gray-900 rubik-semibold-italic">
                {col.title}
                </div>
                <div className="divide-y divide-gray-200 text-sm">
                {features.map((feature, i) => (
                    <div key={i} className="flex items-center justify-between px-4 py-3 rubik-italic">
                    <span>{feature}</span>
                    {col.values[i] ? (
                        <Check className="text-green-600 w-5 h-5" />
                    ) : (
                        <X className="text-red-500 w-5 h-5" />
                    )}
                    </div>
                ))}
                {col.notes?.map((note, idx) => (
                    <div key={`note-${idx}`} className="px-4 py-3 italic text-gray-600 text-xs">
                    {note}
                    </div>
                ))}
                </div>
            </div>
            ))}
        </div>
      </div>
    </section>
  );
}
