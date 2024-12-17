import { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './Nav.css';
import logo from "../../assets/y.png"

const Nav = () => {
    const [isMobile, setIsMobile] = useState(false);

    return (
        <>
            <nav className="nav1bar">
                <Link to="/"><div className="logo"><img className='img' src={logo} alt=''/>Yeshwant</div></Link>
                {/* <span className="menu-toggle" onClick={() => setIsMobile(!isMobile)}>
                    &#9776;
                </span> */}
                <ul className={`nav1-links ${isMobile ? 'active' : ''}`}>
                    <li className="nav1-item">
                        <NavLink to="/student_login" className="nav1-link" >Student</NavLink>
                    </li>
                    <li className="nav1-item">
                        <NavLink to="/employer_login" className="nav1-link" >Employer</NavLink>
                    </li>
                </ul>
            </nav>
        </>
    );
};

export default Nav;

