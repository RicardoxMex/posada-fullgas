'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import categories from '@/data/categories.json';
import { supabase } from '@/lib/supabase';

type VoteCount = {
  nominee_id: string;
  count: number;
};

type CategoryResults = {
  category_id: string;
  votes: VoteCount[];
  total: number;
};

// CONFIGURA AQUÍ LA FECHA Y HORA DE PUBLICACIÓN DE RESULTADOS
// Formato: 'YYYY-MM-DDTHH:mm:ss' (hora local)
const RESULTS_RELEASE_DATE = new Date('2025-12-10T17:00:00');

export default function Results() {
  const router = useRouter();
  const [results, setResults] = useState<CategoryResults[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [resultsAvailable, setResultsAvailable] = useState(false);
  const [timeUntilRelease, setTimeUntilRelease] = useState<string>('');
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(-1);
  const [showSummary, setShowSummary] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    checkResultsAvailability();
    const interval = setInterval(checkResultsAvailability, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (resultsAvailable && results.length === 0) {
      fetchResults();
    }
  }, [resultsAvailable]);

  const checkResultsAvailability = () => {
    const now = new Date();
    const available = now >= RESULTS_RELEASE_DATE;
    setResultsAvailable(available);

    if (!available) {
      const diff = RESULTS_RELEASE_DATE.getTime() - now.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      let timeString = '';
      if (days > 0) timeString += `${days}d `;
      if (hours > 0 || days > 0) timeString += `${hours}h `;
      if (minutes > 0 || hours > 0 || days > 0) timeString += `${minutes}m `;
      timeString += `${seconds}s`;

      setTimeUntilRelease(timeString);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: fetchError } = await supabase
        .from('votes')
        .select('category_id, nominee_id');

      if (fetchError) {
        throw fetchError;
      }

      // Agrupar y contar votos por categoría y nominado
      const groupedResults: Record<string, Record<string, number>> = {};
      
      data?.forEach((vote) => {
        if (!groupedResults[vote.category_id]) {
          groupedResults[vote.category_id] = {};
        }
        if (!groupedResults[vote.category_id][vote.nominee_id]) {
          groupedResults[vote.category_id][vote.nominee_id] = 0;
        }
        groupedResults[vote.category_id][vote.nominee_id]++;
      });

      // Convertir a formato de resultados
      const formattedResults: CategoryResults[] = Object.entries(groupedResults).map(
        ([categoryId, votes]) => {
          const voteArray = Object.entries(votes).map(([nomineeId, count]) => ({
            nominee_id: nomineeId,
            count,
          }));

          const total = voteArray.reduce((sum, v) => sum + v.count, 0);

          // Ordenar por cantidad de votos (descendente)
          voteArray.sort((a, b) => b.count - a.count);

          return {
            category_id: categoryId,
            votes: voteArray,
            total,
          };
        }
      );

      setResults(formattedResults);
    } catch (err) {
      console.error('Error al cargar resultados:', err);
      setError('No se pudieron cargar los resultados. Por favor intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryData = (categoryId: string) => {
    return categories.find((c) => c.id === categoryId);
  };

  const getNomineeData = (categoryId: string, nomineeId: string) => {
    const category = getCategoryData(categoryId);
    return category?.nominados.find((n) => n.id === nomineeId);
  };

  const getPercentage = (count: number, total: number) => {
    if (total === 0) return 0;
    return Math.round((count / total) * 100);
  };

  const handleStartResults = () => {
    setStarted(true);
    setCurrentCategoryIndex(0);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setStarted(false);
    setCurrentCategoryIndex(-1);
    setShowSummary(false);
  };

  // Pantalla de espera si los resultados no están disponibles
  if (!resultsAvailable) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Resultados Bloqueados
            </h1>
            <p className="text-xl text-gray-300">
              Los resultados estarán disponibles el:
            </p>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 mt-6">
              <p className="text-3xl font-bold text-red-500 mb-2">
                {RESULTS_RELEASE_DATE.toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-2xl font-semibold text-white">
                {RESULTS_RELEASE_DATE.toLocaleTimeString('es-ES', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <div className="mt-8">
              <p className="text-gray-400 mb-2">Tiempo restante:</p>
              <p className="text-4xl font-bold text-white font-mono">
                {timeUntilRelease}
              </p>
            </div>
          </div>
          <button
            onClick={() => router.push('/votaciones')}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-900 transition-all shadow-lg shadow-red-500/50"
          >
            Ir a Votaciones
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-red-500 mx-auto"></div>
          <p className="text-xl text-gray-300">Cargando resultados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-4xl font-bold text-white mb-4">Error</h1>
          <p className="text-xl text-gray-300">{error}</p>
          <button
            onClick={fetchResults}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-900 transition-all shadow-lg shadow-red-500/50"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  // Pantalla inicial - antes de empezar a ver resultados
  if (!started) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-4xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Resultados Oficiales
            </h1>
            <p className="text-xl text-gray-300">
              Los resultados de las {categories.length} categorías están listos
            </p>
            <p className="text-sm text-gray-400 mt-2">
              Descubre quiénes son los ganadores
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
            {categories.map((category) => (
              <div
                key={category.id}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-yellow-500/50 transition-all"
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
            onClick={handleStartResults}
            className="mt-12 px-12 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white text-xl font-bold rounded-full hover:from-yellow-600 hover:to-yellow-700 transition-all transform hover:scale-105 shadow-lg shadow-yellow-500/50"
          >
            Ver Resultados 🎉
          </button>
        </div>
      </div>
    );
  }

  // Resumen final - mostrar todos los resultados
  if (showSummary) {
    return (
      <div className="min-h-screen p-4 py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <div className="text-6xl mb-4">🎊</div>
            <h1 className="text-5xl font-bold text-white mb-4">
              Resumen Completo
            </h1>
            <p className="text-xl text-gray-300">
              Todos los ganadores de las votaciones
            </p>
          </div>

          <div className="space-y-12">
            {categories.map((category) => {
              const categoryResults = results.find((r) => r.category_id === category.id);
              const totalVotes = categoryResults?.total || 0;

              return (
                <div
                  key={category.id}
                  className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10"
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-24 h-24 rounded-lg overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h2 className="text-3xl font-bold text-white mb-2">
                        {category.name}
                      </h2>
                      <p className="text-gray-400">
                        Total de votos: <span className="text-white font-semibold">{totalVotes}</span>
                      </p>
                    </div>
                  </div>

                  {totalVotes === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-400 text-lg">
                        No hay votos en esta categoría
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {categoryResults?.votes.map((vote, index) => {
                        const nominee = getNomineeData(category.id, vote.nominee_id);
                        const percentage = getPercentage(vote.count, totalVotes);
                        const isWinner = index === 0;

                        if (!nominee) return null;

                        return (
                          <div
                            key={vote.nominee_id}
                            className={`relative bg-white/5 rounded-xl p-6 border-2 transition-all ${
                              isWinner
                                ? 'border-yellow-500 shadow-lg shadow-yellow-500/30'
                                : 'border-white/10'
                            }`}
                          >
                            {isWinner && (
                              <div className="absolute -top-3 -right-3 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                                <span className="text-2xl">👑</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-6 mb-4">
                              <div className="flex-shrink-0">
                                <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-white/20">
                                  <img
                                    src={nominee.image}
                                    alt={nominee.name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              </div>
                              
                              <div className="flex-grow">
                                <div className="flex items-center justify-between mb-2">
                                  <h3 className="text-xl font-semibold text-white">
                                    {nominee.name}
                                  </h3>
                                  <div className="text-right">
                                    <p className="text-2xl font-bold text-white">
                                      {percentage}%
                                    </p>
                                    <p className="text-sm text-gray-400">
                                      {vote.count} {vote.count === 1 ? 'voto' : 'votos'}
                                    </p>
                                  </div>
                                </div>
                                
                                <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full transition-all duration-500 ${
                                      isWinner
                                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                        : 'bg-gradient-to-r from-red-600 to-red-800'
                                    }`}
                                    style={{ width: `${percentage}%` }}
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20"
            >
              Ver de Nuevo
            </button>
            <button
              onClick={() => router.push('/votaciones')}
              className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-900 transition-all shadow-lg shadow-red-500/50"
            >
              Ir a Votaciones
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Mostrar resultados categoría por categoría
  const currentCategory = categories[currentCategoryIndex];
  const categoryResults = results.find((r) => r.category_id === currentCategory.id);
  const totalVotes = categoryResults?.total || 0;

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="max-w-4xl w-full space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm text-gray-400 mb-2">
            <span>Categoría {currentCategoryIndex + 1} de {categories.length}</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2 mb-4">
            <div
              className="bg-gradient-to-r from-yellow-500 to-yellow-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((currentCategoryIndex + 1) / categories.length) * 100}%` }}
            />
          </div>
          <h1 className="text-4xl font-bold text-white">
            {currentCategory.name}
          </h1>
          <p className="text-gray-300">
            Total de votos: <span className="text-white font-semibold">{totalVotes}</span>
          </p>
        </div>

        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
          {totalVotes === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No hay votos en esta categoría
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {categoryResults?.votes.map((vote, index) => {
                const nominee = getNomineeData(currentCategory.id, vote.nominee_id);
                const percentage = getPercentage(vote.count, totalVotes);
                const isWinner = index === 0;

                if (!nominee) return null;

                return (
                  <div
                    key={vote.nominee_id}
                    className={`relative bg-white/5 rounded-xl p-6 border-2 transition-all animate-fade-in ${
                      isWinner
                        ? 'border-yellow-500 shadow-lg shadow-yellow-500/30'
                        : 'border-white/10'
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {isWinner && (
                      <div className="absolute -top-3 -right-3 w-14 h-14 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                        <span className="text-3xl">👑</span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-6 mb-4">
                      <div className="flex-shrink-0">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white/20">
                          <img
                            src={nominee.image}
                            alt={nominee.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-2xl font-semibold text-white">
                            {nominee.name}
                          </h3>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-white">
                              {percentage}%
                            </p>
                            <p className="text-sm text-gray-400">
                              {vote.count} {vote.count === 1 ? 'voto' : 'votos'}
                            </p>
                          </div>
                        </div>
                        
                        <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${
                              isWinner
                                ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                                : 'bg-gradient-to-r from-red-600 to-red-800'
                            }`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
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
            className="px-8 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-semibold rounded-full hover:from-yellow-600 hover:to-yellow-700 transition-all shadow-lg shadow-yellow-500/50"
          >
            {currentCategoryIndex === categories.length - 1 ? 'Ver Resumen Completo 🎊' : 'Siguiente →'}
          </button>
        </div>
      </div>
    </div>
  );
}
