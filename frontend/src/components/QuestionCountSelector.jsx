import React from 'react';

export default function QuestionCountSelector({ value, onChange }) {
  return (
    <div className="mb-8 w-full max-w-2xl">
      <h3 className="text-xl font-bold mb-4 text-center">¿Cuántas preguntas quieres?</h3>
      <div className="flex flex-col items-center">
        <input
          type="range"
          min="1"
          max="30"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-3/4 h-2 bg-blue-200 rounded-full appearance-none cursor-pointer"
        />
        <p className="mt-2 text-lg font-semibold">{value} Preguntas 📚</p>
      </div>
    </div>
  );
}
