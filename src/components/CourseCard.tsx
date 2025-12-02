// src/components/CourseCard.tsx

import { useState } from 'react';
import { Clock, Award, ArrowRight, MapPin, Monitor } from 'lucide-react';
import { motion } from 'framer-motion'; 
import { Course } from '../types';

interface CourseCardProps {
	course: Course;
	onLearnMore: (course: Course) => void;
}

export function CourseCard({ course, onLearnMore }: CourseCardProps) {
	const isPresencial = course.type === 'presencial';
	const [hover, setHover] = useState(false);

	// Cores padronizadas para sincronia com o resto do site
	const ACCENT_COLOR = "#E45B25"; 
	const PROMO_COLOR = "#dc2626"; // Vermelho forte (Red 600)
	const TEXT_COLOR = "#1F2937"; // Cinza Escuro

	// Lógica de Promoção: Checa se o preço promocional existe E é válido (maior que zero e menor que o preço cheio)
	const price = course.price ?? 0;
	const promoPrice = course.promoPrice;
	const isPromoted = promoPrice !== null && promoPrice !== undefined && promoPrice > 0 && promoPrice < price;

	return (
		<motion.div
			layoutId={`course-card-${course.id}`} 
			onMouseEnter={() => setHover(true)}
			onMouseLeave={() => setHover(false)}
			
			// Animação de Entrada LEVE
			initial={{ opacity: 0, y: 20, scale: 0.98 }}
			whileInView={{ opacity: 1, y: 0, scale: 1 }}
			viewport={{ once: true, amount: 0.25 }}
			
			// Animação de HOVER LEVE
			whileHover={{
				y: -3, 
				scale: 1.015, 
				boxShadow: '0 10px 20px -5px rgba(0,0,0,0.1)',
			}}
			transition={{
				duration: 0.3,
				ease: [0.4, 0, 0.2, 1], 
			}}
			className="relative bg-white rounded-xl shadow-lg overflow-hidden flex flex-col h-full cursor-pointer"
		>
			{/* ===== BADGE DE PROMOÇÃO (FAIXA DIAGONAL GRANDE E CHAMATIVA) ===== */}
			{isPromoted && (
				<div 
					// Aumentado para 32 h e w para dar mais corpo à faixa
					className="absolute top-0 left-0 z-10 w-32 h-32 overflow-hidden pointer-events-none"
				>
					<div 
						// Ajustado width (160px), font size e top/left para cobrir bem o canto.
						className={`absolute transform -rotate-45 text-center text-white font-extrabold py-2 left-[-45px] top-[18px] w-[160px] shadow-xl`}
						style={{ 
							backgroundColor: PROMO_COLOR, 
							fontSize: '12px', // Fonte um pouco maior
							textShadow: '0 1px 2px rgba(0,0,0,0.4)' // Sombra para chamar mais atenção
						}}
					>
						PROMOÇÃO
					</div>
				</div>
			)}

			{/* Topo colorido */}
			<div 
				className="h-48 relative overflow-hidden flex items-center justify-center"
				style={{ 
					background: `linear-gradient(to bottom right, ${ACCENT_COLOR}, #d66a1f)`,
				}}
			>
				
				{/* Ícone com transição CSS simples para otimização */}
				<div
					className={`absolute inset-0 flex items-center justify-center transition-transform duration-500 
						${hover ? 'scale-[1.4] opacity-45' : 'scale-[1.2] opacity-30'}`}
				>
					{isPresencial ? (
						<MapPin className="w-20 h-20 text-white/30" />
					) : (
						<Monitor className="w-20 h-20 text-white/30" />
					)}
				</div>

				{/* Badge de modalidade (MANTIDO À DIREITA) */}
				<span
					className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-semibold shadow z-20"
					style={{ color: ACCENT_COLOR }}
				>
					{isPresencial ? 'Presencial' : 'EAD'}
				</span>
			</div>

			{/* Conteúdo */}
			<div className="p-6 flex flex-col flex-grow">
				<h3
					className={`text-2xl font-bold mb-3`}
					style={{ color: TEXT_COLOR }}
				>
					{course.name}
				</h3>

				<p
					className="text-gray-600 mb-4 flex-grow leading-relaxed"
				>
					{course.shortDescription}
				</p>

				{/* Duração e Carga Horária */}
				<div
					className="space-y-3 mb-6"
				>
					<div className="flex items-center gap-2 text-gray-700">
						<Clock className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
						<span className="text-sm">
							<strong>Duração:</strong> {course.duration}
						</span>
					</div>

					<div className="flex items-center gap-2 text-gray-700">
						<Award className="w-5 h-5" style={{ color: ACCENT_COLOR }} />
						<span className="text-sm">
							<strong>Carga horária:</strong> {course.workload}
						</span>
					</div>
				</div>

				{/* ============ NOVO BLOCO DE PREÇO / PROMOÇÃO ============ */}
				<div
					className="border-t pt-4 space-y-4 mt-auto" // mt-auto empurra o botão para baixo
				>
					<div className="flex items-center justify-between">
						<div>
							{isPromoted ? (
								// Lógica para PROMOÇÃO
								<>
									<p className="text-sm text-gray-500 font-semibold mb-1">
										DE: <span className="text-xl font-medium text-gray-400 line-through">R$ {price.toFixed(2)}</span>
									</p>
									<p className="text-3xl font-bold" style={{ color: PROMO_COLOR }}>
										POR R$ {promoPrice!.toFixed(2)}
									</p>
								</>
							) : (
								// Lógica SEM PROMOÇÃO (apenas chamada para ação)
								<p className="text-base font-semibold text-gray-700">
									Saiba mais e consulte valores
								</p>
							)}
						</div>
					</div>

					<button
						onClick={() => onLearnMore(course)}
						className="w-full text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 group shadow-md hover:scale-[1.01] hover:bg-[#d66a1f]" 
						style={{ backgroundColor: ACCENT_COLOR }}
					>
						{isPromoted ? 'GARANTA SUA VAGA' : 'Saiba mais'}
						<ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
					</button>
				</div>
			</div>
		</motion.div>
	);
}