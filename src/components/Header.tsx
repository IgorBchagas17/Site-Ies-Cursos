// src/components/Header.tsx

import { useState, useEffect } from "react";
import { Menu, X, ChevronDown, Camera, Home, Info, Phone } from "lucide-react"; // Adicionei ícones para estética mobile
import { useNavigate, useLocation } from "react-router-dom";
import logo from "./img/logo-ies-not-background-2.png"; 

export function Header() {
    const navigate = useNavigate();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isCoursesDropdownOpen, setIsCoursesDropdownOpen] = useState(false);
    const [hidden, setHidden] = useState(false);

    // Cor de Destaque
    const ACCENT_COLOR = "#ff5722"; // Laranja
    
    // DADOS WHATSAPP (Ajustados para o número e mensagem padrão)
    const WHATSAPP_NUMBER = "5538988630487"; 
    const WHATSAPP_MESSAGE = "Olá, gostaria de iniciar minha matrícula na Ies Cursos"; 
    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;


    // Lógica para esconder o header ao rolar (MANTIDA)
    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            if (window.scrollY > 200) {
                if (window.scrollY > lastScrollY) {
                    setHidden(true);
                } else {
                    setHidden(false);
                }
            } else {
                setHidden(false);
            }
            lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Trava o scroll do body quando o menu está aberto (melhor UX mobile)
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflowY = 'hidden';
        } else {
            document.body.style.overflowY = 'auto';
        }
        return () => {
            document.body.style.overflowY = 'auto';
        };
    }, [isMenuOpen]);


    // Função centralizada de Scroll/Navegação (MANTIDA)
    const scrollToSection = (id: string, path = "/") => {
        if (location.pathname !== path) {
            navigate(path);
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: "smooth" });
            }, 150);
        } else {
            const el = document.getElementById(id);
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
        // Fecha menus após a ação
        setIsMenuOpen(false);
        setIsCoursesDropdownOpen(false);
    };

    const goToMoments = () => {
        navigate("/momentos");
        setIsMenuOpen(false);
        setIsCoursesDropdownOpen(false);
    };
    
    // NOVA FUNÇÃO: Redireciona para o WhatsApp
    const handleMatriculeClick = () => {
        window.open(whatsappUrl, '_blank');
        setIsMenuOpen(false);
        setIsCoursesDropdownOpen(false);
    };

    // Opções do Dropdown de Cursos
    const courseOptions = [
        { label: "Cursos Presenciais", action: () => scrollToSection("courses") },
        { label: "Cursos EAD", action: () => scrollToSection("ead-courses") },
        { label: "Ver Todos os Cursos", action: () => scrollToSection("courses", "/cursos") },
    ];


    return (
        <header
            className={`fixed top-0 z-50 w-full transition-transform duration-300 shadow-xl ${
                hidden ? "transform -translate-y-full" : "transform translate-y-0"
            } bg-black text-white`}
        >
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16 lg:h-20"> 
                    {/* Logo */}
                    <div 
                        onClick={() => scrollToSection("hero")} 
                        className="flex items-center gap-2 cursor-pointer transition-opacity hover:opacity-80"
                    >
                        <img src={logo} alt="Logo IesCursos" className="h-8 lg:h-10 w-auto" />
                    </div>

                    {/* Navegação Desktop (MANTIDA) */}
                    <nav className="hidden lg:flex items-center space-x-6 text-sm font-medium">
                        <button
                            onClick={() => scrollToSection("hero")}
                            className={`py-2 hover:text-[${ACCENT_COLOR}] transition-colors`}
                        >
                            Início
                        </button>

                        {/* === MENU DROPDOWN DE CURSOS === */}
                        <div 
                            className="relative"
                            onMouseEnter={() => setIsCoursesDropdownOpen(true)}
                            onMouseLeave={() => setIsCoursesDropdownOpen(false)}
                        >
                            {/* Botão Principal Cursos */}
                            <button
                                className={`py-2 flex items-center gap-1 hover:text-[${ACCENT_COLOR}] transition-colors`}
                            >
                                Cursos <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isCoursesDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>

                            {/* Dropdown Content */}
                            {isCoursesDropdownOpen && (
                                <div 
                                    className="absolute top-full left-1/2 transform -translate-x-1/2 w-56 bg-white rounded-lg shadow-xl overflow-hidden z-50 border border-gray-100"
                                >
                                    {courseOptions.map((option, index) => (
                                        <button
                                            key={index}
                                            onClick={option.action}
                                            className={`block w-full text-left px-4 py-3 text-sm text-gray-800 hover:bg-gray-100 hover:text-[${ACCENT_COLOR}] transition-colors`}
                                        >
                                            {option.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        {/* === FIM DO DROPDOWN === */}
                        
                        <button
                            onClick={goToMoments}
                            className={`py-2 hover:text-[${ACCENT_COLOR}] transition-colors flex items-center gap-1`}
                        >
                            <Camera className="w-4 h-4" /> Momentos
                        </button>

                        <button
                            onClick={() => scrollToSection("about")}
                            className={`py-2 hover:text-[${ACCENT_COLOR}] transition-colors`}
                        >
                            Sobre a IesCursos
                        </button>

                        <button
                            onClick={() => scrollToSection("contact")}
                            className={`py-2 hover:text-[${ACCENT_COLOR}] transition-colors`}
                        >
                            Fale Conosco
                        </button>

                        {/* BOTÃO MATRICULE-SE: AGORA REDIRECIONA PARA O WHATSAPP */}
                        <button
                            onClick={handleMatriculeClick}
                            className={`bg-[${ACCENT_COLOR}] py-2.5 px-6 rounded-full font-bold text-white transition-colors hover:bg-[#d66a1f] shadow-lg`}
                        >
                            Matricule-se
                        </button>
                    </nav>

                    {/* Mobile Menu Icon */}
                    <div className="lg:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
                        </button>
                    </div>
                </div>

                {/* === MENU MOBILE APRIMORADO === */}
                <div
                    // Ajuste de Altura para tela cheia e barra de rolagem
                    className={`fixed top-16 left-0 w-full h-[calc(100vh-64px)] overflow-y-auto lg:hidden 
                        transition-transform duration-300 ease-in-out bg-black shadow-2xl ${
                        isMenuOpen ? "translate-x-0" : "translate-x-full" // Desliza da direita para esquerda
                    }`}
                >
                    <div className="px-6 py-6 space-y-4">
                        
                        {/* 1. INÍCIO */}
                        <button 
                            onClick={() => scrollToSection("hero")} 
                            className="flex items-center gap-3 w-full py-3 text-lg font-semibold text-white hover:text-[#F27A24] transition-colors border-b border-white/10"
                        >
                            <Home className="w-6 h-6" /> Início
                        </button>

                        {/* 2. CURSOS (Agrupado com Dropdown Style) */}
                        <div className="border-b border-white/10 pb-4">
                             <button
                                onClick={() => setIsCoursesDropdownOpen(!isCoursesDropdownOpen)}
                                className={`flex justify-between items-center w-full py-3 text-lg font-semibold text-white hover:text-[#F27A24] transition-colors`}
                            >
                                Cursos <ChevronDown className={`w-5 h-5 transition-transform duration-200 ${isCoursesDropdownOpen ? 'rotate-180' : 'rotate-0'}`} />
                            </button>
                            {/* Sub-itens de Cursos */}
                            <div 
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${isCoursesDropdownOpen ? "max-h-60 pt-2" : "max-h-0"}`}
                            >
                                {courseOptions.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={option.action}
                                        className="block w-full text-left pl-6 py-2 text-base text-gray-300 hover:text-[#F27A24] transition-colors"
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 3. MOMENTOS */}
                        <button
                            onClick={goToMoments}
                            className={`flex items-center gap-3 w-full py-3 text-lg font-semibold text-white hover:text-[#F27A24] transition-colors border-b border-white/10`} 
                        >
                            <Camera className="w-6 h-6" /> Momentos
                        </button>
                        
                        {/* 4. SOBRE */}
                        <button 
                            onClick={() => scrollToSection("about")} 
                            className="flex items-center gap-3 w-full py-3 text-lg font-semibold text-white hover:text-[#F27A24] transition-colors border-b border-white/10"
                        >
                            <Info className="w-6 h-6" /> Sobre a IesCursos
                        </button>

                        {/* 5. CONTATO */}
                        <button 
                            onClick={() => scrollToSection("contact")} 
                            className="flex items-center gap-3 w-full py-3 text-lg font-semibold text-white hover:text-[#F27A24] transition-colors border-b border-white/10"
                        >
                            <Phone className="w-6 h-6" /> Fale Conosco
                        </button>

                        {/* BOTÃO MATRICULE-SE (Destaque final) */}
                        <div className="pt-6">
                            <button
                                onClick={handleMatriculeClick}
                                className={`bg-[${ACCENT_COLOR}] w-full py-3 rounded-xl font-extrabold text-white text-lg transition-colors hover:bg-[#d66a1f] shadow-lg`} 
                            >
                                Falar com um Consultor
                            </button>
                        </div>
                    </div>
                    {/* Linha de preenchimento para garantir que o scroll funcione bem */}
                    <div className="h-12 w-full"></div> 
                </div>
            </div>
        </header>
    );
}