import { Calendar, MapPin, Sparkles } from "lucide-react"

export const Hero: React.FC = () => (
    <section className="relative w-full py-16 px-4 ">
        <div className="absolute inset-0 bg-gradient-to-b from-red-500/10 via-green-500/5 to-transparent rounded-3xl blur-3xl" />

        <div className="relative space-y-20 text-center ">
            <div className="space-y-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500/20 to-green-500/20 rounded-full border border-red-400/30 backdrop-blur-sm">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    <span className="text-sm font-medium text-white">Evento Especial</span>
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                </div>

                <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold bg-gradient-to-r from-orange-300 via-orange-400 to-red-400 bg-clip-text text-transparent leading-tight animate-gradient">
                    🎄 Posada Sistemas 2025 🎄
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light">
                    ¡Celebremos juntos esta temporada navideña!
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-6 justify-center items-stretch max-w-4xl mx-auto">
                <div className="flex-1 flex gap-3 md:gap-4 items-center px-4 md:px-6 py-4 md:py-5 bg-gradient-to-br from-red-500/20 to-red-600/20 rounded-xl border border-red-400/30 backdrop-blur-sm shadow-lg shadow-red-500/10 hover:shadow-red-500/20 transition-all duration-300 hover:scale-[1.02]">
                    <div className="p-2 md:p-2.5 bg-red-500/20 rounded-lg">
                        <Calendar className="w-5 h-5 md:w-7 md:h-7 text-red-200" />
                    </div>
                    <div className="text-left">
                        <span className="block text-xs text-red-300/80 font-medium uppercase tracking-wider">Fecha</span>
                        <p className="text-lg md:text-2xl font-bold text-white mt-0.5">10 de Diciembre 2025</p>
                    </div>
                </div>
                <a 
                    href="https://maps.app.goo.gl/cezL2Nz5FovDzjqS8" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 flex gap-3 md:gap-4 items-center px-4 md:px-6 py-4 md:py-5 bg-gradient-to-br from-green-500/20 to-green-600/20 rounded-xl border border-green-400/30 backdrop-blur-sm shadow-lg shadow-green-500/10 hover:shadow-green-500/20 transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                >
                    <div className="p-2 md:p-2.5 bg-green-500/20 rounded-lg">
                        <MapPin className="w-5 h-5 md:w-7 md:h-7 text-green-200" />
                    </div>
                    <div className="text-left">
                        <span className="block text-xs text-green-300/80 font-medium uppercase tracking-wider">Ubicación</span>
                        <p className="text-lg md:text-2xl font-bold text-white mt-0.5">Villa Catarina</p>
                    </div>
                </a>
            </div>
        </div>
    </section>
)