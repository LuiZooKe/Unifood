import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import { X } from 'lucide-react';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import logoUnifood from './img/logounifood.png';
import fundocardapio from './img/fundo-cardapio.png';
import pratodecomida from './img/prato de comida.png';

import ModalCategoria from './ts/ModalCategoria.tsx';
import ModalCarrinho from './ts/ModalCarrinho.tsx';
import Pagamento from './ts/Pagamento.tsx';
import Pix from './ts/Pix.tsx';
import PagamentoConfirm from './ts/PagamentoConfirm.tsx';
import ModalPerfil from './ts/ModalPerfil.tsx';

import useLockBodyScroll from './ts/hooks/useLockBodyScroll.ts';

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
  const estaLogado = localStorage.getItem('usuarioLogado') === 'true';
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState({
    nome: '',
    email: '',
    tipo_usuario: '',
    saldo: 0,
    numero_cartao: '',
    logradouro: '',
    numero: '',
    bairro: '',
    cidade: '',
    telefone: '',
  });

  const [carregandoUsuario, setCarregandoUsuario] = useState(true);
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState('');
  const [produtosPorCategoria, setProdutosPorCategoria] = useState({});
  const [imagensCarrossel, setImagensCarrossel] = useState([]);
  const [menuMobileAberto, setMenuMobileAberto] = useState(false);
  const [modalCarrinhoAberto, setModalCarrinhoAberto] = useState(false);
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [pagamentoAberto, setPagamentoAberto] = useState(false);
  const [pagamentoPixAberto, setPagamentoPixAberto] = useState(false);
  const [confirmacaoAberta, setConfirmacaoAberta] = useState(false);
  const [pagamentoParcial, setPagamentoParcial] = useState(undefined);
  const TIPO_VENDA = "SITE";

  const scrollTravado =
    modalCarrinhoAberto ||
    pagamentoAberto ||
    confirmacaoAberta ||
    perfilAberto ||
    menuMobileAberto;

  useLockBodyScroll(scrollTravado);

  const fecharTudo = () => {
    setMenuMobileAberto(false);
    setModalCarrinhoAberto(false);
    setPerfilAberto(false);
    setPagamentoAberto(false);
    setConfirmacaoAberta(false);
  };

  const abrirMenu = () => {
    fecharTudo();
    setMenuMobileAberto(true);
  };

  const abrirCategoria = (categoria) => {
    setCategoriaSelecionada(categoria);
    setTimeout(() => {
      const elemento = document.getElementById('categorias-titulo');
      if (elemento) {
        const y = elemento.getBoundingClientRect().top + window.pageYOffset - 120;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    }, 100);
  };

  const fecharCategoria = () => {
    setCategoriaSelecionada('');
  };

  const abrirModalCarrinho = () => {
    fecharTudo();
    setModalCarrinhoAberto(true);
  };

  const abrirPerfil = () => {
    fecharTudo();
    setPerfilAberto(true);
  };

  const adicionarAoCarrinho = (produto) => {
    if (!estaLogado) {
      notify.error('Você precisa estar logado para adicionar itens ao carrinho.');
      return;
    }

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
    setItensCarrinho((prevItens) => prevItens.filter((item) => item.nome !== nomeProduto));
  };

  const limparCarrinho = () => {
    setItensCarrinho([]);
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
      .reduce((total, item) => {
        const precoNumerico =
          typeof item.preco === 'string'
            ? parsePreco(item.preco)
            : item.preco;

        return total + precoNumerico * item.quantidade;
      }, 0)
      .toFixed(2);
  };

  const finalizarPagamento = async (metodo, valorParcial) => {
    const total = valorParcial ?? parseFloat(calcularTotalCarrinho().replace(',', '.'));

    if (metodo === 'cartao' && !usuario.numero_cartao) {
      notify.error('Nenhum cartão cadastrado.');
      return false;
    }

    if (metodo === 'saldo' && (usuario.saldo || 0) < total) {
      notify.error('Saldo insuficiente.');
      return false;
    }

    try {
      const res = await fetch('http://localhost/UNIFOOD/database/finalizar_pedido.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: usuario.nome,
          email: usuario.email,
          itens: itensCarrinho,
          valor_total: total,
          tipo_pagamento: metodo,
          tipo_venda: TIPO_VENDA,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const usuarioAtualizado = { ...usuario, saldo: data.novo_saldo };
        setUsuario(usuarioAtualizado);
        localStorage.setItem('dadosUsuario', JSON.stringify(usuarioAtualizado));

        limparCarrinho();
        return true;
      } else {
        notify.error('Erro ao finalizar pedido: ' + data.message);
        return false;
      }
    } catch (error) {
      console.error('Erro na conexão:', error);
      notify.error('Erro na conexão com o servidor.');
      return false;
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioLogado');
    navigate('/login');
  };

  const carregarPerfil = () => {
    const dadosUsuario = JSON.parse(localStorage.getItem('dadosUsuario') || '{}');

    if (dadosUsuario.email) {
      setCarregandoUsuario(true);

      fetch('http://localhost/UNIFOOD/database/get_perfil.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: dadosUsuario.email }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.dados) {
            const dadosRecebidos = {
              nome: data.dados.nome || '',
              email: data.dados.email || '',
              tipo_usuario: data.dados.tipo_usuario || '',
              saldo: parseFloat(data.dados.saldo) || 0,
              logradouro: data.dados.logradouro || '',
              numero: data.dados.numero || '',
              bairro: data.dados.bairro || '',
              cidade: data.dados.cidade || '',
              telefone: data.dados.telefone || '',
              numero_cartao: data.dados.numero_cartao || '',
              nome_cartao: data.dados.nome_cartao || '',
              validade_cartao: data.dados.validade_cartao || '',
              cvv_cartao: data.dados.cvv_cartao || '',
            };

            setUsuario(dadosRecebidos);
            localStorage.setItem('dadosUsuario', JSON.stringify(dadosRecebidos));
          } else {
            console.error('Erro ao carregar perfil:', data?.message || 'Dados não encontrados');
          }
        })
        .catch(err => {
          console.error('Erro na requisição do perfil:', err);
        })
        .finally(() => setCarregandoUsuario(false));
    }
  };

  useEffect(() => {
    carregarPerfil();
  }, []);

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
                quantidade: produto.quantidade,
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

  return (
    <div>
      {/*  Topo do menu mobile */}
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

      {/*  Menu mobile expandido */}
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

              {estaLogado ? (
                <>
                  <button
                    onClick={() => {
                      fecharTudo();
                      abrirModalCarrinho();
                    }}
                    className="w-[90%] bg-gradient-to-r from-green-300 to-green-500 text-white font-bold text-2xl py-4 rounded-2xl shadow-xl hover:scale-105 transition"
                  >
                    🛍️ Pedidos
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
                </>
              ) : (
                <button
                  onClick={() => {
                    fecharTudo();
                    navigate('/login');
                  }}
                  className="w-[90%] bg-gradient-to-r from-gray-600 to-gray-900 text-white font-bold text-2xl py-4 rounded-2xl shadow-xl hover:scale-105 transition"
                >
                  🔑 Fazer Login
                </button>
              )}

            </nav>
          </div>
        </div>
      )}


      {/*  Menu lateral desktop */}
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

              {estaLogado ? (
                <>
                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        abrirModalCarrinho();
                      }}
                    >
                      Pedidos 🛍️
                    </a>
                  </li>

                  <li>
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        abrirPerfil();
                      }}
                    >
                      <button className="w-full text-left">Perfil 👤</button>
                    </a>
                  </li>
                </>
              ) : (
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      navigate('/login');
                    }}
                  >
                    <button className="w-full text-left">Fazer Login 🔑</button>
                  </a>
                </li>
              )}

            </ul>
          </nav>
        </div>
      </aside>

      <section id="gallery" className="bg-white relative z-10 pt-[10rem] pb-8">
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-[length:100%] opacity-[5%] z-0"
          style={{ backgroundImage: `url(${fundocardapio})` }}
        />
        <div className="max-w-[90%] md:max-w-[70%] mx-auto px-4 text-center relative z-20">
          <h2 className="text-5xl md:text-5xl font-extrabold mb-6 break-words">
            NOSSO CARDÁPIO
          </h2>

          <div className="relative w-full h-[180px] md:h-[240px] lg:h-[260px] mx-auto rounded-2xl overflow-hidden shadow-xl mb-6 z-30">
            <Slider {...carouselSettings}>
              {imagensCarrossel.map((item, index) => (
                <div
                  key={index}
                  className="relative w-full h-[180px] md:h-[240px] lg:h-[260px] rounded-2xl overflow-hidden shadow-xl"
                >
                  <img
                    src={item.img}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center"
                  />
                  {item.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/70 to-transparent text-white text-center px-4 py-4 md:py-6 text-lg md:text-2xl font-bold z-10">
                      <p className="drop-shadow-lg">
                        QUERIDINHOS DA GALERA: {item.caption}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </section>

      <section className="bg-white relative w-full py-8">
        {/* Fundo do cardápio sutil */}
        <div
          className="absolute inset-0 bg-no-repeat bg-center bg-[length:100%] opacity-[5%] z-0"
          style={{ backgroundImage: `url(${fundocardapio})` }}
        />

        <div className="relative z-10 w-full max-w-[90%] md:max-w-[70%] mx-auto">
          <h3
            id="categorias-titulo"
            className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 text-center break-words"
          >
            CATEGORIAS
          </h3>

          {/* Botão ESQUERDO com mais presença */}
          <button
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-5 z-30 
      bg-black/60 hover:bg-black/70 text-white rounded-lg w-14 h-20 
      items-center justify-center text-4xl font-bold shadow-md"
            onClick={() => {
              const container = document.getElementById('container-categorias');
              container.scrollBy({ left: -500, behavior: 'smooth' });
            }}
          >
            ❮
          </button>

          {/* Lista de categorias */}
          <div
            id="container-categorias"
            className="flex gap-6 overflow-x-auto px-2"
            style={{
              scrollBehavior: 'smooth',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {Object.keys(produtosPorCategoria).map((categoria, i) => (
              <div
                key={i}
                className="min-w-[200px] max-w-[200px] flex-shrink-0 relative group cursor-pointer overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all"
                onClick={() => abrirCategoria(categoria)}
              >
                <img
                  src={produtosPorCategoria[categoria][0]?.imagem || pratodecomida}
                  alt={categoria}
                  className="w-full h-56 object-cover"
                />
                <div className="absolute bottom-0 bg-black bg-opacity-50 w-full py-3 text-white text-xl font-bold text-center">
                  {categoria}
                </div>
              </div>
            ))}
          </div>

          {/* Botão DIREITO com mais presença */}
          <button
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-5 z-30 
      bg-black/60 hover:bg-black/70 text-white rounded-lg w-14 h-20 
      items-center justify-center text-4xl font-bold shadow-md"
            onClick={() => {
              const container = document.getElementById('container-categorias');
              container.scrollBy({ left: 500, behavior: 'smooth' });
            }}
          >
            ❯
          </button>
        </div>
        <style>
          {`
      #container-categorias::-webkit-scrollbar {
        display: none;
      }
    `}
        </style>
      </section>


      {categoriaSelecionada && (
        <div className="relative w-full">
          {/*  Fundo suave */}
          <div
            className="absolute inset-0 bg-no-repeat bg-center bg-[length:100%] opacity-[5%] z-0"
            style={{ backgroundImage: `url(${fundocardapio})` }}
          />

          {/*  Conteúdo da categoria */}
          <div className="relative z-10">
            <ModalCategoria
              categoriaSelecionada={categoriaSelecionada}
              produtos={produtosPorCategoria[categoriaSelecionada] || []}
              onAddToCart={adicionarAoCarrinho}
              onClose={fecharCategoria}
              estaLogado={estaLogado}
              carrinho={Object.fromEntries(
                itensCarrinho.map((item) => [item.nome, item.quantidade])
              )}
            />
          </div>
        </div>
      )}

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
                disabled={!estaLogado}
                className={`${estaLogado
                  ? 'bg-white hover:bg-gray-100 cursor-pointer'
                  : 'bg-gray-400 cursor-not-allowed'
                  } text-red-700 font-bold text-3xl py-6 px-16 rounded-xl transition`}
              >
                {estaLogado ? 'ENVIAR MENSAGEM' : 'FAÇA LOGIN PARA ENVIAR'}
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

      <ModalCarrinho
        aberto={modalCarrinhoAberto}
        onFechar={fecharTudo}
        onAbrirPagamento={(valorParcial) => {
          setPagamentoParcial(valorParcial); // 👈 salva a diferença (caso exista)
          setModalCarrinhoAberto(false);
          setPagamentoAberto(true);
        }}
        itens={itensCarrinho}
        setItens={setItensCarrinho}
        calcularTotal={calcularTotalCarrinho}
        onAlterarQuantidade={alterarQuantidadeProduto}
        onRemover={removerDoCarrinho}
        limparCarrinho={limparCarrinho}
        usuario={usuario}
        atualizarUsuario={(usuarioAtualizado) => {
          setUsuario(usuarioAtualizado);
          localStorage.setItem('dadosUsuario', JSON.stringify(usuarioAtualizado));
        }}
      />

      <Pagamento
        visivel={pagamentoAberto}
        onFechar={() => setPagamentoAberto(false)}
        valorParcial={pagamentoParcial}
        onPagar={async (metodo) => {
          if (metodo === 'pix') {
            setPagamentoAberto(false);
            setPagamentoPixAberto(true);
          } else {
            const sucesso = await finalizarPagamento(metodo, pagamentoParcial);
            if (sucesso) {
              setPagamentoAberto(false);
              setConfirmacaoAberta(true);
              setPagamentoParcial(undefined); // ✅ limpa após pagamento
            }
          }
        }}
        itens={itensCarrinho}
        total={calcularTotalCarrinho()}
        usuario={usuario}
      />

      <Pix
        visivel={pagamentoPixAberto}
        onFechar={() => setPagamentoPixAberto(false)}
        onConfirmarPagamento={async () => {
          const sucesso = await finalizarPagamento('pix');
          if (sucesso) {
            setPagamentoPixAberto(false); // 🔥 Fecha a janela do Pix
            setConfirmacaoAberta(true);    // 🔥 Abre a janela de "Pagamento Confirmado"
            setPagamentoParcial(undefined);
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }}
        total={calcularTotalCarrinho()}
        usuario={usuario}
      />



      <PagamentoConfirm
        visivel={confirmacaoAberta}
        onFechar={() => {
          setConfirmacaoAberta(false);
          setPagamentoParcial(undefined);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onConfirmar={() => {
          setConfirmacaoAberta(false);
          setPagamentoParcial(undefined);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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