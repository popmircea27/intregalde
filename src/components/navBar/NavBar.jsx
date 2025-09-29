// 📄 src/components/Navbar.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom"; // (opțional, dar recomandat pentru SPA)
import "./navbar.css";


export default function Navbar() {
    // Dacă nu folosești react-router, poți reveni la window.location
    let navigate;
    let pathname = "/";
    try {
        navigate = useNavigate();
        const location = useLocation();
        pathname = location?.pathname || "/";
    } catch {
        navigate = (p) => (window.location.href = p);
        pathname = window.location?.pathname || "/";
    }


    const goto = (p) => navigate(p);


    return (
        <nav className="navbar">
            <div className="navbar-inner">
                <button
                    type="button"
                    aria-current={pathname === "/postari" ? "page" : undefined}
                    className={`nav-link ${pathname === "/postari" ? "active" : ""}`}
                    onClick={() => goto("/postari")}
                >
                    Evenimente
                </button>


                <button
                    type="button"
                    className="logo-btn"
                    onClick={() => goto("/postari")}
                    aria-label="Acasă"
                >
                    <img
                        src="/src/assets/Logo Drag de Intregalde.svg"
                        alt="Logo Asociația Integralde"
                        className="logo"
                    />
                </button>


                <button
                    type="button"
                    aria-current={pathname === "/poveste" ? "page" : undefined}
                    className={`nav-link ${pathname === "/poveste" ? "active" : ""}`}
                    onClick={() => goto("/poveste")}
                >
                    Povestea noastra
                </button>
            </div>
        </nav>
    );
}