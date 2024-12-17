import "./foot.css"

function FooterAdmin(){
    return(
        <>
  {/* ===== BOX ICONS ===== */}
  <link
    href="https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css"
    rel="stylesheet"
  />
  {/*===== FOOTER =====*/}
  <footer className="footer">
    <div className="footer__container bd-container">
      <h2 className="footer__title">Abhishek Bhoyar</h2>
      <p className="footer__description">
        The Trailblazer
      </p>
      <div className="footer__social">
        <a href="https://www.linkedin.com/in/abhishek-bhoyar-a28617229/"className="footer__link">
          <i className="bx bxl-linkedin" />
        </a>
        <a href="https://github.com/anon576"className="footer__link">
          <i className="bx bxl-github" />
        </a>
  
      </div>
      <p className="footer__copy">© 2024 Abhishek. All right reserved</p>
    </div>
  </footer>
</>

    )
}


export default FooterAdmin;