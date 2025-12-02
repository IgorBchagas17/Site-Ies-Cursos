// src/services/momentService.ts

import { supabase } from "./../lib/supabaseClient"; // Assumindo que supabaseClient está configurado
import { Moment } from "../types";

const MOMENTS_TABLE = "momentos"; // Nome da tabela que criaremos no Supabase

export const momentService = {
    /**
     * Carrega todos os momentos do banco de dados.
     */
    async getAll(): Promise<Moment[]> {
        const { data, error } = await supabase
            .from(MOMENTS_TABLE)
            .select('*');

        if (error) {
            console.error("Erro ao buscar momentos:", error);
            throw new Error("Falha ao carregar galeria.");
        }

        // Garante que os campos de data e URL estejam corretos
        return data.map(item => ({
            id: item.id,
            titulo: item.titulo || '',
            imagem_url: item.imagem_url,
            data_upload: item.data_upload,
        }));
    },

    /**
     * Adiciona um novo momento (usado pelo Admin).
     */
    async create(momentData: Omit<Moment, 'id' | 'data_upload'>): Promise<Moment> {
        const { data, error } = await supabase
            .from(MOMENTS_TABLE)
            .insert([{ 
                titulo: momentData.titulo, 
                imagem_url: momentData.imagem_url 
            }])
            .select()
            .single();

        if (error) {
            console.error("Erro ao criar momento:", error);
            throw new Error("Falha ao salvar a imagem.");
        }
        return data;
    },

    /**
     * Remove um momento pelo ID (usado pelo Admin).
     */
    async remove(id: string): Promise<void> {
        const { error } = await supabase
            .from(MOMENTS_TABLE)
            .delete()
            .eq('id', id);

        if (error) {
            console.error("Erro ao remover momento:", error);
            throw new Error("Falha ao remover a imagem.");
        }
    },
};