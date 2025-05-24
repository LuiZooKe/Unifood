import './css/classes.css'
import './css/elements.css'
import './css/menu.css'
import './css/styles.css'
import './css/variables.css'
import './img/breakfast-not-optimized.svg'
import './img/main-bg.svg'
import './img/pastel.png'

function Home() {
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
            <a href="#home">LOGO</a>
          </h1>
          <nav>
            <ul onClick={() => (document.getElementById('close-menu').checked = false)}>
              <li><a href="#intro">Intro</a></li>
              <li><a href="#grid-one">Grid One</a></li>
              <li><a href="#gallery">Gallery</a></li>
              <li><a href="#grid-two">Grid Two</a></li>
              <li><a href="#pricing">Pricing</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>
        </div>
      </aside>

      <div className="menu-spacing"></div>

      <section id="home" className="intro main-bg section">
        <div className="main-content intro-content">
          <div className="intro-text-content">
            <h2 className="grid-main-heading">De cara nova! Conheça a UNIFOOD!</h2>
            <p>
              as grandes filas rotineiras sejam reduzidas, pois estas são responsáveis por tomar grande parte do
              tempo dos clientes, que por sua vez, não podem se dar ao luxo de ficarem longos períodos fora da sala de
              aula.
            </p>
          </div>
          <div className="intro-img">
            <img src="breakfast-not-optimized" alt="desenho de três pessoas" />
          </div>
        </div>
      </section>

      <section id="intro" className="white-bg section">
        <div className="main-content top3-content">
          <h2 className="grid-main-heading">TOP 3 JOBS</h2>
          <p>...</p>
        </div>
      </section>

      <section id="grid-one" className="grid-one main-bg section">
        <div className="main-content grid-one-content">
          <h2 className="grid-main-heading">O Futuro</h2>
          <p className="grid-description">Breve descrição</p>
          <div className="grid">
            <article><h3>TESTE 1</h3><p>...</p></article>
            <article><h3>TESTE 2</h3><p>...</p></article>
            <article><h3>TESTE 3</h3><p>...</p></article>
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
                <img src="./img/pastel.png" alt="random image" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="grid-two" className="grid-one main-bg section">
        <div className="main-content grid-one-content">
          <h2 className="grid-main-heading">O Futuro</h2>
          <p className="grid-description">Breve descrição</p>
          <div className="grid">
            <article><h3>TESTE 1</h3><p>...</p></article>
            <article><h3>TESTE 2</h3><p>...</p></article>
            <article><h3>TESTE 3</h3><p>...</p></article>
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
            <h2 className="grid-main-heading">De cara nova! Conheça a UNIFOOD!</h2>
            <p>...</p>
          </div>
          <div className="intro-img">
            <img src="assets/img/breakfast-not-optimized.svg" alt="desenho de três pessoas" />
          </div>

          <div className="contact-form">
            <fieldset className="form-grid">
              <legend>Contact me</legend>
              <div className="form-group">
                <label htmlFor="first-name">First Name</label>
                <input type="text" name="first-name" id="first-name" placeholder="Your First Name" />
              </div>
              <div className="form-group">
                <label htmlFor="last-name">Last Name</label>
                <input type="text" name="last-name" id="last-name" placeholder="Your Last Name" />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input type="email" name="email" id="email" placeholder="Your E-mail" />
              </div>
              <div className="form-group full-width">
                <label htmlFor="message">Message</label>
                <textarea name="message" id="message" cols="30" rows="10" placeholder="Sua Sugestão/reclamação"></textarea>
              </div>
              <div className="form-group full-width">
                <button type="submit">Send message</button>
              </div>
            </fieldset>
          </div>
        </div>
      </section>

      <footer id="footer" className="footer white-bg">
        <p>
          <a href="https://www.instagram.com/padua_nathan/">
            Feito com <span className="heart">❤</span> Nathan Pádua
          </a>
        </p>
      </footer>

      <a className="back-to-top" href="#">➔</a>
    </div>
  );
}

export default Home;
