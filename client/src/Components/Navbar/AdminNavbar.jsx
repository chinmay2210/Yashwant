import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "./navbar.css";

function Navbar() {
  const navigate = useNavigate();

  useEffect(() => {
    const navbar = document.querySelector(".navbar");
    const searchBox = document.querySelector(".search-box .bx-search");
    const navLinks = document.querySelector(".nav-links");
    const menuOpenBtn = document.querySelector(".navbar .bx-menu");
    const menuCloseBtn = document.querySelector(".nav-links .bx-x");
    const htmlcssArrow = document.querySelector(".htmlcss-arrow");
    const moreArrow = document.querySelector(".more-arrow");
    const jsArrow = document.querySelector(".js-arrow");

    if (searchBox) {
      searchBox.addEventListener("click", () => {
        navbar.classList.toggle("showInput");
        if (navbar.classList.contains("showInput")) {
          searchBox.classList.replace("bx-search", "bx-x");
        } else {
          searchBox.classList.replace("bx-x", "bx-search");
        }
      });
    }

    if (menuOpenBtn) {
      menuOpenBtn.onclick = function () {
        navLinks.style.left = "0";
      };
    }

    if (menuCloseBtn) {
      menuCloseBtn.onclick = function () {
        navLinks.style.left = "-100%";
      };
    }

    if (htmlcssArrow) {
      htmlcssArrow.onclick = function () {
        navLinks.classList.toggle("show1");
      };
    }

    if (moreArrow) {
      moreArrow.onclick = function () {
        navLinks.classList.toggle("show2");
      };
    }

    if (jsArrow) {
      jsArrow.onclick = function () {
        navLinks.classList.toggle("show3");
      };
    }

    // Cleanup function
    return () => {
      if (searchBox) {
        searchBox.removeEventListener("click", () => { });
      }
      if (menuOpenBtn) {
        menuOpenBtn.onclick = null;
      }
      if (menuCloseBtn) {
        menuCloseBtn.onclick = null;
      }
      if (htmlcssArrow) {
        htmlcssArrow.onclick = null;
      }
      if (moreArrow) {
        moreArrow.onclick = null;
      }
      if (jsArrow) {
        jsArrow.onclick = null;
      }
    };
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/admin_login");
  }

  const employerRequest = () => {
    navigate("/admin/employers");
  }



  const role = localStorage.getItem("role");


    return (
      <>
        <link
          href="https://unpkg.com/boxicons@2.0.7/css/boxicons.min.css"
          rel="stylesheet"
        />
        <nav>
          <div className="navbar">
            <i className="bx bx-menu" />
            <div className="logo">
              <a href="/admin">Yeshwant</a>
            </div>
            <div className="nav-links">
              <div className="sidebar-logo">
                <span className="logo-name">YCCETPC</span>
                <i className="bx bx-x" />
              </div>
              <ul className="links">
                <li>
                  <Link to="/admin">HOME</Link>
                </li>
                <li>
                  <a href="#">COORDINATOR</a>
                  <i className="bx bxs-chevron-down htmlcss-arrow arrow" />
                  <ul className="htmlCss-sub-menu sub-menu">
                    <li>
                      <Link to="/admin/create_coordinator">CREATE</Link>
                    </li>
                    <li>
                      <Link to="/admin/view_coordinator">VIEW</Link>
                    </li>
                  </ul>
                </li>
                {role !== 'subadmin' && (
                  <li>
                    <a href="#">SUBADMIN</a>
                    <i className="bx bxs-chevron-down htmlcss-arrow arrow" />
                    <ul className="htmlCss-sub-menu sub-menu">
                      <li>
                        <Link to="/admin/create_subadmin">CREATE</Link>
                      </li>
                      <li>
                        <Link to="/admin/view_subadmin">VIEW</Link>
                      </li>
                    </ul>
                  </li>
                )}
                <li>
                  <a href="#">CAMPUS</a>
                  <i className="bx bxs-chevron-down js-arrow arrow" />
                  <ul className="js-sub-menu sub-menu">
                    <li>
                      <Link to="/admin/campus_create">CREATE</Link>
                    </li>
                    <li>
                      <Link to="/admin/campus">VIEW</Link>
                    </li>
                    <li>
                      <Link to="/admin/add_study_material">PREP MATERIAL</Link>
                    </li>
                    <li>
                      <Link to="/admin/read_notification">NOTIFICATION</Link>
                    </li>
                    <li>
                      <Link to="/admin/create_notification">CREATE NOTIFICATION</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">STUDENT</a>
                  <i className="bx bxs-chevron-down js-arrow arrow" />
                  <ul className="js-sub-menu sub-menu">
                    <li>
                      <Link to="/admin/add_students">UPLOAD STUDENT PROFILE</Link>
                    </li>
                    <li>
                      <Link to="/admin/view_students">VIEW STUDENT</Link>
                    </li>
                    <li>
                      <Link to="/admin/skill">STUDENT SKILLS</Link>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">EMPLOYER</a>
                  <i className="bx bxs-chevron-down js-arrow arrow" />
                  <ul className="js-sub-menu sub-menu">
                    <li>
                      <Link to="/admin/employers">VIEW EMPLOYERS</Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
            {/* <button onClick={employerRequest} className="signin">Notifcation</button> */}
            <button onClick={logout} className="signin">SIGN OUT</button>
          </div>
        </nav>
      </>
    );
 
}

export default Navbar;
