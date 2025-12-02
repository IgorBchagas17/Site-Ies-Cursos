// src/components/DarkModeToggle.tsx

import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export function DarkModeToggle() {
    // 1. Inicializa o estado lendo a preferência do sistema ou de localStorage
    const [isDarkMode, setIsDarkMode] = useState(() => {
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') return true;
            if (savedTheme === 'light') return false;

            // Se não houver nada, usa a preferência do sistema operacional
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    // 2. Efeito colateral para aplicar a classe 'dark' ao <html> e salvar a preferência
    useEffect(() => {
        const html = document.documentElement;
        if (isDarkMode) {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode(prev => !prev);
    };

    return (
        <button
            onClick={toggleTheme}
            aria-label="Alternar Modo Escuro/Claro"
            // Estilos para o botão
            className={`
                p-2 rounded-full transition-colors duration-300 
                bg-gray-200 dark:bg-gray-700
                text-gray-900 dark:text-yellow-300
                hover:bg-gray-300 dark:hover:bg-gray-600
            `}
        >
            {isDarkMode 
                ? <Sun className="w-5 h-5" /> 
                : <Moon className="w-5 h-5" />
            }
        </button>
    );
}