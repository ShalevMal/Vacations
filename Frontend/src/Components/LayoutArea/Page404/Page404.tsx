import { useNavigate } from "react-router-dom";
import "./Page404.css";

export function Page404() {
    const navigate = useNavigate();

    return (
        <div className="Page404">
            <div className="Overlay">
                <p className="message">The page you were looking for doesn't exist.</p>
                <button className="BackBtn" onClick={() => navigate("/")}>
                    Go Home
                </button>
            </div>
        </div>
    );
}