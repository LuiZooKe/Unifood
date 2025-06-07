import React from 'react';
import './css/elements.css';

import logoUnifood from './img/logounifood.png';
import logoUniFUCAMP from './img/logoUNIFUCAMP.png';
import icone from './img/ícone.png';
import pratodecomida from './img/prato de comida.png';

import { useNavigate } from 'react-router-dom';

function SaibaMais() {
  const navigate = useNavigate();

  const handleVoltar = () => {
    navigate('/');
  };

  return (
    <div>
      {/* MENU SUPERIOR */}
      <aside className="menu white-bg">
        <div className="h-[150px] main-content menu-content">
          <h1>
            <div className="logo" style={{ cursor: 'pointer' }} onClick={handleVoltar}>
              <img src={logoUnifood} alt="unifood" />
            </div>
          </h1>
          <nav>
            <ul>
              <li>
                <button
                  onClick={handleVoltar}
                  className="m-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full"
                >
                  Voltar ao Site
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* CONTEÚDO PRINCIPAL */}
      <section id="intro" className="intro main-bg section">
        <div className="main-content intro-content">
          <div className="intro-text-content">
            <h2 className="grid-main-heading">
              Conheça a Unifood!
              <img
                src={icone}
                alt="ícone"
                className="inline-block ml-2 w-[80px] align-middle"
              />
            </h2>
            <p>Menos filas, mais tempo pra você. Uma nova experiência no seu dia a dia acadêmico.</p>
            <p>Faça recargas de onde quiser, acesse o cardápio do dia e muito mais.</p>
            <p>Um sistema moderno, pensado para quem não pode perder tempo — e merece qualidade em cada detalhe.</p>
          </div>
          <div className="intro-img">
            <img src={pratodecomida} alt="prato de comida" />
          </div>
        </div>
      </section>
    </div>
  );
}

export default SaibaMais;
