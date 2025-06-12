import React from 'react';
import './css/elements.css';
import logoUnifood from './img/logounifood.png';
import icone from './img/ícone.png';
import pratodecomida from './img/prato de comida.png';
import louis from './img/louis.jpg';
import tanam from './img/tanam.jpg';
import betin from './img/betin.jpg';
import { useNavigate } from 'react-router-dom';

function SaibaMais() {
  const navigate = useNavigate();
  const handleVoltar = () => navigate('/');

  return (
    <div className="overflow-x-hidden text-[1.5rem] sm:text-[1.6rem] md:text-[1.7rem] leading-relaxed">
      {/* MENU SUPERIOR */}
      <aside className="menu white-bg w-full sticky top-0 z-50 shadow-md">
        <div className="main-content menu-content flex items-center justify-between px-4 py-2 h-[8rem]">
          <div className="logo cursor-pointer" onClick={handleVoltar}>
            <img src={logoUnifood} alt="Logo Unifood" className="h-[14rem] w-auto object-contain min-w-[180px]" />
          </div>
          <button
            onClick={handleVoltar}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-200"
          >
            Voltar ao Site
          </button>
        </div>
      </aside>

      {/* INTRO */}
      <section id="intro" className="intro main-bg section py-12 px-4">
        <div className="main-content flex flex-col-reverse md:grid md:grid-cols-2 gap-8 items-center">
          <div className="intro-text-content text-white text-center">
            <h2 className="text-center break-words text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
              Conheça a Unifood!
              <img
                src={icone}
                alt="Ícone Unifood"
                className="inline-block ml-4 w-[60px] md:w-[70px] h-auto align-middle"
              />
            </h2>
            <p className="mb-3 text-[2.6rem] text-center uppercase font-extrabold">Menos filas, mais tempo pra você. Uma nova experiência no seu dia a dia acadêmico.</p>
            <br></br>
            <p className="text-[2.6rem] text-center uppercase font-extrabold">Um sistema moderno, pensado para quem não pode perder tempo — e merece qualidade em cada detalhe.</p>
          </div>
          <div className="intro-img flex justify-center">
            <img src={pratodecomida} alt="Prato de comida" className="w-full max-w-[400px] h-auto rounded-lg shadow-md" />
          </div>
        </div>
      </section>

      {/* PROPRIETÁRIA */}
      <section id="proprietaria" className="white-bg section py-12 px-4">
        <div className="main-content grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            <div className="rounded-full w-[70vw] max-w-[320px] h-[70vw] max-h-[320px] bg-gray-200 flex items-center justify-center text-gray-600 border border-gray-300 shadow-lg">
              <span className="text-center text-lg">Foto da Proprietária<br />(80x80)</span>
            </div>
          </div>
          <div className="text-justify">
            <h2 className="text-center break-words text-4xl sm:text-5xl md:text-6xl font-bold mb-8 leading-tight">
              <span>DIREÇÃO</span>
            </h2>
            <p>
              Conheça <strong>[Nome da Proprietária]</strong>, a mente por trás da Unifood. Com uma sólida experiência no setor de alimentação, ela lidera com paixão e excelência, assegurando que cada cliente desfrute de um atendimento de qualidade e de refeições cuidadosamente preparadas.
            </p>
            <p className="mt-4">
              Sua dedicação à inovação e seu olhar atento aos detalhes impulsionam nossa missão de transformar a rotina acadêmica em uma experiência mais prática, moderna e prazerosa.
            </p>
          </div>
        </div>
      </section>

      {/* EQUIPE */}
      <section id="equipe" className="main-bg section py-12 px-4">
        <div className="main-content">
          <h2 className="text-center break-words text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            <span>Nossa Equipe de Inovação</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[{
              nome: "Humberto G. Silva",
              funcao: "UI/UX DESIGNER",
              descricao: "Responsável por planejar e desenhar a experiência e a interface do usuário, garantindo que a aplicação seja amigável e visualmente atraente para os clientes.",
              imagem: betin
            }, {
              nome: "Nathan M. Pádua",
              funcao: "DESENVOLVEDOR FRONT-END",
              descricao: "Transforma os designs em código-fonte, construindo a parte da aplicação com a qual o usuário interage diretamente no navegador, deixando o site intuitivo e funcional.",
              imagem: tanam
            }, {
              nome: "Luiz Gustavo Dias",
              funcao: "DESENVOLVEDOR BACK-END",
              descricao: "Desenvolve a lógica e a estrutura que operam os sistemas por trás das aplicações, garantindo o processamento de dados e a segurança da plataforma.",
              imagem: louis
            }].map((pessoa, i) => (
              <div key={i} className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center w-full">
                <div className="w-50 h-50 sm:w-60 sm:h-60 rounded-full overflow-hidden border border-gray-300">
                  <img src={pessoa.imagem} alt={pessoa.nome} className="w-full h-full object-cover" />
                </div>
                <div className="mt-4">
                  <h3 className="font-bold text-gray-800 leading-tight text-3xl md:text-5xl">{pessoa.nome}</h3>
                  <p className="text-red-600 font-extrabold text-lg md:text-xl text-center">{pessoa.funcao}</p>
                </div>
                <p className="text-gray-600 font-medium mt-4 leading-relaxed text-center text-lg md:text-xl">
                  {pessoa.descricao}
                </p>
              </div>
            ))}

            <div className="bg-white p-6 rounded-lg shadow-md text-center flex flex-col items-center w-full">
              <div className="w-50 h-50 sm:w-60 sm:h-60 rounded-full bg-gray-200 flex items-center justify-center border border-gray-300">
                <span className="text-gray-600 text-center">Foto do Professor</span>
              </div>
              <div className="mt-4">
                <h3 className="font-bold text-gray-800 text-3xl md:text-5xl">Prof. Luiz Gustavo</h3>
                <p className="text-red-600 font-extrabold text-lg md:text-xl text-center">GERENTE DE PROJETO</p>
              </div>
              <p className="text-gray-600 font-medium mt-4 leading-relaxed text-center text-lg md:text-xl">
                Líder estratégico e mentor da equipe, o professor Luiz Gustavo orienta cada etapa do projeto com sabedoria, assegurando o cumprimento de prazos e o alto padrão de qualidade.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Botão de voltar ao topo */}
      <button
        className="back-to-top z-[990]"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ➔
      </button>
    </div>
  );
}

export default SaibaMais;
