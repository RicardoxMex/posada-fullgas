import { Award } from "lucide-react";

export const Awards = () => {
    return (
        <section className="max-w-4xl mx-auto ">
            {/* Card principal */}
            <div className="rounded-3xl border-2 border-yellow-600/50 bg-gradient-to-br from-[#2d1b3d] to-[#1a0b2e] p-12 mb-8 relative overflow-hidden">
                {/* Efecto de brillo dorado sutil tipo ticket premium */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/5 to-transparent animate-shimmer"></div>
                
                {/* Líneas decorativas doradas */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
                
                {/* Detalles de esquinas tipo ticket */}
                <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-yellow-400/40"></div>
                <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-yellow-400/40"></div>
                <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-yellow-400/40"></div>
                <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-yellow-400/40"></div>
                
                {/* Contenido con z-index para estar encima de la animación */}
                <div className="relative z-10">
                    {/* Icono de trofeo */}
                    <div className="flex justify-center mb-6">
                        <Award className="text-yellow-400 animate-pulse" size={50} />
                    </div>

                {/* Título principal */}
                    <h2 className="text-4xl md:text-5xl font-bold text-center mb-4 text-yellow-400 animate-pulse">
                    ¡VOTA POR LOS AWARDS FULLGAS SISTEMAS 2025!
                </h2>

                {/* Subtítulo */}
                <p className="text-center text-gray-300 text-lg">
                    Participa y elige a los mejores del año en nuestras premiaciones
                </p>
            </div>
            </div>

            {/* Botones */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
                {/* Botón Votar Ahora */}
                <button className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-6 px-8 rounded-full text-xl transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-3">
                    🗳️ VOTAR AHORA
                </button>

                {/* Botón Ver Nominados */}
                <button className="w-full bg-transparent border-2 border-white hover:bg-white/10 text-white font-bold py-6 px-8 rounded-full text-xl transition-all duration-300">
                    VER NOMINADOS
                </button>
            </div>
        </section>
    );
};