import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { X, Info, ShoppingCart } from 'lucide-react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import logoUnifood from './img/logounifood.png';
import fundocardapio from './img/fundo-cardapio.png';
import pratodecomida from './img/prato de comida.png';

import ModalCategoria from './ts/ModalCategoria.tsx';
import ModalCarrinho from './ts/ModalCarrinho.tsx';
import ModalPerfil from './ts/ModalPerfil.tsx';

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
  const [abaAberta, setAbaAberta] = useState('dados');
  const [usuario, setUsuario] = useState({ nome: '', email: '', tipo_usuario: '' });
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
  const [imagensCarrossel, setImagensCarrossel] = useState([]);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);
  const [itensCarrinho, setItensCarrinho] = useState([]);

  // 🔥 Funções de controle geral
  const fecharTudo = () => {
    setMenuMobileAberto(false);
    setModalCarrinhoAberto(false);
    setPerfilAberto(false);
    setModalAberto(false);
  };

  const abrirMenu = () => {
    fecharTudo();
    setMenuMobileAberto(true);
  };

  const abrirModal = (categoria) => {
    fecharTudo();
    setCategoriaSelecionada(categoria);
    setModalAberto(true);
  };

  const abrirModalCarrinho = () => {
    fecharTudo();
    setModalCarrinhoAberto(true);
  };

  const abrirPerfil = () => {
    fecharTudo();
    setPerfilAberto(true);
  };

  // 🔥 Carrinho
  const adicionarAoCarrinho = (produto) => {
    setItensCarrinho((prevItens) => {
      const existente = prevItens.find((item) => item.nome === produto.nome);
      if (existente) {
        return prevItens.map((item) =>
          item.nome === produto.nome ? { ...item, quantidade: item.quantidade + 1 } : item
        );
      } else {
        return [...prevItens, { ...produto, quantidade: 1 }];
      }
    });
  };

  const removerDoCarrinho = (nomeProduto) => {
    setItensCarrinho((prevItens) =>
      prevItens.filter((item) => item.nome !== nomeProduto)
    );
  };

  const alterarQuantidadeProduto = (nomeProduto, novaQuantidade) => {
    if (novaQuantidade < 1) return;
    setItensCarrinho((prevItens) =>
      prevItens.map((item) =>
        item.nome === nomeProduto ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const calcularTotalCarrinho = () => {
    return itensCarrinho
      .reduce(
        (total, item) =>
          total + parseFloat(item.preco.replace('R$', '').replace(',', '.')) * item.quantidade,
        0
      )
      .toFixed(2);
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  // 🔥 Buscar dados do usuário
  useEffect(() => {
    const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario') || '{}');
    if (dadosUsuario.email) {
      fetch(`http://localhost/UNIFOOD/database/get_perfil.php?email=${dadosUsuario.email}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setUsuario(data.dados);
            localStorage.setItem('dadosUsuario', JSON.stringify(data.dados));
          }
        })
        .catch(err => console.error('Erro ao buscar perfil:', err));
    }
  }, []);

  // 🔥 Buscar produtos
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

            if (produto.categoria !== 'ESTOQUE') {
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

  // 🔥 Sincronizar dados do usuário local
  useEffect(() => {
    const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario') || '{}');
    setUsuario(dadosUsuario);
  }, []);

  // 🔥 Inicio do return
  return (
    <div>
      {/* ✅ Topo do menu mobile */}
      {!(menuMobileAberto || modalCarrinhoAberto || perfilAberto) && (
        <div className="fixed top-0 left-0 right-0 z-[9999] md:hidden bg-[rgb(82,0,0)] shadow-md h-[9rem] flex items-center">
          <div className="pl-4 flex items-center">
            <img
              src={logoUnifood}
              alt="Unifood"
              className="h-[18rem] object-contain drop-shadow-lg"
            />
          </div>

          <button
            onClick={abrirMenu}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 px-12 py-3 rounded text-white shadow-lg text-4xl font-extrabold flex items-center gap-3"
          >
            MENU <span className="text-5xl">☰</span>
          </button>
        </div>
      )}

      {/* ✅ Menu mobile expandido */}
      {menuMobileAberto && (
        <div
          className="fixed inset-0 z-[9999] bg-black/70 backdrop-blur-xl flex items-center justify-center md:hidden"
          onClick={fecharTudo}
        >
          <div
            className="w-full h-full flex flex-col justify-center items-center p-6 overflow-y-auto text-center relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={fecharTudo}
              className="absolute top-[3.3rem] right-[4.4rem] text-white text-4xl font-extrabold"
            >
              FECHAR MENU ✕
            </button>

            <img
              src={logoUnifood}
              alt="Unifood"
              className="w-[24rem] object-contain drop-shadow-lg mb-[-6rem]"
            />

            <nav className="flex flex-col items-center justify-center w-full gap-5">
              <a
                href="#gallery"
                onClick={fecharTudo}
                className="w-[90%] bg-gradient-to-r from-red-400 to-red-600 text-white font-bold text-2xl py-4 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                🍴 Cardápio
              </a>
              <a
                href="#contact"
                onClick={fecharTudo}
                className="w-[90%] bg-gradient-to-r from-pink-300 to-pink-500 text-white font-bold text-2xl py-4 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                📞 Contato
              </a>
              <a
                href="/saibamais"
                onClick={fecharTudo}
                className="w-[90%] bg-gradient-to-r from-blue-300 to-blue-500 text-white font-bold text-2xl py-4 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                ℹ️ Saiba Mais
              </a>

              <button
                onClick={() => {
                  fecharTudo();
                  abrirModalCarrinho();
                }}
                className="w-[90%] bg-gradient-to-r from-green-300 to-green-500 text-white font-bold text-2xl py-4 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                🛒 Carrinho
              </button>

              <button
                onClick={() => {
                  fecharTudo();
                  abrirPerfil();
                }}
                className="w-[90%] bg-gradient-to-r from-gray-600 to-gray-900 text-white font-bold text-2xl py-4 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                👤 Perfil
              </button>
            </nav>
          </div>
        </div>
      )}


      {/* ✅ Menu lateral desktop */}
      <aside className="menu white-bg z-[999] hidden md:block">
        <div className="h-[14rem] main-content menu-content">
          <h1>
            <div className="logo">
              <a href="#home">
                <img
                  src={logoUnifood}
                  alt="unifood"
                  className="min-w-[15rem] object-contain drop-shadow-lg"
                />
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
                <a>
                  <button
                    onClick={abrirPerfil}
                    className="block w-full text-left"
                  >
                    Perfil 👤
                  </button>

                  {perfilAberto && (
                    <ModalPerfil
                      aberto={perfilAberto}
                      usuario={usuario}
                      abaAberta={abaAberta}
                      setAbaAberta={setAbaAberta}
                      onFechar={fecharTudo}
                      onLogout={handleLogout}
                      onSalvar={(dadosAtualizados) => {
                        setUsuario(dadosAtualizados);
                        localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));
                      }}
                    />
                  )}
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/*  Carrossel */}

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

      <section id="contact" className="bg-red-700 py-32 px-8 text-white relative overflow-hidden">
        <div className="max-w-5xl mx-auto relative z-[1]">

          {/* Título */}
          <h2 className="text-6xl font-extrabold text-center leading-tight mb-10 mt-[2rem]">
            EM CASO DE DÚVIDAS, NOS CONTATE
          </h2>

          {/* Formulário */}
          <form className="w-full space-y-6 relative z-[10] px-6">

            {/* Nome */}
            <div className="space-y-4">
              <label htmlFor="first-name" className="block text-2xl font-bold uppercase">
                Nome Completo
              </label>
              <input
                type="text"
                name="first-name"
                id="first-name"
                placeholder="Digite seu nome completo aqui"
                className="w-full px-6 py-6 rounded-xl text-black text-3xl"
              />
            </div>

            {/* E-mail */}
            <div className="space-y-4">
              <label htmlFor="email" className="block text-2xl font-bold uppercase">
                E-mail
              </label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="Digite seu e-mail de contato aqui"
                className="w-full px-6 py-6 rounded-xl text-black text-3xl"
              />
            </div>

            {/* Campo com imagem ao fundo */}
            <div className="relative">
              {/* Mensagem */}
              <div className="space-y-4 relative z-[10]">
                <label htmlFor="message" className="block text-2xl font-bold uppercase">
                  Mensagem
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows="4"
                  placeholder="Digite aqui sua dúvida, reclamação ou elogio"
                  className="w-full px-6 py-6 rounded-xl text-black text-3xl resize-none"
                ></textarea>
              </div>

              {/* Imagem por trás saindo da direita */}
              <img
                src={pratodecomida}
                alt="prato de comida"
                className="absolute top-[9rem] right-[-7rem] w-[28rem] opacity-90 z-[-1] pointer-events-none"
              />
            </div>

            {/* Botão */}
            <div className="text-center pt-6">
              <button
                type="submit"
                className="bg-white text-red-700 font-bold text-3xl py-6 px-16 rounded-xl hover:bg-gray-100 transition"
              >
                ENVIAR MENSAGEM
              </button>
            </div>
          </form>
        </div>
      </section>


      {/* Botão de voltar ao topo */}
      <button
        className="back-to-top z-[990]"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        ➔
      </button>

      <ModalCategoria
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        categoria={categoriaSelecionada}
        produtos={produtosPorCategoria[categoriaSelecionada] || []}
        onAddToCart={adicionarAoCarrinho}
      />

      <ModalCarrinho
        aberto={modalCarrinhoAberto}
        itens={itensCarrinho}
        onFechar={fecharTudo}
        onRemover={removerDoCarrinho}
        onAlterarQuantidade={alterarQuantidadeProduto}
        calcularTotal={calcularTotalCarrinho}
      />

      <ModalPerfil
        aberto={perfilAberto}
        usuario={usuario}
        onFechar={() => setPerfilAberto(false)}
        onLogout={handleLogout}
        onSalvar={(dadosAtualizados) => {
          setUsuario(dadosAtualizados);
          localStorage.setItem('dadosUsuario', JSON.stringify(dadosAtualizados));
        }}
      />


    </div>
  );
}

export default Home;