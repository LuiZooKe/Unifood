import React from 'react';
import './css/elements.css';
// import './css/classes.css';
// import './css/menu.css';
// import './css/styles.css';
// import './css/variables.css';

import pratodecomida from './img/prato de comida.png';
import pastelImg from './img/pastel.png';
import logoUnifood from './img/logounifood.png';
import icone from './img/ícone.png'

import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  return (
    <div>
      <input
        id="close-menu"
        className="close-menu"
        type="checkbox"
        aria-label="Close menu"
        role="button"
      />
      <label
        className="close-menu-label"
        htmlFor="close-menu"
        title="close menu"
      ></label>

      <aside className="menu white-bg">
        <div className="h-[150px] main-content menu-content">
          <h1 onClick={() => (document.getElementById('close-menu').checked = false)}>
            <div className="logo">
              <a href="#home"><img src={logoUnifood} alt="unifood" /></a>
            </div>
          </h1>
          <nav>
            <ul onClick={() => (document.getElementById('close-menu').checked = false)}>
              <li><a href="#gallery">Cardápio</a></li>
              <li><a href="#pricing">Preços</a></li>
              <li><a href="#contact">Contato</a></li>
              <li><a href="/saibamais">Saiba Mais</a></li>
              <button
                onClick={handleLogout}
                className="m-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full"
              >
                Sair
              </button>

            </ul>
          </nav>
        </div>
      </aside>

      <div className="menu-spacing"></div>

      <section id="gallery" className="grid-one white-bg section">
        <div className="main-content grid-one-content">
          <h2 className="grid-main-heading">Cardápio</h2>
          <p className="grid-description">Conheça nossa comida</p>
          <div className="grid">
            {[...Array(6)].map((_, i) => (
              <div className="gallery-img" key={i}>
                <img src={pastelImg} alt="pastel" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="white-bg section">
        <div className="main-content top3-content">
          <h2 className="grid-main-heading">TABELA DE PREÇOS</h2>
          <div className="tables-wrapper">
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th><th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Jantinha</td><td>R$15,00</td>
                  </tr>
                  <tr>
                    <td>Jantinha</td><td>R$15,00</td>
                  </tr>
                  <tr>
                    <td>Jantinha</td><td>R$15,00</td>
                  </tr>
                  <tr>
                    <td>Jantinha</td><td>R$15,00</td>
                  </tr>
                  <tr>
                    <td>Jantinha</td><td>R$15,00</td>
                  </tr>
                  <tr>
                    <td>Jantinha</td><td>R$15,00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr><td>COMIDAS</td><td></td></tr>
                </tfoot>
              </table>
            </div>
            <div className="responsive-table">
              <table>
                <thead>
                  <tr>
                    <th>Produto</th><th>Preço</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Refrigerante 2L</td><td>R$13,00</td>
                  </tr>
                  <tr>
                    <td>Refrigerante 2L</td><td>R$13,00</td>
                  </tr>
                  <tr>
                    <td>Refrigerante 2L</td><td>R$13,00</td>
                  </tr>
                  <tr>
                    <td>Refrigerante 2L</td><td>R$13,00</td>
                  </tr>
                  <tr>
                    <td>Refrigerante 2L</td><td>R$13,00</td>
                  </tr>
                  <tr>
                    <td>Refrigerante 2L</td><td>R$13,00</td>
                  </tr>
                </tbody>
                <tfoot>
                  <tr><td>CONSUMÍVEIS</td><td></td></tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="intro main-bg section">
        <div className="main-content intro-content">
          <div className="intro-text-content">
            <h2 className="grid-main-heading">EM CASO DE DÚVIDAS, NOS CONTATE</h2>
          </div>
          <div className="intro-img">
            <img src={pratodecomida} alt="prato de comida" />
          </div>

          <div className="contact-form">
            <fieldset className="form-grid">
              <div className="form-group">
                <label htmlFor="first-name">NOME COMPLETO</label>
                <input type="text" name="first-name" id="first-name" placeholder="Digite seu nome completo aqui" />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-MAIL</label>
                <input type="email" name="email" id="email" placeholder="Digite seu e-mail de contato aqui" />
              </div>
              <div className="form-group full-width">
                <label htmlFor="message">MENSAGEM</label>
                <textarea name="message" id="message" cols="30" rows="10" placeholder="Digite aqui sua dúvida, reclamação ou elogio "></textarea>
              </div>
              <div className="form-group full-width">
                <button type="submit">ENVIAR MENSAGEM</button>
              </div>
            </fieldset>
          </div>
        </div>
      </section>
      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>➔</button>
    </div>
  );
}

export default Home;
