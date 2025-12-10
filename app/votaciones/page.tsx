'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import categories from '@/data/categories.json';
import { supabase } from '@/lib/supabase';

type Votes = Record<string, string>;

const USER_ID_COOKIE = 'user_voting_id';

export default function Votes() {
  const router = useRouter();
  const [started, setStarted] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [votes, setVotes] = useState<Votes>({});
  const [showSummary, setShowSummary] = useState(false);
  const [canVote, setCanVote] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingVote, setIsCheckingVote] = useState(true);

  const currentCategory = categories[currentCategoryIndex];
  const totalCategories = categories.length;

  useEffect(() => {
    checkVoteEligibility();
  }, []);

  const generateUserId = () => {
    return `user-${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
  };

  const getUserId = () => {
    let userId = Cookies.get(USER_ID_COOKIE);
    if (!userId) {
      userId = generateUserId();
      Cookies.set(USER_ID_COOKIE, userId, { expires: 365 * 10 }); // 10 años
    }
    return userId;
  };

  const checkVoteEligibility = async () => {
    setIsCheckingVote(true);
    try {
      const userId = getUserId();
      
      // Verificar si el usuario ya votó en la base de datos
      const { data, error } = await supabase
        .from('votes')
        .select('session_id')
        .eq('session_id', userId)
        .limit(1);

      if (error) {
        console.error('Error al verificar votos:', error);
        setCanVote(true);
        return;
      }

      if (data && data.length > 0) {
        setCanVote(false);
      } else {
        setCanVote(true);
      }
    } catch (error) {
      console.error('Error:', error);
      setCanVote(true);
    } finally {
      setIsCheckingVote(false);
    }
  };

  const handleVote = (nominadoId: string) => {
    setVotes({ ...votes, [currentCategory.id]: nominadoId });
  };

  const handleNext = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (currentCategoryIndex < totalCategories - 1) {
      setCurrentCategoryIndex(currentCategoryIndex + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex(currentCategoryIndex - 1);
    }
  };

  const handleRestart = () => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    setStarted(false);
    setCurrentCategoryIndex(0);
    setVotes({});
    setShowSummary(false);
  };

  const handleSubmitVotes = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const userId = getUserId();
      
      // Verificar una vez más antes de enviar
      const { data: existingVotes } = await supabase
        .from('votes')
        .select('session_id')
        .eq('session_id', userId)
        .limit(1);

      if (existingVotes && existingVotes.length > 0) {
        alert('Ya has votado anteriormente. Solo se permite votar una vez.');
        setCanVote(false);
        setIsSubmitting(false);
        handleRestart();
        return;
      }
      
      const votesToSubmit = Object.entries(votes).map(([categoryId, nomineeId]) => ({
        session_id: userId,
        category_id: categoryId,
        nominee_id: nomineeId,
      }));

      const { error } = await supabase
        .from('votes')
        .insert(votesToSubmit);

      if (error) {
        console.error('Error al guardar votos:', error);
        alert('Hubo un error al guardar tus votos. Por favor intenta de nuevo.');
        setIsSubmitting(false);
        return;
      }
      
      setCanVote(false);
      
      alert('¡Votos enviados correctamente! Gracias por tu participación.');
      handleRestart();
    } catch (error) {
      console.error('Error:', error);
      alert('Hubo un error inesperado. Por favor intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCheckingVote) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl mb-4">⏳</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Verificando elegibilidad...
            </h1>
            <p className="text-xl text-gray-300">
              Por favor espera un momento
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!canVote) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-2xl w-full text-center space-y-8">
          <div className="space-y-4">
            <div className="text-6xl mb-4">✅</div>
            <h1 className="text-4xl font-bold text-white mb-4">
              Ya has votado
            </h1>
            <p className="text-xl text-gray-300">
              Solo se permite votar una vez
            </p>
            <p className="text-gray-400 mt-4">
              Gracias por tu participación
            </p>
          </div>
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 md:px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 text-sm md:text-base"
            >
              Página Principal
            </button>
            <button
              onClick={() => router.push('/resultados')}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold rounded-full hover:from-blue-700 hover:to-blue-900 transition-all shadow-lg shadow-blue-500/50 text-sm md:text-base"
            >
              Ver Resultados
            </button>
          </div>
        </div>
      </div>
    );
  }

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
            <p className="text-sm text-yellow-400 mt-2">
              ⚠️ Solo podrás votar una vez
            </p>
            
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 max-w-2xl mx-auto">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
              <div className="text-5xl font-bold text-red-500 mb-2">
                {categories.length}
              </div>
              <p className="text-lg text-gray-300">
                Categorías
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10 text-center">
              <div className="text-5xl font-bold text-red-500 mb-2">
                {categories.reduce((total, category) => total + category.nominados.length, 0)}
              </div>
              <p className="text-lg text-gray-300">
                Nominados
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 justify-center mt-12">
            <button
              onClick={() => router.push('/')}
              className="px-6 md:px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 text-sm md:text-base"
            >
              Página Principal
            </button>
            <button
              onClick={() => router.push('/resultados')}
              className="px-6 md:px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 text-sm md:text-base"
            >
              Ver Resultados
            </button>
            <button
              onClick={() => {
                setStarted(true);
                window.scrollTo({ top: 0, behavior: 'instant' });
              }}
              className="px-8 md:px-12 py-3 md:py-4 bg-gradient-to-r from-red-600 to-red-800 text-white text-lg md:text-xl font-bold rounded-full hover:from-red-700 hover:to-red-900 transition-all transform hover:scale-105 shadow-lg shadow-red-500/50"
            >
              Iniciar Votación
            </button>
          </div>
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
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">{category.description}</p>
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

          <div className="flex flex-wrap gap-3 md:gap-4 justify-center mt-8">
            <button
              onClick={() => router.push('/')}
              className="px-6 md:px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 text-sm md:text-base"
            >
              Página Principal
            </button>
            <button
              onClick={handleRestart}
              className="px-6 md:px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all border border-white/20 text-sm md:text-base"
            >
              Volver al Inicio
            </button>
            <button
              onClick={handleSubmitVotes}
              disabled={isSubmitting || Object.keys(votes).length === 0}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-green-600 to-green-800 text-white font-semibold rounded-full hover:from-green-700 hover:to-green-900 transition-all shadow-lg shadow-green-500/50 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
            >
              {isSubmitting ? 'Enviando...' : 'Confirmar Votos'}
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
          <p className="text-lg text-gray-300 mb-2">{currentCategory.description}</p>
          <p className="text-sm text-gray-400">Selecciona tu nominado favorito</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {currentCategory.nominados.map((nominado) => {
            const isSelected = votes[currentCategory.id] === nominado.id;
            return (
              <button
                key={nominado.id}
                onClick={() => handleVote(nominado.id)}
                className={`relative bg-white/5 backdrop-blur-sm rounded-xl p-6 border-2 transition-all transform hover:scale-105 ${isSelected
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

        <div className="space-y-4 mt-8">
          <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-between">
            <button
              onClick={handlePrevious}
              disabled={currentCategoryIndex === 0}
              className="px-6 md:px-8 py-3 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed border border-white/20 text-sm md:text-base"
            >
              ← Anterior
            </button>
            <button
              onClick={handleNext}
              disabled={!votes[currentCategory.id]}
              className="px-6 md:px-8 py-3 bg-gradient-to-r from-red-600 to-red-800 text-white font-semibold rounded-full hover:from-red-700 hover:to-red-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-red-500/50 text-sm md:text-base"
            >
              {currentCategoryIndex === totalCategories - 1 ? 'Ver Resumen' : 'Siguiente →'}
            </button>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-4 md:px-6 py-2 bg-white/5 text-gray-300 text-xs md:text-sm font-medium rounded-full hover:bg-white/10 transition-all border border-white/10"
            >
              ← Volver a Página Principal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
