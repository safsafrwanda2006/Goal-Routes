import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import "./smallScreens.css";
import axios from "axios";

function HomePage() {
  const aboutref = useRef(null);
  const navigate = useNavigate();
  const [isSliding, setIsSliding] = useState(false);
  const [auth, setAuth] = useState(false);
  useEffect(() => {
    axios
      .get("http://localhost:8080")
      .then((res) => {
        setAuth(true);
      })
      .catch((err) => {
        return console.log(err);
      });
  }, []);

  function viewabout() {
    const target = aboutref.current;
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  }

  const slideView = () => {
    setIsSliding(true);
  };
  const handleAnimationEnd = () => {
    navigate("/taskspage");
  };

  return (
    <>
      <div
        className={`container ${isSliding ? "slide-out" : ""}`}
        onAnimationEnd={isSliding ? handleAnimationEnd : undefined}
      >
        <header>
          <div>
            <Link className="logo-home" to="/">
              <h1>G</h1>
              <img src="rising.png" alt="" />
              <h1>R</h1>
            </Link>
          </div>
          <div className="menubtns">
            <button onClick={slideView}>
              <h4>start</h4> <img src="shuttle.png" alt="" />
            </button>
            {/* <button><h4>languages</h4> <img src="world.png" alt="" /></button> */}
            <button onClick={viewabout}>
              <h4>about</h4> <img src="info.png" alt="" />
            </button>
            {auth ? (
              <button>
                <h4>Account</h4>
                <img src="user.png" alt="" />
              </button>
            ) : (
              <Link to="/login">
                <button>
                  <h4>Login</h4>
                  <img src="user.png" alt="" />
                </button>
              </Link>
            )}
          </div>
        </header>

        <section className="hero">
          <div className="namesection">
            <h1>Design Your Success. Execute with Clarity.</h1>
            <p className="hero-text">
              Turn ambitious goals into structured roadmaps. Break them into
              focused tasks, track real progress, and move forward with
              measurable momentum.
            </p>
            <button onClick={slideView} className="getstarted" to="/taskspage">
              Get Started
              <img src="right.png" alt="" />
            </button>
          </div>
        </section>

        <footer className="footer">
          <h2 ref={aboutref}>GoalRoute</h2>
          <p>
            Transform your ambitions into reality. Track your growth, celebrate
            your achievements, and stay motivated every step of the way.
          </p>

          <div className="social-icons">
            <a href="mailto:safsafrwanda2006@gmail.com">
              <img src="email.png" alt="Email" />
            </a>
            <a href="http://wa.me/250794101251" target="_blank">
              <img src="whatsapp.png" alt="WhatsApp" />
            </a>
            <a href="https://www.facebook.com/mustfa.khamis.2025/">
              <img src="facebook.png" alt="GitHub" />
            </a>
            <a href="https://www.instagram.com/safsaf3469/">
              <img src="instgram.png" alt="LinkedIn" />
            </a>
          </div>

          <p className="footer-note">
            © 2025 GoalRoute. All rights reserved. | Developed by.
            <a
              className="Mustafa"
              href="https://safsafrwanda2006.github.io/Protfolio/"
              target="_blank"
            >
              {" "}
              <u>Mustafa Khamis</u>
            </a>
          </p>
        </footer>
      </div>
    </>
  );
}

export default HomePage;
