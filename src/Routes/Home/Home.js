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
  const [abaAberta, setAbaAberta] = useState('inicio');
  const [usuario, setUsuario] = useState({ nome: '', email: '', tipo_usuario: '' });
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
  const [imagensCarrossel, setImagensCarrossel] = useState([]);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);

  // Novo estado para perfil
  const [modalPerfilAberto, setModalPerfilAberto] = useState(false);

  // Função para abrir/perfil modal
  const abrirModalPerfil = () => {
    setModalPerfilAberto(true);
  };
  const fecharModalPerfil = () => {
    setModalPerfilAberto(false);
  };

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

  const renderConteudo = () => {
    if (abaAberta === 'dados') {
      return (
        <div className="mt-6">
          <h3 className="text-2xl font-semibold mb-4">Seus Dados</h3>
          <ul className="mb-6 space-y-2 text-gray-700">
            <li><strong>Nome:</strong> {usuario.nome || 'Não informado'}</li>
            <li><strong>Email:</strong> {usuario.email || 'Não informado'}</li>
            <li><strong>Tipo de usuário:</strong> {usuario.tipo_usuario === '1' ? 'Aluno/Professor' : usuario.tipo_usuario === '2' ? 'Responsável' : 'Não informado'}</li>
          </ul>

          <button className="mb-3 w-full py-2 px-4 rounded bg-blue-600 hover:bg-blue-700 text-white font-semibold">
            Alterar Senha
          </button>
          <button className="w-full py-2 px-4 rounded bg-yellow-500 hover:bg-yellow-600 text-white font-semibold">
            Atualizar Dados
          </button>
        </div>
      );
    }

    if (abaAberta === 'carteira') {
      return (
        <div className="mt-6 text-gray-600">
          Funcionalidade de carteira será adicionada futuramente.
        </div>
      );
    }

    return (
      <p className="text-gray-600 mt-6">
        Escolha uma opção abaixo para gerenciar seu perfil.
      </p>
    );
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

  useEffect(() => {
    // Simulação: busca os dados do usuário logado
    const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario') || '{}');
    setUsuario(dadosUsuario);
  }, []);

  return (
    <div>
      {/* Topo do menu mobile – visível somente quando o menu está fechado */}
      {!menuMobileAberto && (
        <div className="fixed top-0 left-0 right-0 z-[9999] md:hidden bg-[rgb(82,0,0)] shadow-md h-[9rem] flex items-center">
          {/* Logo à esquerda */}
          <div className="pl-4 flex items-center">
            <img
              src={logoUnifood}
              alt="Unifood"
              className="h-[18rem] object-contain drop-shadow-lg"
            />
          </div>

          {/* Botão do menu à direita com texto */}
          <button
            onClick={() => setMenuMobileAberto(true)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 px-12 py-3 rounded text-white shadow-lg text-4xl font-extrabold flex items-center gap-3"
          >
            MENU <span className="text-5xl">☰</span>
          </button>
        </div>
      )}



      {/* Menu mobile expandido */}
      {menuMobileAberto && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black bg-opacity-50 backdrop-blur-xl z-[999] flex items-center justify-center md:hidden px-4">
          <div className="w-[90%] h-[90%] flex flex-col justify-center items-center p-6 overflow-y-auto text-center rounded-3xl relative">

            {/* Botão fechar no topo direito */}
            <div className="absolute top-1 right-6">
              <button
                onClick={() => setMenuMobileAberto(false)}
                className="text-white text-3xl font-bold flex items-center gap-2"
              >
                FECHAR MENU ✕
              </button>
            </div>

            <nav className="flex flex-col items-center justify-center w-full gap-6 mt-16">
              {/* Logo dentro do menu */}
              <a href="#gallery"
                onClick={() => setMenuMobileAberto(false)}
                className="w-full flex justify-center">
                <img
                  src={logoUnifood}
                  alt="Unifood"
                  className="h-[28rem] object-contain drop-shadow-lg mt-[-8rem]"
                />
              </a>

              {/* Links do menu */}
              <a
                href="#gallery"
                onClick={() => setMenuMobileAberto(false)}
                className="w-full bg-gradient-to-r from-red-400 to-red-600 text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition mt-[-8rem]"
              >
                🍴 Cardápio
              </a>
              <a
                href="#contact"
                onClick={() => setMenuMobileAberto(false)}
                className="w-full bg-gradient-to-r from-pink-300 to-pink-500 text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                📞 Contato
              </a>
              <a
                href="/saibamais"
                onClick={() => setMenuMobileAberto(false)}
                className="w-full bg-gradient-to-r from-blue-300 to-blue-500 text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                ℹ️ Saiba Mais
              </a>
              <button
                onClick={() => {
                  abrirModalCarrinho();
                  setMenuMobileAberto(false);
                }}
                className="w-full bg-gradient-to-r from-green-300 to-green-500 text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                🛒 Carrinho
              </button>
              <button
                onClick={() => {
                  setModalPerfilAberto(true)
                  setMenuMobileAberto(false);
                }}
                className="w-full bg-gradient-to-r from-gray-600 to-gray-900 text-white font-bold text-2xl py-5 rounded-2xl shadow-xl hover:scale-105 transition"
              >
                👤 Perfil
              </button>
            </nav>
          </div>
        </div>
      )}


      {/* Menu lateral desktop */}
      <aside className="menu white-bg z-[999] hidden md:block">
        <div className="h-[14rem] main-content menu-content">
          <h1>
            <div className="logo">
              <a href="#home">
                <img src={logoUnifood} alt="unifood"
                  className="min-w-[15rem] object-contain drop-shadow-lg" />
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
                    onClick={() => {

                      setModalPerfilAberto(true)
                      setMenuMobileAberto(false);
                    }}
                    className="block w-full text-left"
                  >
                    Perfil 👤
                  </button>
                </a>
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
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1000] px-4">
          <div className="bg-white w-full max-w-[100vh] max-h-[100vh] overflow-auto rounded-2xl shadow-xl p-6 sm:p-10 relative text-[clamp(1rem,2.5vw,2rem)]">

            {/* Botão de fechar */}
            <button
              onClick={fecharModalCarrinho}
              className="absolute top-6 right-6 text-gray-500 hover:text-red-500"
            >
              <X className="w-10 h-10 sm:w-12 sm:h-12" />
            </button>

            {/* Título */}
            <h2 className="text-center mb-10 mt-4 font-extrabold text-gray-800 leading-tight">
              <span className="block whitespace-nowrap text-[clamp(2.5rem,6vw,4rem)]">CARRINHO</span>
              <span className="block whitespace-nowrap text-[clamp(2.5rem,5vw,4rem)]">🛒</span>
            </h2>

            {/* Lista de itens */}
            {itensCarrinho.length === 0 ? (
              <p className="text-gray-600 text-center text-[clamp(1.25rem,3vw,2rem)]">
                Seu carrinho está vazio.
              </p>
            ) : (
              <ul className="space-y-6 max-h-[55vh] overflow-y-auto pr-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
                {itensCarrinho.map((item, index) => (
                  <li
                    key={index}
                    className="flex gap-6 bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow"
                  >
                    {/* Imagem */}
                    <img
                      src={item.imagem}
                      alt={item.nome}
                      className="w-[120px] h-[120px] md:w-[150px] md:h-[150px] object-cover rounded-lg flex-shrink-0"
                    />

                    {/* Infos e ações */}
                    <div className="flex flex-col justify-between w-full">
                      {/* Nome e preço */}
                      <div className="flex flex-col justify-end flex-grow">
                        <h4 className="font-bold text-gray-800 leading-tight text-[clamp(1.5rem,3vw,2.5rem)] break-words">
                          {item.nome}
                        </h4>
                        <p className="text-gray-600 mt-1 text-[clamp(1.25rem,2.5vw,2rem)]">
                          Preço: <span className="font-semibold">{item.preco}</span>
                        </p>
                      </div>

                      {/* Quantidade e remover */}
                      <div className="flex flex-col items-end mt-4 gap-2">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => alterarQuantidadeProduto(item.nome, item.quantidade - 1)}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-xl font-bold"
                          >
                            −
                          </button>
                          <span className="text-2xl font-semibold">{item.quantidade}</span>
                          <button
                            onClick={() => alterarQuantidadeProduto(item.nome, item.quantidade + 1)}
                            className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-xl font-bold"
                          >
                            +
                          </button>
                        </div>

                        <button
                          onClick={() => removerDoCarrinho(item.nome)}
                          className="text-red-600 hover:text-red-800 text-lg font-medium"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {/* Total e botão */}
            <div className="mt-10 pt-6 border-t border-gray-300 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-6">
              <p className="text-2xl font-bold text-gray-800">
                TOTAL: <span className="text-green-600">R$ {calcularTotalCarrinho()}</span>
              </p>
              <button
                onClick={() => alert("Funcionalidade de finalizar compra ainda não implementada!")}
                className="bg-green-600 hover:bg-green-700 text-white font-bold text-2xl py-4 px-8 rounded-xl shadow-md hover:shadow-xl transition-all"
              >
                Finalizar Compra
              </button>
            </div>
          </div>
        </div>
      )}



      {/* --- Fim do Modal do Carrinho --- */}


      {modalPerfilAberto && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[1001]">
          <div className="bg-white w-full max-w-[100vh] max-h-[100vh] overflow-auto rounded-2xl shadow-xl p-6 sm:p-10 relative text-[clamp(1rem,2.5vw,2rem)]">
            <button
              onClick={() => setModalPerfilAberto(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
            >
              <X className="w-8 h-8" />
            </button>

            <h2 className="text-5xl font-bold text-gray-800 mb-4">Meu Perfil</h2>

            <div className="flex gap-4 mt-4">
              <button
                onClick={() => setAbaAberta('dados')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold ${abaAberta === 'dados' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Dados
              </button>
              <button
                onClick={() => setAbaAberta('carteira')}
                className={`flex-1 py-2 px-4 rounded-lg font-semibold ${abaAberta === 'carteira' ? 'bg-green-600 text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
              >
                Carteira
              </button>
            </div>

            {renderConteudo()}

            <div className="mt-3">
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full"
              >
                Desconectar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Home;