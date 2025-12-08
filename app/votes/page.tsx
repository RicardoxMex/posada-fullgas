
'use client';

import { useState } from 'react';
import categories from '@/data/categories.json';

type Votes = Record<string, string>;

export default function Votes() {
  const [started, setStarted] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [votes, setVotes] = useState<Votes>({});
  const [showSummary, setShowSummary] = useState(false);

  const currentCategory = categories[currentCategoryIndex];
  const totalCategories = categories.length;

  const handleVote = (nominadoId: string) => {
    setVotes({ ...votes, [currentCategory.id]: nominadoId });
  };

  const handleNext = () => {
    if (currentCategoryIndex < totalCategories - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const handleRestart = () => {
    setStarted(false);
    setCurrentCategoryIndex(0);
    setVotes({});
    setShowSummary(false);
  };

  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold text-white mb-4">
              Sistema de Votaciones
            </h1>
            <p className="text-xl text-gray-300">
              Participa en la votación de las {totalCategories} categorías
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-red-500/50 transition-all"
              >
                <div className="aspect-video rounded-lg overflow-hidden mb-4">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {category.nominados.length} nominados
                </p>
              </div>
            ))}
          </div>

          <button
            onClick={() => setStarted(true)}
            className="mt-12 px-12 py-4 bg-gradient-to-r from-red-600 to-red-800 text-white text-xl font-bold rounded-full hover:from-red-700 hover:to-red-900 transition-all transform hover:scale-105 shadow-lg shadow-red-500/50"
          >
            Iniciar Votación
          </button>
        </div>
      </div>
    );
  }

  if (showSummary) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-4xl w-full space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-5xl font-bold text-white mb-4">
              Resumen de Votaciones
            </h1>
            <p className="text-xl text-gray-300">
              Has completado todas las categorías
            </p>
          </div>

          <div className="space-y-6 mt-12">
            {categories.map((category) => {
              const votedNominado = category.nominados.find(
                (n) => n.id === votes[category.id]
              );
              return (
                <div
                  key={category.id}
                  className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10"
                >
                  <h3 className="text-xl font-semibold text-white mb-4">
                    {category.name}
                  </h3>
                  {votedNominado ? (
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <img
                          src={votedNominado.image}
                          alt={votedNominado.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-lg text-white font-medium">
                          {votedNominado.name}
                        </p>
                        <p className="text-sm text-green-400">✓ Voto registrado</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-gray-400 italic">No votaste en esta categoría</p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
            >
              Volver al Inicio
            </button>
            <button
              onClick={() => alert('Votos enviados correctamente')}
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold rounded-full hover:from-green-700 hover:to-green-900 transition-all shadow-lg shadow-green-500/50"
            >
              Confirmar Votos
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-2">
            <span>Categoría {currentCategoryIndex + 1} de {totalCategories}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-red-600 to-red-800 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCategoryIndex + 1) / totalCategories) * 100}%` }}
            />
          </div>
          <h1 className="text-4xl font-bold text-white">
            {currentCategory.name}
          </h1>
          <p className="text-gray-300">Selecciona tu nominado favorito</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {currentCategory.nominados.map((nominado) => {
            const isSelected = votes[currentCategory.id] === nominado.id;
            return (
              <button
                key={nominado.id}
                onClick={() => handleVote(nominado.id)}
                className={`relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border-2 transition-all transform hover:scale-105 ${
                  isSelected
                    ? 'border-red-500 shadow-lg shadow-red-500/50'
                    : 'border-white/10 hover:border-red-500/50'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-4 right-4 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xl">✓</span>
                  </div>
                )}
                <div className="aspect-square rounded-lg overflow-hidden mb-4">
                  <img
                    src={nominado.image}
                    alt={nominado.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-white text-center">
                  {nominado.name}
                </h3>
              </button>
            );
          })}
        </div>

        <div className="flex gap-4 justify-between mt-8">
          <button
            onClick={handlePrevious}
            disabled={currentCategoryIndex === 0}
            className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/20"
          >
            ← Anterior
          </button>
          <button
            onClick={handleNext}
            disabled={!votes[currentCategory.id]}
            className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/50"
          >
            {currentCategoryIndex === totalCategories - 1 ? 'Ver Resumen' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
