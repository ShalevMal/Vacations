import { useNavigate } from "react-router-dom";
import "./Home.css";
import beachHero from "../../../Assets/Images/beach-hero.jpg";
import { useEffect } from "react";

export function Home() {
    const navigate = useNavigate();

     useEffect(() => {
        document.title = "Home | Levana Vacations";
    }, []);

    const goToVacations = () => {
        navigate("/vacations");
    };


    return (
        <section className="HeroSection" style={{ backgroundImage: `url(${beachHero})` }}>
            <div className="HeroContent">
                <h1>Not just a vacation.<br />Your story starts here.</h1>
                <p>Unique destinations. Unforgettable moments. Only with Levana.</p>
                <button className="HeroCTA" onClick={goToVacations}>Explore Now</button>
            </div>
        </section>
    );
}
