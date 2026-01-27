import { useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../App.css'
import './smallScreens.css'


function HomePage() {
  const aboutref = useRef(null);
  const navigate = useNavigate();
  const [isSliding, setIsSliding] = useState(false);

  function viewabout() {
    const target = aboutref.current;
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  const slideView = () => {
    setIsSliding(true);
  };
  const handleAnimationEnd = () => {
    navigate('/taskspage');
  };

  return (
    <>
      <div className={`container ${isSliding ? "slide-out" : ""}`}
        onAnimationEnd={isSliding ? handleAnimationEnd : undefined}
      >
        <header>
          <div>
            <Link className="logo-home" to="/"><h1>G</h1><img src="rising.png" alt="" /><h1>R</h1></Link>
          </div>
          <div className="menubtns">
            <button
              onClick={slideView}
            ><h4>start</h4> <img src="shuttle.png" alt="" /></button>
            {/* <button><h4>languages</h4> <img src="world.png" alt="" /></button> */}
            <button
              onClick={viewabout}
            ><h4>about</h4> <img src="info.png" alt="" /></button>
          </div>
        </header>

        <section className="hero">
          <div className="namesection">
            <h1>GoalRoutes</h1>
            <p className="hero-text">
              Turn big goals into clear, manageable steps and track your progress with confidence.
            </p>
            <button
              onClick={slideView}
              className='getstarted'
              to="/taskspage">Get Started
              <img src="right.png" alt="" />
            </button>
          </div>
          <div className="animationsec">

            <div className="cards-stack">
              <div className="space"><h1></h1></div>
              <div className="card card1">
                <div className="icon">
                  <img src="career (1).png" alt="" />
                </div>
                <div className="advice">
                  <h1>Every big goal starts with a small step</h1>
                </div>
              </div>
              <div className="card card2">
                <div className="icon">
                  <img src="clipboard-gear.png" alt="" />
                </div>
                <div className="advice">
                  <h1 className='first-card'>Organize your journey.</h1>
                  <h1 className='first-card'>Track your progress</h1>
                </div>
              </div>

              <div className="card card3">
                <div className="icon">
                  <img src="success.png" alt="" />
                </div>
                <div className="advice">
                  <h1>Progress gradually. Reach consistently</h1>
                </div>
              </div>
              <div className="space2"><h1></h1></div>
            </div>

          </div>
        </section>

        <footer className="footer">
          <h2
          ref={aboutref}
          >GoalRoutes</h2>
          <p>
            Transform your ambitions into reality. Track your growth, celebrate your achievements,
            and stay motivated every step of the way.
          </p>

          <div className="social-icons">
            <a href="mailto:safsafrwanda2006@gmail.com"><img src="email.png" alt="Email" /></a>
            <a href="http://wa.me/250794101251" target="_blank"><img src="whatsapp.png" alt="WhatsApp" /></a>
            <a href="https://github.com/safsafrwanda2006"><img src="facebook.png" alt="GitHub" /></a>
            <a href="https://www.linkedin.com/in/mustafa-hassan-b26ab5370/"><img src="instgram.png" alt="LinkedIn" /></a>
          </div>

          <p className="footer-note">
            © 2025 GoalRoutes. All rights reserved. | Developed by
            <a className='Mustafa' href="https://safsafrwanda2006.github.io/Protfolio/" target="_blank"><u>Mustafa Khamis</u></a>
          </p>
        </footer>

      </div>
    </>
  )
}

export default HomePage