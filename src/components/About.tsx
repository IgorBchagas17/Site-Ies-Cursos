import { Users, Award, BookOpen, Clock, HeartHandshake, Target } from 'lucide-react';
// Import de 'motion' removido

export function About() {
  const features = [
    {
      icon: Users,
      title: 'Professores capacitados',
      description: 'Equipe experiente e qualificada para o melhor aprendizado'
    },
    {
      icon: Award,
      title: 'Certificado reconhecido',
      description: 'Certificação válida em todo território nacional'
    },
    {
      icon: BookOpen,
      title: 'Aulas práticas',
      description: 'Aprenda fazendo com exercícios reais do mercado'
    },
    {
      icon: Target,
      title: 'Material didático atualizado',
      description: 'Conteúdo sempre atualizado com as tendências do mercado'
    },
    {
      icon: HeartHandshake,
      title: 'Suporte ao aluno',
      description: 'Acompanhamento completo durante todo o curso'
    },
    {
      icon: Clock,
      title: 'Flexibilidade de horários',
      description: 'Turmas em diversos horários para sua comodidade'
    }
  ];

  return (
    // Fundo moderno: Cinza muito claro
    <section id="about" className="py-20 bg-gray-50"> 
      <div className="container mx-auto px-4">

        {/* Título / topo - Sem motion */}
        <div
          className="text-center mb-16"
        >
          <div>
            {/* Cor de destaque moderna */}
            <span className="text-[#E45B25] font-semibold text-lg">Diferenciais</span> 
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mt-2 mb-4">
              Por que estudar na IesCursos?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Oferecemos mais que cursos, oferecemos transformação profissional
            </p>
          </div>
        </div>

        {/* Grid de diferenciais */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            // Cards sem motion, com hover simples (mais cru)
            <div
              key={index}
              className="bg-white rounded-xl p-8 cursor-default transition-all duration-300 hover:shadow-2xl hover:scale-[1.02]"
            >
              {/* Ícone com cor de destaque moderna */}
              <div
                className="bg-[#E45B25] w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors duration-300"
              >
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* Bloco de números - Sem motion */}
        <div
          // Fundo escuro, moderno, sem gradiente
          className="mt-16 bg-gray-900 rounded-2xl p-12 text-white shadow-2xl" 
        >
          <div className="grid lg:grid-cols-3 gap-8 text-center">
            {/* Bloco de números simples, sem motion */}
            <div>
              <p className="text-5xl font-bold text-[#E45B25] mb-2">15+</p>
              <p className="text-xl">Anos de experiência</p>
            </div>

            <div>
              <p className="text-5xl font-bold text-[#E45B25] mb-2">5.000+</p>
              <p className="text-xl">Alunos formados</p>
            </div>

            <div>
              <p className="text-5xl font-bold text-[#E45B25] mb-2">98%</p>
              <p className="text-xl">Satisfação dos alunos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}