import React from 'react';
import './css/elements.css'; // Seu CSS original

import logoUnifood from './img/logounifood.png';
import icone from './img/ícone.png';
import pratodecomida from './img/prato de comida.png';
import louis from './img/louis.jpg';
import tanam from './img/tanam.jpg';
import betin from './img/betin.jpg';

// import fotoProprietaria from './img/foto-proprietaria.png'; // Exemplo


import { useNavigate } from 'react-router-dom';

function SaibaMais() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate('/');
  };

  return (
    <div>
      {/* MENU SUPERIOR - Ajustado para o seu CSS */}
      <aside className="menu white-bg"> {/* Seu CSS já define a cor do menu */}
        <div className="main-content menu-content"> {/* Seu CSS já define display flex etc. */}
          <h1>
            <div className="logo" style={{ cursor: 'pointer' }} onClick={handleVoltar}>
              <img src={logoUnifood} alt="Logo Unifood" /> {/* Seu CSS já define o tamanho do .logo */}
            </div>
          </h1>
          <nav>
            <ul>
              <li>
                {/* Mantendo o botão com classes Tailwind, mas focando em estilos mais discretos */}
                <button
                  onClick={handleVoltar}
                  className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200 ease-in-out" // Ajuste de transição
                >
                  Voltar ao Site
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL - Conheça a Unifood! */}
      <section id="intro" className="intro main-bg section">
        <div className="main-content intro-content"> {/* Utiliza seu grid intro-content */}
          <div className="intro-text-content">
            <h2 className="grid-main-heading"> {/* Seu CSS já define o tamanho do h2 */}
              Conheça a Unifood!
              <img
                src={icone}
                alt="Ícone Unifood"
                className="inline-block ml-4 w-[70px] h-[70px] align-middle" // Ajuste de tamanho do ícone para ficar proporcional
              />
            </h2>
            <p>Menos filas, mais tempo pra você. Uma nova experiência no seu dia a dia acadêmico.</p>
            <p>Faça recargas de onde quiser, acesse o cardápio do dia e muito mais.</p>
            <p>Um sistema moderno, pensado para quem não pode perder tempo — e merece qualidade em cada detalhe.</p>
          </div>
          <div className="intro-img">
            <img src={pratodecomida} alt="Prato de comida" className="rounded-lg shadow-md" /> {/* Leve sombra e borda arredondada */}
          </div>
        </div>
      </section>

      ---

      {/* SEÇÃO SOBRE A PROPRIETÁRIA */}
      <section id="proprietaria" className="white-bg section">
        <div className="main-content grid grid-cols-1 md:grid-cols-2 gap-12 items-center"> {/* Utiliza o grid para layout */}
          <div className="flex justify-center md:justify-start">
            {/* Imagem da proprietária - Use uma imagem de alta qualidade e com fundo neutro */}
            {/* <img src={fotoProprietaria} alt="Foto da Proprietária" className="rounded-full w-80 h-80 object-cover border border-gray-300 shadow-lg" /> */}
            <div className="rounded-full w-[400px] h-[400px] bg-gray-200 flex items-center justify-center text-gray-600 text-base border border-gray-300 shadow-lg">
              <span className="text-center">Foto da Proprietária<br />(80x80)</span>
            </div>
          </div>
          <div>
            <h2 className="grid-main-heading mb-8">A Proprietária</h2>
            <p>
              Conheça **[Nome da Proprietária]**, a cabeça por trás da Unifood. Que somando sua vasta experiência em comida, sempre preza pela qualidade de seus serviços, oferecendo assim, uma melhor experiência de seus clientes no ambiente acadêmico.
            </p>
            <br />
            <p>
              Sua dedicação incansável e compromisso com a excelência são os pilares que sustentam nossa plataforma, garantindo que cada interação seja fluida, eficiente e de alta qualidade.
            </p>
          </div>
        </div>
      </section>

      ---

      {/* SEÇÃO SOBRE A EQUIPE DE DESENVOLVIMENTO */}
      <section id="equipe" className="main-bg section">
        <div className="main-content">
          <h2 className="grid-main-heading text-white text-center mb-16">Nossa Equipe de Inovação</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4" style={{ gap: 'var(--gap)' }}>

            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center min-h-[400px]">
              <div className="mx-auto rounded-full w-80 h-80 bg-gray-200 flex items-center justify-center text-gray-600 text-base mb-4 border border-gray-200">
                <img src={betin} className="mx-auto rounded-full w-80 h-80 object-cover mb-4 border border-gray-200"></img>
              </div>
              <div className="flex flex-col justify-start w-full min-h-[90px]">
                <h3 className="text-xl font-bold mb-1 text-gray-800 break-words leading-tight">Humberto G. Silva</h3>
                <p className="text-red-600 font-bold text-[18px]">UI/UX Designer</p>
              </div>
              <p className="text-gray-600 font-bold text-[15px] leading-relaxed text-justify px-2 mt-10">Especialista em interfaces intuitivas, trazendo a beleza e funcionalidade para a Unifood.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center min-h-[400px]">
              <div className="mx-auto rounded-full w-80 h-80 bg-gray-200 flex items-center justify-center text-gray-600 text-base mb-4 border border-gray-200">
                <img src={tanam} className="mx-auto rounded-full w-80 h-80 object-cover mb-4 border border-gray-200"></img>
              </div>
              <div className="flex flex-col justify-start w-full min-h-[90px]">
                <h3 className="text-xl font-bold mb-1 text-gray-800 break-words leading-tight">Nathan M. Pádua</h3>
                <p className="text-red-600 font-bold text-[18px]">Desenvolvedor Front-end</p>
              </div>
              <p className="text-gray-600 font-bold text-[15px] leading-relaxed text-justify px-2 mt-10">Cria experiências intuitivas e visualmente atraentes para todos os usuários.</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center min-h-[400px]">
              <div className="mx-auto rounded-full w-80 h-80 bg-gray-200 flex items-center justify-center text-gray-600 text-base mb-4 border border-gray-200">
                <img src={louis} className="mx-auto rounded-full w-80 h-80 object-cover mb-4 border border-gray-200"></img>
              </div>
              <div className="flex flex-col justify-start w-full min-h-[90px]">
                <h3 className="text-xl font-bold mb-1 text-gray-800 break-words leading-tight">Luiz Gustavo Dias</h3>
                <p className="text-red-600 font-bold text-[18px]">Desenvolvedor Back-end</p> {/* AQUI: text-base -> text-lg */}
              </div>
              <p className="text-gray-600 font-bold text-[15px] leading-relaxed text-justify px-2 mt-10">Arquiteto de sistemas robustos, garantindo a performance e segurança da plataforma.</p> {/* AQUI: text-sm -> text-base */}
            </div>

            {/* Card para Prof. Luiz Gustavo */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center min-h-[400px]">
              <div className="mx-auto rounded-full w-80 h-80 bg-gray-200 flex items-center justify-center text-gray-600 text-base mb-4 border border-gray-200">
                <span>Foto do Professor<br /></span>
                {/* <img src={tanam} className="mx-auto rounded-full w-80 h-80 object-cover mb-4 border border-gray-200"></img> */}
              </div>
              <div className="flex flex-col justify-start w-full min-h-[90px]">
                <h3 className="text-xl font-bold mb-1 text-gray-800 break-words leading-tight">Prof. Luiz Gustavo</h3>
                <p className="text-red-600 font-bold text-[18px]">Gerente de Projeto</p> {/* AQUI: text-base -> text-lg */}
              </div>
              <p className="text-gray-600 font-bold text-[15px] leading-relaxed text-justify px-2 mt-10">Líder estratégico que guia a equipe rumo ao sucesso, garantindo a entrega e qualidade.</p> {/* AQUI: text-sm -> text-base */}
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}

export default SaibaMais;