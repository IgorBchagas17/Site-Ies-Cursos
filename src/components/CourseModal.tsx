// src/components/CourseModal.tsx

import { X, Check, Clock, Award, MapPin, Monitor, DollarSign } from 'lucide-react';
import { Course } from '../types';
import { motion } from 'framer-motion';

interface CourseModalProps {
  course: Course | null;
  onClose: () => void;
}

export function CourseModal({ course, onClose }: CourseModalProps) {
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

    // Telefone Fictício: Substitua pelo número real da diretora!
    const whatsappUrl = `https://wa.me/5511999999999?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const isPresencial = course.type === 'presencial';

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Overlay escuro */}
      <motion.div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm" // backdrop-blur para efeito mais bonito
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Wrapper do Modal */}
      <motion.div
        // Animação LEVE e profissional: escala e y
        initial={{ scale: 0.9, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 30 }}
        transition={{ duration: 0.4, ease: [0.19, 1, 0.22, 1] }}
        
        // Mantém o layoutId para a transição suave com o CourseCard
        layoutId={`course-card-${course.id}`} 
        className="relative w-full max-w-4xl my-8 max-h-[90vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        
        {/* Cabeçalho fixo (Laranja) */}
        <div 
            className="sticky top-0 text-white p-6 flex justify-between items-center rounded-t-2xl z-10"
            style={{ 
                background: `linear-gradient(to right, ${ACCENT_COLOR}, #d66a1f)`,
            }}
        >
          <div>
            <h2 className="text-3xl font-bold mb-2">
              {course.name}
            </h2>
            <div className="flex items-center gap-2">
              {isPresencial ? (
                <MapPin className="w-5 h-5" />
              ) : (
                <Monitor className="w-5 h-5" />
              )}
              <span className="font-semibold">
                {isPresencial ? 'Presencial' : 'EAD'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Conteúdo rolável */}
        <div className="p-8 overflow-y-auto">
          {/* Cards de info rápida */}
          <motion.div
            // Animações de entrada leve para cada seção (como solicitado)
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="grid md:grid-cols-3 gap-6 mb-8"
          >
            {/* 1. Duração */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Clock className="w-8 h-8" style={{ color: ACCENT_COLOR }} />
              <div>
                <p className="text-sm text-gray-600">Duração</p>
                <p className="font-semibold">{course.duration}</p>
              </div>
            </div>

            {/* 2. Carga Horária */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Award className="w-8 h-8" style={{ color: ACCENT_COLOR }} />
              <div>
                <p className="text-sm text-gray-600">Carga horária</p>
                <p className="font-semibold">{course.workload}</p>
              </div>
            </div>

            {/* 3. Investimento (Preço/Promoção) - CORRIGIDO/ADAPTADO */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <DollarSign className="w-8 h-8" style={{ color: ACCENT_COLOR }} />
              <div>
                <p className="text-sm text-gray-600">Investimento</p>
                {isPromoted ? (
                    // Se for promoção: destaque a oferta
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500 line-through">
                            De R$ {price.toFixed(2)}
                        </span>
                        <span className="font-bold text-lg" style={{ color: PROMO_COLOR }}>
                            Por R$ {promoPrice!.toFixed(2)}
                        </span>
                    </div>
                ) : (
                    // Se não for promoção: apenas consulta
                    <p className="font-semibold text-gray-900">
                        Consulte valores
                    </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Sobre o curso */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
            className="mb-8"
          >
            <h3 className={`text-2xl font-bold mb-4`} style={{ color: TEXT_COLOR }}>
              Sobre o curso
            </h3>
            <p className="text-gray-700 leading-relaxed">
              {course.description}
            </p>
          </motion.div>

          {/* O que você vai aprender */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.19, 1, 0.22, 1] }}
            className="mb-8"
          >
            <h3 className={`text-2xl font-bold mb-4`} style={{ color: TEXT_COLOR }}>
              O que você vai aprender
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {course.content.map((item, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT_COLOR }} />
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Benefícios */}
          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
            className="mb-8"
          >
            <h3 className={`text-2xl font-bold mb-4`} style={{ color: TEXT_COLOR }}>
              Benefícios do curso
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {course.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-2">
                  <Check className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: ACCENT_COLOR }} />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.25, ease: [0.19, 1, 0.22, 1] }}
            className="bg-gray-50 rounded-xl p-6 mb-8"
          >
            <h3 className={`text-xl font-bold mb-4`} style={{ color: TEXT_COLOR }}>
              Perguntas Frequentes
            </h3>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Preciso ter conhecimento prévio?
                </p>
                <p className="text-gray-700 text-sm">
                  {course.slug.includes('basica') || course.slug.includes('auxiliar')
                    ? 'Não, o curso é voltado para iniciantes e não requer conhecimento prévio.'
                    : 'É recomendado ter conhecimentos básicos, mas não é obrigatório.'}
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Recebo certificado?
                </p>
                <p className="text-gray-700 text-sm">
                  Sim, ao concluir o curso você receberá certificado reconhecido válido em todo território nacional.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Como funciona o pagamento?
                </p>
                <p className="text-gray-700 text-sm">
                  Oferecemos diversas formas de pagamento: cartão de crédito, PIX, boleto e parcelamento. Entre em contato para conhecer as condições.
                </p>
              </div>

              <div>
                <p className="font-semibold text-gray-900 mb-1">
                  Quando começam as turmas?
                </p>
                <p className="text-gray-700 text-sm">
                  Temos turmas iniciando mensalmente. Entre em contato para saber a próxima turma disponível.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Botões finais */}
          <motion.div
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <button
              onClick={handleEnroll}
              className={`flex-1 text-white py-4 rounded-lg font-bold text-lg transition-all shadow-lg hover:scale-[1.01] hover:bg-[#d66a1f]`}
              style={{ backgroundColor: ACCENT_COLOR }}
            >
              {isPromoted ? 'GARANTA SUA VAGA EM PROMOÇÃO' : 'Quero mais informações'}
            </button>
            <button
              onClick={onClose}
              className="px-8 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
            >
              Fechar
            </button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}