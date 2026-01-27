import "../App.css"
import { useRef } from "react";
import { Link } from "react-router-dom"

function Header() {
      const aboutref=useRef(null);
  
    function viewabout (){
    const target=aboutref.current;
    if(target){
      target.scrollIntoView({behavior: "smooth"});
      }
    };
    
  return (
    <>
    <header>
        <div className="logo">
            <h1>G</h1><Link to="/"> <img src="rising.png" alt=""/></Link><h1>P</h1>
        </div>
        <div className="menubtns">
            <button>start</button>
            <button>languages</button>
            <button
            onClick={viewabout}
            >about</button>
        </div>
      </header>
      </>
  )
}

export default Header

export function Footer() {
     const aboutref=useRef(null);
  function viewabout (){
    const target=aboutref.current;
    if(target){
      target.scrollIntoView({behavior: "smooth"});
      }
    };
        
  return (
    <>
         <footer class="footer">
            <h2
            ref={aboutref}
            >About Us</h2>
            <p>Feel free to reach out for collaboration or opportunities.</p>

            <div class="social-icons">
                <a href="mailto:safsafrwanda2006@gmail.com"><img src="email.png" alt="Email"></img></a>
                <a href="http://wa.me/250794101251" target="_blank"><img src="whatsapp.png" alt="WhatsApp"></img></a>
                <a href="https://github.com/safsafrwanda2006"><img src="github-sign.png" alt="GitHub"></img></a>
                <a href="https://www.linkedin.com/in/mustafa-hassan-b26ab5370/"><img src="linkedin (1).png" alt="LinkedIn"></img></a>
            </div>

            <span>© 2025 Gradual Progress. All rights reserved.</span><span>Developed by</span><Link className='Mustafa' to="https://safsafrwanda2006.github.io/Protfolio/"><u>Mustafa Khamis</u></Link>
     </footer>
    </>
  )
}