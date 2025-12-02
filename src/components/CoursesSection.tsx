// src/components/CoursesSection.tsx

import { Course } from "../types";
import { CourseCard } from "./CourseCard";
import { motion } from "framer-motion";

interface CoursesSectionProps {
  courses: Course[];
  onCourseSelect: (course: Course) => void;
  onViewAll: () => void;
}

// Helper para checar se o curso está em promoção (mesma lógica usada no CourseCard)
const isCoursePromoted = (course: Course) => {
    const price = course.price ?? 0;
    const promoPrice = course.promoPrice;
    return promoPrice !== null && promoPrice !== undefined && promoPrice > 0 && promoPrice < price;
};


export function CoursesSection({
  courses,
  onCourseSelect,
  onViewAll,
}: CoursesSectionProps) {

  // =========================================================================
  // 1. Destaques Home (Inclui Promoções de todas as modalidades + Presenciais Featured)
  // =========================================================================

  // 1a. Cursos em PROMOÇÃO (prioridade máxima, de todas as modalidades)
  const promotedCourses = courses.filter(isCoursePromoted);

  // 1b. Cursos Presenciais destacados, que AINDA NÃO ESTÃO NA LISTA DE PROMOÇÃO
  const featuredPresencialCourses = courses.filter(c => 
      c.type === "presencial" && 
      c.isFeatured && 
      !isCoursePromoted(c) // Garante que não duplica promoções
  );

  // Combina as listas: Promoções primeiro, depois Presenciais Featured. Limita a 3, ou todos se houver menos.
  const homeCourses = [...promotedCourses, ...featuredPresencialCourses].slice(0, 3);


  // =========================================================================
  // 2. Cursos EAD (Apenas EAD que NÃO estão em destaque na Home)
  // =========================================================================

  // Apenas cursos EAD que não foram incluídos na lista de Destaques da Home
  const eadCourses = courses
    .filter(c => c.type === "ead" && !isCoursePromoted(c))
    .slice(0, 8);


  const buttonClasses =
    "inline-flex items-center justify-center px-8 py-3 border border-[#A8430F] text-base font-medium " +
    "rounded-md text-[#A8430F] bg-white hover:bg-[#A8430F] hover:text-white " +
    "md:py-4 md:text-lg md:px-10 transition duration-150";

  return (
    <>
      {/* ===============================
          CURSOS PRESENCIAIS / DESTAQUES HOME
      ================================= */}
      <section id="courses" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          {/* TÍTULO */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(12px)' }}
            whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
            className="text-center mb-12"
          >
            <span className="text-[#A8430F] font-semibold text-lg">Nossos Cursos</span>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Cursos em Destaque
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Veja nossas principais ofertas e cursos presenciais mais populares.
            </p>
          </motion.div>

          {/* Cards de Destaque */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {homeCourses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{
                  opacity: 0,
                  y: 40,
                  scale: 0.9,
                  filter: "blur(10px)",
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  filter: "blur(0px)",
                }}
                viewport={{ once: false, amount: 0.15 }}
                transition={{
                  duration: 0.55,
                  ease: [0.19, 1, 0.22, 1],
                  delay: index * 0.08,
                }}
              >
                <CourseCard course={course} onLearnMore={onCourseSelect} />
              </motion.div>
            ))}
          </div>
          
          {homeCourses.length === 0 && (
              <p className="text-center text-gray-600 text-lg mt-8">
                  Nenhum curso em destaque ou promoção no momento.
              </p>
          )}

        </div>
      </section>

      {/* ===============================
          CURSOS EAD
      ================================= */}
      {eadCourses.length > 0 && (
        <section id="ead-courses" className="py-20 bg-white">
          <div className="container mx-auto px-4">
            {/* TÍTULO EAD */}
            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.9, filter: 'blur(12px)' }}
              whileInView={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.55, ease: [0.19, 1, 0.22, 1] }}
              className="text-center mb-12"
            >
              <span className="text-[#A8430F] font-semibold text-lg">Aprenda de Onde Estiver</span>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Cursos a partir de <span className="text-[#A8430F]">R$ 199,90</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Flexibilidade e qualidade no seu ritmo.
              </p>
            </motion.div>

            {/* Cards EAD */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {eadCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{
                    opacity: 0,
                    y: 40,
                    scale: 0.9,
                    filter: "blur(10px)",
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    filter: "blur(0px)",
                  }}
                  viewport={{ once: false, amount: 0.15 }}
                  transition={{
                    duration: 0.55,
                    ease: [0.19, 1, 0.22, 1],
                    delay: index * 0.08,
                  }}
                >
                  <CourseCard course={course} onLearnMore={onCourseSelect} />
                </motion.div>
              ))}
            </div>

            {/* BOTÃO EAD */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.2 }}
              transition={{
                duration: 0.45,
                ease: [0.19, 1, 0.22, 1],
                delay: 0.25,
              }}
              className="text-center mt-12"
            >
              <motion.button
                onClick={onViewAll}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.12 }}
                className={buttonClasses}
              >
                Ver todos os {courses.length} cursos
              </motion.button>
            </motion.div>
          </div>
        </section>
      )}
      
      {/* O modal de detalhes será renderizado pelo componente Home pai */}
    </>
  );
}