// src/pages/Moments.tsx

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, RefreshCcw } from "lucide-react";
import { Moment } from "../types"; // Importa a nova interface
import { momentService } from "../services/momentService"; // Service a ser criado

export default function Moments() {
    const [moments, setMoments] = useState<Moment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const ACCENT_COLOR = "#E45B25"; 

    const loadMoments = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await momentService.getAll();
            // Invertemos a ordem para que as fotos mais recentes apareçam primeiro
            setMoments(data.sort((a, b) => new Date(b.data_upload).getTime() - new Date(a.data_upload).getTime()));
        } catch (err) {
            console.error("Erro ao carregar momentos:", err);
            setError("Não foi possível carregar a galeria de fotos. Tente novamente mais tarde.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        loadMoments();
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 },
    };

    return (
        <section id="moments-gallery" className="min-h-screen pt-32 pb-20 bg-gray-50">
            <div className="container mx-auto px-4">
                
                {/* === CABEÇALHO === */}
                <div className="text-center mb-12">
                    <span className="text-lg font-semibold" style={{ color: ACCENT_COLOR }}>
                        Nossa História Visual
                    </span>
                    <h1 className="text-5xl font-extrabold text-gray-900 mt-2 mb-4">
                        Momentos da Escola
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Confira o que acontece nas nossas turmas presenciais e eventos.
                    </p>
                </div>

                {loading && (
                    <div className="flex justify-center py-20">
                        <p className="text-xl text-gray-600">Carregando momentos...</p>
                    </div>
                )}

                {error && (
                    <div className="text-center py-20">
                        <p className="text-xl text-red-600 mb-4">{error}</p>
                        <button
                            onClick={loadMoments}
                            className="px-6 py-3 rounded-md bg-[#A8430F] text-white font-semibold hover:bg-orange-700 transition flex items-center gap-2 mx-auto"
                        >
                            <RefreshCcw size={18} /> Tentar Recarregar
                        </button>
                    </div>
                )}

                {!loading && moments.length > 0 && (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                    >
                        {moments.map((moment) => (
                            <motion.div
                                key={moment.id}
                                variants={itemVariants}
                                // Efeito de zoom leve no hover
                                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0,0,0,0.2)" }}
                                transition={{ duration: 0.2 }}
                                className="relative group w-full aspect-square overflow-hidden rounded-xl shadow-lg cursor-pointer"
                            >
                                <img
                                    src={moment.imagem_url}
                                    alt={moment.titulo || "Momento da IesCursos"}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                />
                                {/* Overlay com descrição */}
                                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300 flex items-end p-4">
                                    <p className="text-white text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                        {moment.titulo || "Foto da turma"}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </section>
    );
}