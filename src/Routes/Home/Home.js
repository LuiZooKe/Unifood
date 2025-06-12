import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import logoUnifood from './img/logounifood.png';
import fundocardapio from './img/fundo-cardapio.png';
import pratodecomida from './img/prato de comida.png';

import { ModalCategoria } from './ModalCategoria.tsx';
import './css/elements.css';

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

function Home() {
  const navigate = useNavigate();
  const [modalAberto, setModalAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
  const [imagensCarrossel, setImagensCarrossel] = useState([]);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  const abrirModal = (categoria) => {
    setCategoriaSelecionada(categoria);
    setModalAberto(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  useEffect(() => {
    const fetchProdutos = async () => {
      try {
        const res = await fetch(
          'http://localhost/UNIFOOD/database/produtos.php?action=listar'
        );
        const data = await res.json();

        if (data.success) {
          const agrupado = {};
          const imagens = [];

          data.produtos.forEach((produto) => {
            const imagemURL = `http://localhost/UNIFOOD/database/imgProdutos/${produto.imagem}`;

            if (!agrupado[produto.categoria]) {
              agrupado[produto.categoria] = [];
            }
            agrupado[produto.categoria].push({
              nome: produto.nome,
              preco: `R$ ${parseFloat(produto.preco).toFixed(2)}`,
              imagem: imagemURL,
              descricao: produto.descricao || '',
            });

            if (produto.imagem && produto.nome) {
              imagens.push({
                img: imagemURL,
                alt: produto.nome,
                caption: produto.nome,
              });
            }
          });

          setProdutosPorCategoria(agrupado);
          setImagensCarrossel(imagens);
        } else {
          console.error('Erro ao carregar produtos:', data.message);
        }
      } catch (err) {
        console.error('Erro de rede ou ao carregar produtos:', err);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div>
      {/* Botão de menu mobile */}
      <div className="fixed top-4 right-4 z-[1000] md:hidden">
        <button
          onClick={() => setMenuMobileAberto(!menuMobileAberto)}
          className="p-2 rounded bg-gray-800 text-white shadow-lg"
        >
          ☰
        </button>
      </div>

      {/* Menu lateral mobile */}
      {menuMobileAberto && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 z-[999] flex flex-col items-center justify-center md:hidden">
          <div className="bg-white rounded-2xl shadow-2xl p-8 w-11/12 max-w-md text-center">
            <nav>
              <ul className="space-y-4 text-lg font-semibold">
                <li>
                  <a href="#gallery" onClick={() => setMenuMobileAberto(false)}>
                    Cardápio 🍴
                  </a>
                </li>
                <li>
                  <a href="#contact" onClick={() => setMenuMobileAberto(false)}>
                    Contato 📞
                  </a>
                </li>
                <li>
                  <a href="/saibamais" onClick={() => setMenuMobileAberto(false)}>
                    Saiba Mais ℹ️
                  </a>
                </li>
                <li>
                  <a href="#" onClick={() => setMenuMobileAberto(false)}>
                    Carrinho 🛒
                  </a>
                </li>
                <li>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMenuMobileAberto(false);
                    }}
                    className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full"
                  >
                    Sair
                  </button>
                </li>
              </ul>
              <button
                onClick={() => setMenuMobileAberto(false)}
                className="mt-6 text-gray-500 hover:text-gray-800"
              >
                Fechar ✕
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Menu lateral desktop */}
      <aside className="menu white-bg z-[999] hidden md:block">
        <div className="h-[150px] main-content menu-content">
          <h1 onClick={() => (document.getElementById('close-menu').checked = false)}>
            <div className="logo">
              <a href="#home">
                <img src={logoUnifood} alt="unifood" />
              </a>
            </div>
          </h1>
          <nav>
            <ul onClick={() => (document.getElementById('close-menu').checked = false)}>
              <li><a href="#gallery">Cardápio 🍴</a></li>
              <li><a href="#contact">Contato 📞</a></li>
              <li><a href="/saibamais">Saiba Mais ℹ️</a></li>
              <li><a href="#">Carrinho 🛒</a></li>
              <li>
                <button
                  onClick={handleLogout}
                  className="m-4 bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded w-full"
                >
                  Sair
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Seção Cardápio */}
      <section id="gallery" className="white-bg section relative z-10">
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-[length:100%] opacity-[5%] z-0"
          style={{ backgroundImage: `url(${fundocardapio})` }}
        />
        <div className="main-content max-w-6xl mx-auto px-4 text-center relative z-20">
          <h2 className="grid-main-heading">NOSSO CARDÁPIO</h2>

          <div className="relative w-full h-[200px] md:h-[260px] lg:h-[300px] mx-auto rounded-2xl overflow-hidden shadow-xl mb-16 z-30">
            <Slider {...carouselSettings}>
              {imagensCarrossel.length > 0 ? (
                imagensCarrossel.map((item, index) => (
                  <div key={index} className="relative w-full h-full">
                    <div className="relative w-full h-[200px] md:h-[260px] lg:h-[300px] overflow-hidden">
                      <img
                        src={item.img}
                        alt={item.alt}
                        className="w-full h-full object-cover object-center"
                      />
                      {item.caption && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white text-center px-4 py-6 text-xl md:text-2xl lg:text-3xl font-bold z-10">
                          <p className="drop-shadow-lg">
                            QUERIDINHOS DA GALERA: {item.caption}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-600">Carregando imagens do carrossel...</p>
                </div>
              )}
            </Slider>
          </div>

          <h3 className="text-4xl font-bold text-gray-800 mb-6">CATEGORIAS</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.keys(produtosPorCategoria).map((categoria, i) => (
              <div
                key={i}
                className="relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                onClick={() => abrirModal(categoria)}
              >
                <img
                  src={produtosPorCategoria[categoria][0]?.imagem || pratodecomida}
                  alt={categoria}
                  className="w-full h-56 object-cover transform group-hover:scale-105 transition duration-300"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-50 w-full py-3 text-white text-xl font-bold">
                  {categoria}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Seção Contato */}
      <section id="contact" className="intro main-bg section relative z-10">
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

      {/* Botão de voltar ao topo */}
      <button
        className="back-to-top z-[990]"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ➔
      </button>

      {/* Modal de categoria */}
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
