import { useEffect } from "react";
import { Routing } from "../Routing/Routing";
import { TopBar } from "../TopBar/TopBar";
import "./Layout.css";
import beachHero from "../../../Assets/Images/beach-hero.jpg"; 

export function Layout() {
    useEffect(() => {
        document.documentElement.style.setProperty(
            "--beach-hero-image",
            `url(${beachHero})`
        );
    }, []);

    return (
        <div className="Layout">
            <TopBar />
            <main className="MainLayout">
                <Routing />
            </main>
        </div>
    );
}
