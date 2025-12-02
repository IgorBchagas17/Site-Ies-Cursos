// src/components/CoursesSection.tsx
import { Course } from "../types";
import { CourseCard } from "./CourseCard";
import { motion } from "framer-motion"; // Mantendo apenas para o motion.div dos títulos

interface CoursesSectionProps {
  courses: Course[];
  onCourseSelect: (course: Course) => void;
  onViewAll: () => void;
}

export function CoursesSection({
  courses,
  onCourseSelect,
  onViewAll,
}: CoursesSectionProps) {
  // ATENÇÃO: Se a propriedade `isFeatured` foi removida da interface Course,
  // você deve ajustar a lógica de destaque aqui, provavelmente usando `promoPrice`.
  // Mantendo a lógica anterior, mas assumindo que isFeatured ainda exista no banco
  // ou que você o removeu do `types.ts` mas a lógica será ajustada manualmente.
  
  // Usando a lógica que prioriza cursos em promoção (melhor prática):
  const sortedCourses = [...courses].sort((a, b) => {
    const aIsPromoted = a.promoPrice !== null && a.promoPrice < a.price;
    const bIsPromoted = b.promoPrice !== null && b.promoPrice < b.price;
    if (aIsPromoted && !bIsPromoted) return -1;
    if (!aIsPromoted && bIsPromoted) return 1;
    return 0;
  });

  const presencialCourses = sortedCourses
    .filter((c) => c.type === "presencial")
    .slice(0, 3);

  const eadCourses = sortedCourses.filter((c) => c.type === "ead").slice(0, 4); // Reduzido para 4 em vez de 8 para melhor visualização em mobile

  const buttonClasses =
    "inline-flex items-center justify-center px-6 py-3 border border-[#A8430F] text-base font-medium " +
    "rounded-md text-[#A8430F] bg-white hover:bg-[#A8430F] hover:text-white " +
    "sm:py-4 sm:text-lg sm:px-10 transition duration-150";

  return (
    <>
      {/* ================================
          CURSOS PRESENCIAIS
      ================================= */}
      <section id="courses" className="py-12 sm:py-20 bg-gray-50"> {/* Reduzindo padding em mobile */}
        <div className="container mx-auto px-4">
          {/* TÍTULO */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} // Mantendo animação de entrada de seção
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
            className="text-center mb-8 sm:mb-12" // Ajustando margem
          >
            <span className="text-[#A8430F] font-semibold text-base sm:text-lg">
              Cursos Presenciais
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Nossos Principais Cursos
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Aprenda com aulas práticas e professores experientes em nossa
              unidade
            </p>
          </motion.div>

          {/* GRID: alterado para 1 coluna em mobile, 2 em tablet, 3 em desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {presencialCourses.map((course) => (
              <div 
                key={course.id} 
                // REMOVIDO: motion.div e todas as animações whileInView do card
              >
                <CourseCard course={course} onLearnMore={onCourseSelect} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================================
          CURSOS EAD
      ================================= */}
      <section id="ead-courses" className="py-12 sm:py-20 bg-white"> {/* Reduzindo padding em mobile */}
        <div className="container mx-auto px-4">
          {/* TÍTULO */}
          <motion.div
            initial={{ opacity: 0, y: 40 }} // Mantendo animação de entrada de seção
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
            className="text-center mb-8 sm:mb-12" // Ajustando margem
          >
            <span className="text-[#A8430F] font-semibold text-base sm:text-lg">
              Cursos EAD
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Estude de Onde Estiver
            </h2>
            <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
              Flexibilidade para aprender no seu ritmo, com qualidade e
              certificado reconhecido
            </p>
          </motion.div>

          {/* GRID: alterado para 1 coluna em mobile, 2 em tablet, 4 em desktop */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {eadCourses.map((course) => (
              <div 
                key={course.id}
                // REMOVIDO: motion.div e todas as animações whileInView do card
              >
                <CourseCard course={course} onLearnMore={onCourseSelect} />
              </div>
            ))}
          </div>

          {/* BOTÃO EAD */}
          {eadCourses.length > 0 && (
            <div className="text-center mt-8 sm:mt-12">
              <motion.button
                onClick={onViewAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className={buttonClasses}
              >
                Ver todos os Cursos EAD
              </motion.button>
            </div>
          )}
        </div>
      </section>
    </>
  );
}