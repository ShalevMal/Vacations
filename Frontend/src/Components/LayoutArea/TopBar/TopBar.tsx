import { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import "./TopBar.css";
import { authService } from "../../../Services/AuthService";

export function TopBar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    const isLoggedIn = authService.isLoggedIn();
    const isAdmin = authService.isAdmin();
    const firstName = authService.getDisplayName();

    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 10);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const logout = () => {
        authService.logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const handleLinkClick = (path: string) => {
        setMenuOpen(false);
        navigate(path);
    };

    const navLinks = (
        <>
            <NavLink to="/home" onClick={() => handleLinkClick("/home")}>Home</NavLink>
            <NavLink to="/vacations" onClick={() => handleLinkClick("/vacations")}>Vacations</NavLink>
            {isAdmin && (
                <>
                    <NavLink to="/add-vacation" onClick={() => handleLinkClick("/add-vacation")}>Add</NavLink>
                    <NavLink to="/admin/report" onClick={() => handleLinkClick("/admin/report")} className="report-link"> Report</NavLink>
                </>
            )}
        </>
    );

    const authButtons = isLoggedIn ? (
        <>
            <span className="user-greeting">Hello {firstName}</span>
            <button className="logout-btn" onClick={logout}>Logout</button>
        </>
    ) : (
        <>
            <button className="btn-outline" onClick={() => handleLinkClick("/login")}>Login</button>
            <button className="btn-filled" onClick={() => handleLinkClick("/register")}>Register</button>
        </>
    );

    return (
        <header className={`TopBar ${isScrolled ? "scrolled" : ""}`}>
            <div className={`TopBarContent ${menuOpen ? "open-menu" : ""}`}>

                <div className="logo" onClick={() => handleLinkClick("/")}>Levana</div>

                <div className="burger-icon" onClick={() => setMenuOpen(!menuOpen)}>
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className={`bar ${menuOpen ? "open" : ""}`}></div>
                    ))}
                </div>

                <nav className="nav-links desktop-only">{navLinks}</nav>
                <div className="auth-buttons desktop-only">{authButtons}</div>

                {menuOpen && (
                    <div className="mobile-menu">
                        {navLinks}
                        {authButtons}
                    </div>
                )}
            </div>
        </header>
    );
}
