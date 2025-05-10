import React from 'react';

export default function DifficultySelector({ value, onChange }) {
  return (
    <div className="mb-8 w-full max-w-2xl">
      <h3 className="text-xl font-bold mb-4 text-center">¿Nivel de dificultad?</h3>
      <div className="flex justify-center">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="px-4 py-2 text-lg font-semibold border-2 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-white border-gray-400 dark:border-gray-600 hover:border-green-400 dark:hover:border-green-400 focus:ring-2 focus:ring-green-400"
        >
          <option value="Modo Relax">Modo Relax 🧘‍♂️</option>
          <option value="Modo Café">Modo Café ☕</option>
          <option value="Modo Insano">Modo Insano 👹</option>
          <option value="Modo Dios">Modo Dios 📚👑</option>
        </select>
      </div>
    </div>
  );
}
