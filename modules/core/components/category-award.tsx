import categoriesData from '@/data/categories.json';

interface Nominee {
  id: string;
  name: string;
  image?: string;
}

interface Category {
  id: string;
  name: string;
  nominados: Nominee[];
  image?: string;
}

const categories = categoriesData as Category[];

const CategoryCard = ({ category, index }: { category: Category; index: number }) => (
  <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-purple-900/40 to-pink-900/40 hover:border-red-400/50 transition-all duration-300">
    {/* Imagen de fondo */}
    {category.image && (
      <div className="absolute inset-0 opacity-30 group-hover:opacity-40 transition-opacity">
        <img
          src={category.image}
          alt={category.name}
          className="w-full h-full object-cover"
        />
      </div>
    )}

    {/* Contenido */}
    <div className="relative p-8">
      {/* Badge de categoría */}
      <div className="mb-4">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
          CATEGORÍA {index + 1}
        </span>
      </div>

      {/* Título */}
      <h3 className="text-3xl font-bold text-white mb-6">
        {category.name}
      </h3>

      {/* Contador de nominados */}
      <div className="flex items-center justify-between">
        <div className="flex items-baseline gap-2">
          <span className="text-5xl font-bold text-white">
            {category.nominados.length}
          </span>
          <span className="text-gray-300">Nominados</span>
        </div>

        {/* Botón Votar */}
        <button className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white font-bold rounded-full transition-all duration-300 flex items-center gap-2 group-hover:scale-105">
          Votar
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
);

export const CategoryAward = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/20 rounded-full border border-red-400/30 backdrop-blur-sm mb-6">
          <span className="text-sm font-medium text-red-300">PREMIOS 2024</span>
        </div>
        <h2 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-white to-orange-300 bg-clip-text text-transparent">
          Categorías de Premiación
        </h2>
        <p className="text-gray-300 text-lg">
          Reconoce el talento de tus compañeros votando en cada categoría
        </p>
      </div>

      {/* Grid de categorías alternando 2 y 3 columnas */}
      <div className="space-y-6">
        {/* Fila 1: 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.slice(0, 2).map((category, index) => (
            <CategoryCard key={category.id} category={category} index={index} />
          ))}
        </div>

        {/* Fila 2: 3 columnas */}
        {categories.length > 2 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(2, 5).map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index + 2} />
            ))}
          </div>
        )}

        {/* Fila 3: 2 columnas */}
        {categories.length > 5 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {categories.slice(5, 7).map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index + 5} />
            ))}
          </div>
        )}

        {/* Fila 4: 3 columnas (si hay más) */}
        {categories.length > 7 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {categories.slice(7, 10).map((category, index) => (
              <CategoryCard key={category.id} category={category} index={index + 7} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
