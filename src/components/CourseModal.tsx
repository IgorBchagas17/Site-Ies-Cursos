// src/components/CourseModal.tsx

import { useEffect } from 'react'; // Adicionei o import do useEffect
import { X, Check, Clock, Award, MapPin, Monitor, DollarSign } from 'lucide-react';
import { Course } from '../types';
import { motion, Variants } from 'framer-motion';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
}

// Variantes de animação (Otimizadas)
const overlayVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 }
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 20 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    y: 0,
    transition: { 
      type: "spring",
      damping: 25, 
      stiffness: 300,
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: 20,
    transition: { duration: 0.2 }
  }
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export function CourseModal({ course, onClose }: CourseModalProps) {
  // Hook para travar o scroll da página de fundo
  useEffect(() => {
    if (course) {
      document.body.style.overflow = 'hidden';
    }
    // Função de limpeza: roda quando o modal fecha
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [course]);

  if (!course) return null;

  // Cores padronizadas
  const ACCENT_COLOR = "#E45B25"; 
  const PROMO_COLOR = "#dc2626";
  const TEXT_COLOR = "#1F2937"; 

  // Lógica de Preço
  const price = course.price ?? 0;
  const promoPrice = course.promoPrice;
  const isPromoted = promoPrice !== null && promoPrice !== undefined && promoPrice > 0 && promoPrice < price;

  const handleEnroll = () => {
    let priceText;

    if (isPromoted) {
      priceText = `OPORTUNIDADE! De R$ ${price.toFixed(2)} por R$ ${promoPrice!.toFixed(2)} (Valor Promocional)`;
    } else {
      priceText = "Solicito mais informações sobre valores e formas de pagamento.";
    }

    const message = `Olá! Gostaria de me matricular no curso:

Curso: ${course.name}
Modalidade: ${course.type === 'presencial' ? 'Presencial' : 'EAD'}
Detalhes do Preço: ${priceText}

Gostaria de falar com um consultor para mais informações sobre matrícula e formas de pagamento.`;

    // Telefone Fictício
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isPresencial = course.type === 'presencial';

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-0 md:p-4">
      {/* Overlay escuro */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        onClick={onClose}
      />

      {/* Wrapper do Modal */}
      <motion.div
        // Ajustes de layout responsivo mantidos
        className="relative w-full md:w-full max-w-[95%] md:max-w-4xl my-4 md:my-8 max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col mx-auto"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        
        {/* Cabeçalho fixo (Laranja) */}
        <div 
            className="sticky top-0 text-white p-4 md:p-6 flex justify-between items-start md:items-center rounded-t-2xl z-10 shrink-0"
            style={{ 
                background: `linear-gradient(to right, ${ACCENT_COLOR}, #d66a1f)`,
            }}
        >
          <div className="pr-2">
            <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 leading-tight">
              {course.name}
            </h2>
            <div className="flex items-center gap-2 mt-1">
              {isPresencial ? (
                <MapPin className="w-4 h-4 md:w-5 md:h-5" />
              ) : (
                <Monitor className="w-4 h-4 md:w-5 md:h-5" />
              )}
              <span className="font-semibold text-sm md:text-base">
                {isPresencial ? 'Presencial' : 'EAD'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors flex-shrink-0"
          >
            <X className="w-5 h-5 md:w-6 md:h-6" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="p-4 md:p-8 overflow-y-auto">
          
          {/* Cards de info rápida */}
          <motion.div
            variants={itemVariants}
            className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8"
          >
            {/* 1. Duração */}
            <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
              <Clock className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" style={{ color: ACCENT_COLOR }} />
              <div>
                <p className="text-xs md:text-sm text-gray-600">Duração</p>
                <p className="font-semibold text-sm md:text-base">{course.duration}</p>
              </div>
            </div>

            {/* 2. Carga Horária */}
            <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
              <Award className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" style={{ color: ACCENT_COLOR }} />
              <div>
                <p className="text-xs md:text-sm text-gray-600">Carga horária</p>
                <p className="font-semibold text-sm md:text-base">{course.workload}</p>
              </div>
            </div>

            {/* 3. Investimento (Preço/Promoção) */}
            <div className="flex items-center gap-3 p-3 md:p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-6 h-6 md:w-8 md:h-8 flex-shrink-0" style={{ color: ACCENT_COLOR }} />
              <div>
                <p className="text-xs md:text-sm text-gray-600">Investimento</p>
                {isPromoted ? (
                    <div className="flex flex-col">
                        <span className="text-[10px] md:text-xs text-gray-500 line-through">
                            De R$ {price.toFixed(2)}
                        </span>
                        <span className="font-bold text-base md:text-lg" style={{ color: PROMO_COLOR }}>
                            Por R$ {promoPrice!.toFixed(2)}
                        </span>
                    </div>
                ) : (
                    <p className="font-semibold text-sm md:text-base text-gray-900">
                        Consulte valores
                    </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sobre o curso */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-8">
            <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4`} style={{ color: TEXT_COLOR }}>
              Sobre o curso
            </h3>
            <p className="text-sm md:text-base text-gray-700 leading-relaxed">
              {course.description}
            </p>
          </motion.div>

          {/* O que você vai aprender */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-8">
            <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4`} style={{ color: TEXT_COLOR }}>
              O que você vai aprender
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {course.content.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT_COLOR }} />
                  <span className="text-sm md:text-base text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Benefícios */}
          <motion.div variants={itemVariants} className="mb-6 md:mb-8">
            <h3 className={`text-xl md:text-2xl font-bold mb-3 md:mb-4`} style={{ color: TEXT_COLOR }}>
              Benefícios do curso
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3">
              {course.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT_COLOR }} />
                  <span className="text-sm md:text-base text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div variants={itemVariants} className="bg-gray-50 rounded-xl p-4 md:p-6 mb-6 md:mb-8">
            <h3 className={`text-lg md:text-xl font-bold mb-3 md:mb-4`} style={{ color: TEXT_COLOR }}>
              Perguntas Frequentes
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                  Preciso ter conhecimento prévio?
                </p>
                <p className="text-gray-700 text-xs md:text-sm">
                  {course.slug.includes('basica') || course.slug.includes('auxiliar')
                    ? 'Não, o curso é voltado para iniciantes e não requer conhecimento prévio.'
                    : 'É recomendado ter conhecimentos básicos, mas não é obrigatório.'}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                  Recebo certificado?
                </p>
                <p className="text-gray-700 text-xs md:text-sm">
                  Sim, ao concluir o curso você receberá certificado reconhecido válido em todo território nacional.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                  Como funciona o pagamento?
                </p>
                <p className="text-gray-700 text-xs md:text-sm">
                  Oferecemos diversas formas de pagamento: cartão de crédito, PIX, boleto e parcelamento. Entre em contato para conhecer as condições.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1 text-sm md:text-base">
                  Quando começam as turmas?
                </p>
                <p className="text-gray-700 text-xs md:text-sm">
                  Temos turmas iniciando mensalmente. Entre em contato para saber a próxima turma disponível.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Botões finais */}
          <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-3 md:gap-4 pb-2">
            <button
              onClick={handleEnroll}
              className={`flex-1 text-white py-3 md:py-4 rounded-lg font-bold text-base md:text-lg transition-all shadow-lg hover:scale-[1.01] hover:bg-[#d66a1f]`}
              style={{ backgroundColor: ACCENT_COLOR }}
            >
              {isPromoted ? 'GARANTA SUA VAGA EM PROMOÇÃO' : 'Quero mais informações'}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 md:py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold text-base md:text-lg hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}