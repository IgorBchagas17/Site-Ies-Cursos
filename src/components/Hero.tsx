// src/components/Hero.tsx

import { useState, useEffect } from 'react';
import { ArrowRight, Check, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { bannerService } from '../services/bannerService';
import { Banner } from '../types';

export function Hero() {
    const [banners, setBanners] = useState<Banner[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0); 
    const [isDesktop, setIsDesktop] = useState(false); 

    useEffect(() => {
        const loadBanners = async () => {
            const data = await bannerService.getActive();
            setBanners(data);
        };
        loadBanners();

        const checkDesktop = () => setIsDesktop(window.innerWidth >= 1024);
        checkDesktop();
        window.addEventListener('resize', checkDesktop);
        return () => window.removeEventListener('resize', checkDesktop);
    }, []);

    const totalSlides = 1 + banners.length;

    const paginate = (newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => {
            let nextIndex = prev + newDirection;
            if (nextIndex < 0) nextIndex = totalSlides - 1;
            if (nextIndex >= totalSlides) nextIndex = 0;
            return nextIndex;
        });
    };

    useEffect(() => {
        if (totalSlides <= 1) return;
        
        const interval = setInterval(() => {
            paginate(1);
        }, 6000);

        return () => clearInterval(interval);
    }, [totalSlides, currentIndex]);

    const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
        const offset = info.offset.x;
        const velocity = info.velocity.x;

        const swipeConfidenceThreshold = 10000;
        const swipePower = Math.abs(offset) * velocity;

        if (swipePower < -swipeConfidenceThreshold || offset < -100) {
            paginate(1);
        } 
        else if (swipePower > swipeConfidenceThreshold || offset > 100) {
            paginate(-1);
        }
    };

    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? '100%' : '-100%',
            opacity: 0,
            zIndex: 0
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? '100%' : '-100%',
            opacity: 0
        })
    };

    return (
        <section id="hero" className="relative w-full overflow-hidden bg-black text-white pt-16 lg:pt-20">
            <div className="relative h-[600px] lg:h-[750px] w-full flex items-center bg-zinc-900 overflow-hidden">
                
                <AnimatePresence initial={false} custom={direction} mode="popLayout">
                    
                    {currentIndex === 0 ? (
                        <motion.div
                            key="hero-standard"
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag={isDesktop ? false : "x"}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.7}
                            dragMomentum={false}
                            onDragEnd={handleDragEnd}
                            // CORREÇÃO APLICADA AQUI: cursor-grab no mobile, lg:cursor-default no desktop
                            className="absolute inset-0 w-full h-full bg-gradient-to-br from-black via-[#ff5722] to-black flex items-center cursor-grab active:cursor-grabbing lg:cursor-default touch-pan-y"
                        >
                            <div className="container mx-auto px-4 lg:px-12 pointer-events-none md:pointer-events-auto">
                                <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                                    
                                    {/* Texto */}
                                    <div className="space-y-6 lg:space-y-8 z-10 relative">
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="inline-block"
                                        >
                                            <span className="bg-[#ff5722] text-white px-4 py-2 rounded-full text-xs lg:text-sm font-bold uppercase tracking-wide shadow-lg">
                                                Transforme sua carreira
                                            </span>
                                        </motion.div>

                                        <motion.h1 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="text-4xl sm:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight"
                                        >
                                            Transforme seu futuro com a{' '}
                                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5722] to-[#F27A24]">
                                                IesCursos
                                            </span>
                                        </motion.h1>

                                        <motion.p 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="text-base sm:text-lg lg:text-xl text-zinc-300 max-w-xl leading-relaxed"
                                        >
                                            Cursos Profissionalizantes Presenciais e EAD com a qualidade que o mercado exige e valores que cabem no seu bolso.
                                        </motion.p>

                                        <motion.ul 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="space-y-3"
                                        >
                                            {['Certificado reconhecido', 'Professores qualificados', 'Aulas práticas'].map((item, i) => (
                                                <li key={i} className="flex items-center gap-3 text-sm lg:text-base text-zinc-200">
                                                    <div className="bg-[#ff5722]/20 p-1 rounded-full">
                                                        <Check className="w-4 h-4 text-[#FF6B00]" />
                                                    </div>
                                                    {item}
                                                </li>
                                            ))}
                                        </motion.ul>

                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                            className="pt-4"
                                        >
                                            <button
                                                onClick={() => scrollToSection('contact')}
                                                className="pointer-events-auto group relative inline-flex items-center justify-center gap-2 px-8 py-4 font-semibold text-white transition-all duration-200 bg-[#ff5722] rounded-full hover:bg-[#d66a1f] hover:scale-105 shadow-[0_0_20px_rgba(168,67,15,0.5)]"
                                            >
                                                Matricule-se agora
                                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </motion.div>
                                    </div>

                                    {/* Imagem Hero Padrão */}
                                    <div className="relative hidden lg:block pointer-events-none">
                                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 transform hover:scale-[1.02] transition-transform duration-500">
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent z-10"></div>
                                            <img
                                                src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800"
                                                alt="Estudante"
                                                className="w-full h-auto object-cover"
                                            />
                                            <div className="absolute bottom-8 left-8 z-20 bg-[#ff5722]/90 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-lg">
                                                <p className="text-3xl font-bold text-white">+5k</p>
                                                <p className="text-xs text-white/80 uppercase tracking-wider">Alunos Formados</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        /* === SLIDES DE BANNER (IMAGENS) === */
                        <motion.div
                            key={`banner-${currentIndex}`}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag={isDesktop ? false : "x"}
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.7}
                            dragMomentum={false}
                            onDragEnd={handleDragEnd}
                            // CORREÇÃO APLICADA AQUI: cursor-grab no mobile, lg:cursor-default no desktop
                            className="absolute inset-0 w-full h-full bg-zinc-900 cursor-grab active:cursor-grabbing lg:cursor-default touch-pan-y"
                        >
                            {(() => {
                                const banner = banners[currentIndex - 1];
                                if (!banner) return null;

                                return (
                                    <>
                                        <img 
                                            src={banner.mobile_image || banner.imagem_url} 
                                            alt={banner.titulo} 
                                            className="block md:hidden w-full h-full object-cover pointer-events-none"
                                        />
                                        <img 
                                            src={banner.imagem_url} 
                                            alt={banner.titulo} 
                                            className="hidden md:block w-full h-full object-cover pointer-events-none"
                                        />
                                    </>
                                );
                            })()}
                        </motion.div>
                    )}
                </AnimatePresence>

                {totalSlides > 1 && (
                    <>
                        <button 
                            onClick={() => paginate(-1)}
                            className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-[#ff5722] text-white p-4 rounded-full transition-all backdrop-blur-sm border border-white/10 hover:border-[#ff5722] group"
                        >
                            <ChevronLeft size={28} className="group-hover:-translate-x-1 transition-transform" />
                        </button>
                        
                        <button 
                            onClick={() => paginate(1)}
                            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-[#ff5722] text-white p-4 rounded-full transition-all backdrop-blur-sm border border-white/10 hover:border-[#ff5722] group"
                        >
                            <ChevronRight size={28} className="group-hover:translate-x-1 transition-transform" />
                        </button>

                        <div className="absolute bottom-6 left-0 right-0 z-20 flex justify-center gap-3 pointer-events-auto">
                            {[...Array(totalSlides)].map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => {
                                        const newDir = idx > currentIndex ? 1 : -1;
                                        setDirection(newDir);
                                        setCurrentIndex(idx);
                                    }}
                                    className={`h-2 rounded-full transition-all duration-300 shadow-sm ${
                                        currentIndex === idx 
                                            ? 'bg-[#ff5722] w-8' 
                                            : 'bg-white/40 hover:bg-white w-2'
                                    }`}
                                    aria-label={`Ir para slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}