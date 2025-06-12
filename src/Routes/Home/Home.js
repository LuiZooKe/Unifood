import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { X, Info, ShoppingCart } from 'lucide-react';

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

  // --- Novos estados para o carrinho ---
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false); // Controla a visibilidade do modal do carrinho
  const [itensCarrinho, setItensCarrinho] = useState([]); // Armazena os itens adicionados ao carrinho
  // --- Fim dos novos estados ---
  const alterarQuantidadeProduto = (nomeProduto, novaQuantidade) => {
    if (novaQuantidade < 1) return; // evita quantidade zero ou negativa

    setItensCarrinho((prevItens) =>
      prevItens.map((item) =>
        item.nome === nomeProduto
          ? { ...item, quantidade: novaQuantidade }
          : item
      )
    );
  };


  const abrirModal = (categoria) => {
    setCategoriaSelecionada(categoria);
    setModalAberto(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  // --- Funções para o carrinho ---
  const abrirModalCarrinho = () => {
    setModalCarrinhoAberto(true);
  };

  const fecharModalCarrinho = () => {
    setModalCarrinhoAberto(false);
  };

  // Função simulada para adicionar item ao carrinho
  // Você precisaria integrar essa função a botões de "Adicionar ao Carrinho"
  // nos seus produtos/ModalCategoria.
  const adicionarAoCarrinho = (produto) => {
    setItensCarrinho((prevItens) => {
      const itemExistente = prevItens.find((item) => item.nome === produto.nome);
      if (itemExistente) {
        return prevItens.map((item) =>
          item.nome === produto.nome ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      } else {
        return [...prevItens, { ...produto, quantidade: 1 }];
      }
    });
    alert(`${produto.nome} adicionado ao carrinho!`); // Apenas para feedback visual
  };

  const removerDoCarrinho = (nomeProduto) => {
    setItensCarrinho((prevItens) =>
      prevItens.filter((item) => item.nome !== nomeProduto)
    );
  };

  const calcularTotalCarrinho = () => {
    return itensCarrinho
      .reduce((total, item) => total + parseFloat(item.preco.replace('R$', '').replace(',', '.')) * item.quantidade, 0)
      .toFixed(2);
  };
  // --- Fim das funções do carrinho ---


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
          className="p-3 rounded bg-gray-800 text-white shadow-lg w-[50px] h-[]"
        >
          ☰
        </button>
      </div>

      {menuMobileAberto && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 backdrop-blur-xl z-[999] flex items-center justify-center md:hidden px-4">
          <div className="w-[90%] h-[90%] flex flex-col justify-center items-center p-6 overflow-y-auto text-center rounded-3xl">
            <nav className="flex flex-col items-center justify-center w-full gap-6">
              <a href="#gallery"
                onClick={() => setMenuMobileAberto(false)}
                className="w-full flex justify-center mb-">
                <img
                  src={logoUnifood}
                  alt="Unifood"
                  className="h-[28rem] object-contain drop-shadow-lg mt-[-8rem]"
                />
              </a>

              {/* Cardápio */}
              <a
                href="#gallery"
                onClick={() => setMenuMobileAberto(false)}
                className="w-full bg-gradient-to-r from-red-400 to-red-600 text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition mt-[-8rem]"
              >
                🍴 Cardápio
              </a>

              {/* Contato */}
              <a
                href="#contact"
                onClick={() => setMenuMobileAberto(false)}
                className="w-full bg-gradient-to-r from-pink-300 to-pink-500 text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                📞 Contato
              </a>

              {/* Saiba Mais */}
              <a
                href="/saibamais"
                onClick={() => setMenuMobileAberto(false)}
                className="w-full bg-gradient-to-r from-blue-300 to-blue-500 text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                ℹ️ Saiba Mais
              </a>

              {/* Carrinho */}
              <button
                onClick={() => {
                  abrirModalCarrinho();
                  setMenuMobileAberto(false);
                }}
                className="w-full bg-gradient-to-r from-green-300 to-green-500 text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                🛒 Carrinho
              </button>

              {/* Sair */}
              <button
                onClick={() => {
                  handleLogout();
                  setMenuMobileAberto(false);
                }}
                className="w-full bg-gradient-to-r from-gray-700 to-black text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                🚪 Sair
              </button>
            </nav>
          </div>
        </div>
      )}


      {/* Menu lateral desktop */}
      <aside className="menu white-bg z-[999] hidden md:block">
        <div className="h-[15rem] main-content menu-content">
          <h1>
            <div className="logo">
              <a href="#home">
                <img src={logoUnifood} alt="unifood"
                  className="h-[48rem] object-contain drop-shadow-lg" />
              </a>
            </div>
          </h1>
          <nav>
            <ul>
              <li><a href="#gallery">Cardápio 🍴</a></li>
              <li><a href="#contact">Contato 📞</a></li>
              <li><a href="/saibamais">Saiba Mais ℹ️</a></li>
              <li>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    abrirModalCarrinho();
                  }}
                  className="block w-full text-left"
                >
                  Carrinho 🛒
                </a>
              </li>

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
        onAddToCart={adicionarAoCarrinho} // Passa a função de adicionar ao carrinho para o ModalCategoria
      />

      {/* --- Modal do Carrinho --- */}
      {modalCarrinhoAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-[1000]">
          <div className="bg-white w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-12 relative">

            {/* Botão de fechar */}
            <button
              onClick={fecharModalCarrinho}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X className="w-12 h-12" />
            </button>

            {/* Título */}
            <h2 className="text-5xl font-extrabold text-gray-800 text-center mb-8 mt-2">
              Seu Carrinho 🛒
            </h2>

            {/* Lista de itens ou mensagem de vazio */}

            {itensCarrinho.length === 0 ? (
              <p className="text-gray-500 text-center text-lg">
                Seu carrinho está vazio.
              </p>
            ) : (
              <ul className="space-y-4 max-h-[60%] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {itensCarrinho.map((item, index) => (
                  <li
                    key={index}
                    className="flex gap-4 bg-gray-50 p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                  >
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-[150px] h-[150px] object-cover rounded-lg flex-shrink-0"
                    />

                    <div className="flex flex-grow justify-between w-full items-end">
                      {/* Nome e Preço - alinhados na parte inferior esquerda */}
                      <div className="flex flex-col justify-end w-full mr-4">
                        <h4 className="font-bold text-[30px] text-gray-800 break-words leading-snug">
                          {item.nome}
                        </h4>
                        <p className="text-md text-gray-500 mb-2">
                          Preço: {item.preco}
                        </p>
                      </div>

                      {/* Controle de Quantidade + Botão Remover - ambos alinhados à direita e na parte inferior */}
                      <div className="flex flex-col items-end justify-end gap-y-2">
                        {/* Controle de quantidade */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => alterarQuantidadeProduto(item.nome, item.quantidade - 1)}
                            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-md font-bold"
                          >
                            −
                          </button>
                          <span className="text-md font-semibold">{item.quantidade}</span>
                          <button
                            onClick={() => alterarQuantidadeProduto(item.nome, item.quantidade + 1)}
                            className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-md font-bold"
                          >
                            +
                          </button>
                        </div>

                        {/* Botão Remover */}
                        <button
                          onClick={() => removerDoCarrinho(item.nome)}
                          className="text-red-500 hover:text-red-700 text-md font-semibold transition"
                        >
                          Remover
                        </button>
                      </div>
                    </div>


                  </li>
                ))}
              </ul>
            )}

            {/* Total e botão de compra */}
            <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <p className="text-x2 font-bold text-gray-800">
                TOTAL: <span className="text-green-600">R$ {calcularTotalCarrinho()}</span>
              </p>
              <button
                onClick={() => alert('Funcionalidade de finalizar compra ainda não implementada!')}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-sm hover:shadow-md"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}
      {/* --- Fim do Modal do Carrinho --- */}

    </div>
  );
}

export default Home;