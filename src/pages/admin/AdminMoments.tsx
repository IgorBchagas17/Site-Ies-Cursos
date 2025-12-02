// src/pages/admin/AdminMoments.tsx

import { useEffect, useState } from "react";
import { Trash, Upload, Camera, RefreshCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { Moment } from "../../types";
import { momentService } from "../../services/momentService";
import { supabase } from "../../lib/supabaseClient"; // Para upload de arquivos, já assumido

const ACCENT_COLOR = "#E45B25"; 
const DARK_BACKGROUND = "#18181B"; 
const DARK_SHADE = "#27272A"; 
const TEXT_COLOR = "#FAFAFA"; 
const INPUT_BG = "#0A0A0A"; 

export default function AdminMoments() {
    const [moments, setMoments] = useState<Moment[]>([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newFile, setNewFile] = useState<File | null>(null);

    const loadMoments = async (showToast = false) => {
        setLoading(true);
        try {
            const data = await momentService.getAll();
            setMoments(data.sort((a, b) => new Date(b.data_upload).getTime() - new Date(a.data_upload).getTime()));
            if (showToast) toast.success("Galeria atualizada.");
        } catch (error) {
            toast.error("Erro ao carregar galeria.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadMoments();
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setNewFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!newFile) {
            toast.error("Selecione um arquivo para upload.");
            return;
        }

        setUploading(true);
        // Garante que o nome do arquivo seja único e seguro
        const fileName = `${Date.now()}_${newFile.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = `momentos/${fileName}`;
        
        try {
            // 1. Upload para o Storage do Supabase
            // IMPORTANTE: Assumindo que o bucket se chama 'images'
            const { error: uploadError } = await supabase.storage
                .from('images') 
                .upload(filePath, newFile, {
                    cacheControl: '3600',
                    upsert: false // Não substitui arquivos existentes
                });

            if (uploadError) {
                // Se o erro for de duplicidade ou permissão, ele será capturado aqui
                throw new Error(`Falha no Upload: ${uploadError.message}`);
            }

            // 2. Obter URL pública
            const { data: publicUrlData } = supabase.storage
                .from('images')
                .getPublicUrl(filePath);
            
            const imageUrl = publicUrlData.publicUrl;

            // 3. Salvar o momento no banco de dados
            const newMoment = await momentService.create({ 
                titulo: newTitle, 
                imagem_url: imageUrl 
            });

            setMoments(prev => [newMoment, ...prev]);
            setNewTitle("");
            setNewFile(null);
            (document.getElementById('file-input') as HTMLInputElement).value = ''; // Limpa o input file

            toast.success("Momento adicionado com sucesso!");

        } catch (error: any) {
            console.error("Erro no upload ou banco:", error.message);
            toast.error(error.message || "Falha ao adicionar momento. Verifique as configurações do Supabase.");
        } finally {
            setUploading(false);
        }
    };

    const handleDelete = async (moment: Moment) => {
        // PERIGO: A DELEÇÃO AQUI APENAS REMOVE O REGISTRO DO BANCO (momentos)
        // PARA PROJETOS REAIS, VOCÊ PRECISA DELETAR O ARQUIVO DO STORAGE TAMBÉM!

        // Etapa 1: Obter o caminho do Storage a partir da URL
        const pathSegments = moment.imagem_url.split('/public/images/'); // Ajuste o caminho se seu bucket não for 'images'
        const storagePath = pathSegments.length > 1 ? pathSegments[1] : null;

        try {
            // Se o caminho do Storage for identificado, tente excluir o arquivo
            if (storagePath) {
                 const { error: storageError } = await supabase.storage
                    .from('images') // Assumindo o bucket 'images'
                    .remove([storagePath]);

                if (storageError && storageError.message !== 'The resource was not found') {
                    // Erro ao remover do Storage (ignora se o arquivo já não existir)
                    console.warn("Aviso: Falha ao remover arquivo do Storage:", storageError.message);
                }
            }

            // Etapa 2: Deletar o registro do Banco de Dados
            await momentService.remove(moment.id);
            setMoments(prev => prev.filter(m => m.id !== moment.id));
            toast.success("Momento removido.");

        } catch (error) {
            toast.error("Falha ao remover momento.");
        }
    };

    return (
        <div className={`space-y-6 p-6 md:p-8 bg-[${DARK_BACKGROUND}] rounded-xl text-[${TEXT_COLOR}]`}>
            <div className="flex items-center gap-3 mb-6">
                <div 
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md`}
                    style={{ background: `linear-gradient(to right, ${ACCENT_COLOR}, #d66a1f)` }}
                >
                    <Camera size={20} className="text-white" />
                </div>
                <div>
                    <h1 className={`text-xl font-bold`} style={{ color: TEXT_COLOR }}>Gerenciar Galeria de Momentos</h1>
                    <span className="text-sm text-zinc-400">{moments.length} foto(s) na galeria</span>
                </div>
            </div>

            {/* === ADICIONAR NOVO MOMENTO === */}
            <div className={`p-4 rounded-xl bg-[${DARK_SHADE}] border border-zinc-700 space-y-4`}>
                <h2 className="text-base font-bold text-zinc-300 flex items-center gap-2">
                    <Upload size={16} style={{ color: ACCENT_COLOR }} /> Novo Upload
                </h2>
                
                <div className="grid md:grid-cols-4 gap-4 items-end">
                    <div className="flex flex-col gap-1 md:col-span-2">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                            Arquivo da Imagem (JPG/PNG)
                        </label>
                        <input
                            type="file"
                            id="file-input"
                            accept="image/jpeg,image/png"
                            onChange={handleFileChange}
                            className={`w-full text-sm text-[${TEXT_COLOR}] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-zinc-700 file:text-white hover:file:bg-zinc-600`}
                        />
                        {newFile && <span className="text-xs text-zinc-500 truncate">{newFile.name}</span>}
                    </div>

                    <div className="flex flex-col gap-1 md:col-span-1">
                        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wide">
                            Legenda (Opcional)
                        </label>
                        <input
                            type="text"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            className={`px-3 py-2 rounded-lg border text-sm text-[${TEXT_COLOR}] border-zinc-700 bg-zinc-900/60 focus:ring-2 focus:ring-[${ACCENT_COLOR}]`}
                            placeholder="Ex: Turma de Março de 2025"
                        />
                    </div>

                    <div className="md:col-span-1">
                        <button
                            onClick={handleUpload}
                            disabled={uploading || !newFile}
                            className={`w-full py-2 rounded-lg text-sm text-white flex items-center justify-center gap-2 disabled:opacity-60 transition-colors hover:bg-[#d66a1f]`}
                            style={{ backgroundColor: ACCENT_COLOR }}
                        >
                            {uploading ? "Enviando..." : <><Upload size={16} /> Fazer Upload</>}
                        </button>
                    </div>
                </div>
            </div>

            {/* === LISTA DE MOMENTOS === */}
            <div className={`p-4 rounded-xl bg-[${DARK_SHADE}] border border-zinc-700`}>
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-base font-bold text-zinc-300">Fotos Atuais</h2>
                    <button
                        onClick={() => loadMoments(true)}
                        className="flex items-center gap-1 text-xs text-zinc-400 hover:text-white transition-colors"
                        disabled={loading}
                    >
                        <RefreshCcw size={14} /> Recarregar
                    </button>
                </div>

                {loading && <p className="text-center text-zinc-500 py-4">Carregando fotos...</p>}

                {!loading && moments.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                        <AnimatePresence>
                            {moments.map((moment) => (
                                <motion.div
                                    key={moment.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2 }}
                                    className="relative group aspect-square rounded-lg overflow-hidden border border-zinc-700"
                                >
                                    <img 
                                        src={moment.imagem_url} 
                                        alt={moment.titulo} 
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                                        <button
                                            onClick={() => handleDelete(moment)}
                                            className="self-end p-1 bg-red-600 rounded-full text-white hover:bg-red-700 transition"
                                            title="Excluir Foto"
                                        >
                                            <Trash size={14} />
                                        </button>
                                        <p className="text-white text-xs truncate">
                                            {moment.titulo || 'Sem Legenda'}
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
                {!loading && moments.length === 0 && (
                    <p className="text-center text-zinc-500 py-4">Nenhuma foto na galeria.</p>
                )}
            </div>
        </div>
    );
}