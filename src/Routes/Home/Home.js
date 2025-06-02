import React from 'react';
import './css/classes.css';
import './css/elements.css';
import './css/menu.css';
import './css/styles.css';
import './css/variables.css';

import breakfastImg from './img/breakfast-not-optimized.svg';
import pastelImg from './img/pastel.png';
import logoUnifood from './img/logounifood.png';

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
        <div className="main-content menu-content">
          <h1 onClick={() => (document.getElementById('close-menu').checked = false)}>
            <div className="logo">
              <a href="#home"><img src={logoUnifood} alt="unifood" /></a>
            </div>
          </h1>
          <nav>
            <ul onClick={() => (document.getElementById('close-menu').checked = false)}>
              <li><a href="#intro">Intro</a></li>
              <li><a href="#gallery">Cardápio</a></li>
              <li><a href="#pricing">Preços</a></li>
              <li><a href="#contact">Contato</a></li>
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

      <section id="intro" className="intro main-bg section">
        <div className="main-content intro-content">
          <div className="intro-text-content">
            <h2 className="grid-main-heading">Conheça o Unifood!</h2>
            <p>
              Menos filas, mais tempo pra você. Uma nova experiência no seu dia a dia acadêmico.
              Desenvolvido especialmente para a comunidade universitária, o Unifood integra tecnologia e praticidade para tornar a alimentação no campus mais rápida, organizada e acessível.
            </p>
            <br/>
            <p>
              Faça recargas de onde quiser, acesse o cardápio do dia e muito mais.
            </p>
            <br/>
            <p>
              Um sistema moderno, pensado para quem não pode perder tempo — e merece qualidade em cada detalhe.
            </p>
          </div>
          <div className="intro-img">
            <img src={breakfastImg} alt="desenho de três pessoas" />
          </div>
        </div>
      </section>

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
          <h2 className="grid-main-heading">pricing</h2>
          <p>...</p>
          <div className="responsive-table">
            <table>
              <caption className="grid-main-heading">Pricing Table</caption>
              <thead>
                <tr>
                  <th>Title 1</th><th>Title 2</th><th>Title 3</th><th>Title 4</th><th>Title 5</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i}>
                    <td>Content 1</td><td>Content 2</td><td>Content 3</td><td>Content 2</td><td>Content 3</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr><td></td><td></td><td></td><td></td><td>Testando</td></tr>
              </tfoot>
            </table>
          </div>
        </div>
      </section>

      <section id="contact" className="intro main-bg section">
        <div className="main-content intro-content">
          <div className="intro-text-content">
            <h2 className="grid-main-heading">EM CASO DE DÚVIDAS, NOS CONTATE</h2>
          </div>
          <div className="intro-img">
            <img src={breakfastImg} alt="desenho de três pessoas" />
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

      <footer id="footer" className="footer white-bg">

      </footer>
      <button className="back-to-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>➔</button>
    </div>
  );
}

export default Home;
