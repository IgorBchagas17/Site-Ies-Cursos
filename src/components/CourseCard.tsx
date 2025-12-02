// src/components/CourseCard.tsx
import { useState } from 'react';
import { Clock, Award, ArrowRight, MapPin, Monitor } from 'lucide-react';
// IMPORTANTE: Removendo o motion do framer-motion para otimização
import { Course } from '../types';

interface CourseCardProps {
  course: Course;
  onLearnMore: (course: Course) => void;
}

export function CourseCard({ course, onLearnMore }: CourseCardProps) {
  const isPresencial = course.type === 'presencial';
  const [, setHover] = useState(false);

  // Removendo framer-motion e usando transições leves do Tailwind
  return (
    <div
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      // Transições CSS leves
      className="relative bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full 
                 transition-all duration-300 ease-in-out cursor-pointer 
                 hover:shadow-2xl hover:-translate-y-1 hover:scale-[1.02]"
      onClick={() => onLearnMore(course)}
    >
      {/* Topo colorido */}
      <div className="h-48 bg-gradient-to-br from-[#A8430F] to-[#d66a1f] relative overflow-hidden">
        {/* Ícone estático (ajuste de opacidade para fundo) */}
        <div
          className="absolute inset-0 flex items-center justify-center opacity-30"
        >
          {isPresencial ? (
            <MapPin className="w-20 h-20 text-white" />
          ) : (
            <Monitor className="w-20 h-20 text-white" />
          )}
        </div>

        {/* Badge de modalidade */}
        <span
          className="absolute top-4 right-4 bg-white text-[#A8430F] px-3 py-1 rounded-full text-sm font-semibold shadow"
        >
          {isPresencial ? 'Presencial' : 'EAD'}
        </span>
      </div>

      {/* Conteúdo */}
      <div className="p-4 sm:p-6 flex flex-col flex-grow"> {/* Diminuindo padding para mobile */}
        <h3
          className="text-xl sm:text-2xl font-bold text-gray-900 mb-3" // Fontes menores em mobile
        >
          {course.name}
        </h3>

        <p
          className="text-sm sm:text-base text-gray-600 mb-4 flex-grow leading-relaxed"
        >
          {course.shortDescription}
        </p>

        <div
          className="space-y-3 mb-6"
        >
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-5 h-5 text-[#A8430F]" />
            <span className="text-sm">
              <strong>Duração:</strong> {course.duration}
            </span>
          </div>

          <div className="flex items-center gap-2 text-gray-700">
            <Award className="w-5 h-5 text-[#A8430F]" />
            <span className="text-sm">
              <strong>Carga horária:</strong> {course.workload}
            </span>
          </div>
        </div>

        <div
          className="border-t pt-4 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">A partir de</p>
              <p className="text-2xl sm:text-3xl font-bold text-[#A8430F]"> {/* Fontes menores em mobile */}
                R$ {course.price.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation(); // Evita que o click suba para o card pai
              onLearnMore(course);
            }}
            className="w-full bg-[#A8430F] text-white py-3 rounded-lg font-semibold hover:bg-[#d66a1f] transition-colors flex items-center justify-center gap-2 group"
          >
            Saiba mais
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}