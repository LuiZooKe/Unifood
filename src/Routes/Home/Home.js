import React, { useState } from 'react';
import './css/elements.css';

import pratodecomida from './img/prato de comida.png';
import pastelImg from './img/pastel.png';
import logoUnifood from './img/logounifood.png';

import { useNavigate } from 'react-router-dom';
import Slider from "react-slick";
import { ModalCategoria } from './ModalCategoria.tsx';

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const carouselSettings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 1,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  arrows: false,
};

const carouselItems = [
  { img: pastelImg, alt: "Pastel delicioso", caption: "Pastel fresquinho!" },
  { img: pratodecomida, alt: "Prato de comida", caption: "Refeições completas!" },
  { img: logoUnifood, alt: "Logo Unifood", caption: "Sua melhor escolha em alimentos!" },
];

const produtosPorCategoria = {
  Jantinhas: [
    { nome: 'Jantinha de Frango', preco: 'R$15,00', imagem: pastelImg },
    { nome: 'Jantinha de Carne', preco: 'R$17,00', imagem: pastelImg },
    { nome: 'Jantinha de Carne', preco: 'R$17,00', imagem: pastelImg },
    { nome: 'Jantinha de Carne', preco: 'R$17,00', imagem: pastelImg },
    { nome: 'Jantinha de Carne', preco: 'R$17,00', imagem: pastelImg },
  ],
  Salgados: [
    { nome: 'Coxinha', preco: 'R$7,00', imagem: pastelImg },
    { nome: 'Pastel', preco: 'R$6,00', imagem: pastelImg },
  ],
  Bebidas: [
    { nome: 'Refrigerante 2L', preco: 'R$13,00', imagem: pastelImg },
    { nome: 'Água Mineral', preco: 'R$3,00', imagem: pastelImg },
  ],
  Sobremesas: [
    { nome: 'Pudim', preco: 'R$5,00', imagem: pastelImg },
    { nome: 'Mousse', preco: 'R$4,00', imagem: pastelImg },
  ],
};

function Home() {
  const navigate = useNavigate();

  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');

  const abrirModal = (categoria) => {
    setCategoriaSelecionada(categoria);
    setModalAberto(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  return (
    <div>
      <input id="close-menu" className="close-menu" type="checkbox" aria-label="Close menu" role="button" />
      <label className="close-menu-label" htmlFor="close-menu" title="close menu"></label>

      <aside className="menu white-bg">
        <div className="h-[150px] main-content menu-content">
          <h1 onClick={() => (document.getElementById('close-menu').checked = false)}>
            <div className="logo">
              <a href="#home"><img src={logoUnifood} alt="unifood" /></a>
            </div>
          </h1>
          <nav>
            <ul onClick={() => (document.getElementById('close-menu').checked = false)}>
              <li><a href="#gallery">Cardápio 🍴</a></li>
              {/* <li><a href="#pricing">Preços</a></li> */}
              <li><a href="#contact">Contato 📞</a></li>
              <li><a href="/saibamais">Saiba Mais ℹ️</a></li>
              <li><a href="#">Carrinho 🛒</a></li>
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

      <section id="gallery" className="white-bg section">
        <div className="main-content max-w-6xl mx-auto px-4 text-center">
          <h2 className="grid-main-heading">NOSSO CARDÁPIO</h2>

          <div className="relative w-full h-[200px] md:h-[250px] lg:h-[280px] mx-auto rounded-2xl overflow-hidden shadow-xl mb-16">
            <Slider {...carouselSettings}>
              {carouselItems.map((item, index) => (
                <div key={index} className="w-full">
                  <div className="relative w-full h-full">
                    <img src={item.img} alt={item.alt} className="w-full h-full object-cover rounded-2xl" />
                    {item.caption && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white p-3 text-sm md:text-base">
                        <p className="font-medium">{item.caption}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </Slider>
          </div>

          <h3 className="text-2xl font-bold text-gray-800 mb-6">Categorias</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.keys(produtosPorCategoria).map((categoria, i) => (
              <div
                key={i}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                onClick={() => abrirModal(categoria)}
              >
                <img
                  src={pastelImg}
                  alt={categoria}
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-50 w-full py-3 text-white text-xl font-semibold">
                  {categoria}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section id="pricing" className="white-bg section">
        <div className="main-content top3-content">
          <h2 className="grid-main-heading">TABELA DE PREÇOS</h2>
          <div className="tables-wrapper">
            <div className="responsive-table">
              <table>
                <thead>
                  <tr><th>Produto</th><th>Preço</th></tr>
                </thead>
                <tbody>
                  <tr><td>Jantinha</td><td>R$15,00</td></tr>
                  <tr><td>Jantinha</td><td>R$15,00</td></tr>
                  <tr><td>Jantinha</td><td>R$15,00</td></tr>
                  <tr><td>Jantinha</td><td>R$15,00</td></tr>
                  <tr><td>Jantinha</td><td>R$15,00</td></tr>
                  <tr><td>Jantinha</td><td>R$15,00</td></tr>
                </tbody>
                <tfoot><tr><td>COMIDAS</td><td></td></tr></tfoot>
              </table>
            </div>
            <div className="responsive-table">
              <table>
                <thead>
                  <tr><th>Produto</th><th>Preço</th></tr>
                </thead>
                <tbody>
                  <tr><td>Refrigerante 2L</td><td>R$13,00</td></tr>
                  <tr><td>Refrigerante 2L</td><td>R$13,00</td></tr>
                  <tr><td>Refrigerante 2L</td><td>R$13,00</td></tr>
                  <tr><td>Refrigerante 2L</td><td>R$13,00</td></tr>
                  <tr><td>Refrigerante 2L</td><td>R$13,00</td></tr>
                  <tr><td>Refrigerante 2L</td><td>R$13,00</td></tr>
                </tbody>
                <tfoot><tr><td>CONSUMÍVEIS</td><td></td></tr></tfoot>
              </table>
            </div>
          </div>
        </div>
      </section> */}

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

      <ModalCategoria
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        categoria={categoriaSelecionada}
        produtos={produtosPorCategoria[categoriaSelecionada] || []}
      />
    </div>
  );
}

export default Home;