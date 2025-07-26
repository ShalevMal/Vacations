import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { appConfig } from "../../../Utils/AppConfig";
import { useDispatch, useSelector } from "react-redux";
import { likesService } from "../../../Services/LikeService";
import { likeActions } from "../../../Redux/LikeSlice";
import { AppState } from "../../../Redux/Store";
import "./VacationDetails.css";
import { authService } from "../../../Services/AuthService";

export function VacationDetails(): JSX.Element {
    const params = useParams();
    const _id = params.prodId!;
    const [vacation, setVacation] = useState<VacationModel | null>(null);
    const [wikiInfo, setWikiInfo] = useState<string>("");

    const dispatch = useDispatch();
    const likeState = useSelector((state: AppState) => state.likes[_id]);
    const isAdmin = authService.isAdmin();
    const navigate = useNavigate();



    useEffect(() => {
        document.title = "Vacation Details | Levana Vacations";
    }, []);

    useEffect(() => {
        vacationService.getOneVacation(_id)
            .then(v => setVacation(v))
            .catch(err => notify.error(err));
    }, [_id]);

    useEffect(() => {
        if (!vacation) return;

        async function fetchWiki() {
            try {
                const url = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(vacation.destination)}`;
                const response = await fetch(url);
                const data = await response.json();

                setWikiInfo(data.extract || "No additional information found.");
            } catch {
                setWikiInfo("No additional information found.");
            }
        }

        fetchWiki();
    }, [vacation?.destination]);

    async function toggleLike() {
        try {
            if (!vacation) return;
            if (likeState?.isLiked) {
                await likesService.unlike(vacation._id);
            } else {
                await likesService.like(vacation._id);
            }
            dispatch(likeActions.toggleLike({ vacationId: vacation._id }));
        } catch {
            notify.error("Like failed");
        }
    }

    if (!vacation || !likeState) return <div className="VacationDetails loading">Loading...</div>;

    const imageUrl = appConfig.vacationImagesUrl + vacation.imageName;

    return (
        <div className="VacationDetails">
            <div className="image-side">
                <img src={imageUrl} alt={vacation.destination} />
            </div>

            <div className="info-side">
                <h1>{vacation.destination}</h1>

                <div className="scrollable-content">
                    <div className="info-grid">
                        <div className="row">
                            <span className="label">📅 Dates:</span>
                            <span className="value">
                                {new Date(vacation.startDate).toLocaleDateString()} → {new Date(vacation.endDate).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="row">
                            <span className="label">💰 Price:</span>
                            <span className="value">${vacation.price.toLocaleString()}</span>
                        </div>

                        <div className="row full">
                            <span className="label">📝 Description:</span>
                            <span className="value">{vacation.description}</span>
                        </div>
                        {wikiInfo && (
                            <div className="row full">
                                <span className="label">🌍 About the destination:</span>
                                <span className="value">{wikiInfo}</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="actions">
                    <button
                        className="back-btn"
                        onClick={() => navigate("/vacations")}
                    >
                        ← Back
                    </button>

                    {!isAdmin && (
                        <div className="like" onClick={toggleLike}>
                            <span className="heart">{likeState.isLiked ? "❤️" : "🤍"}</span>
                            <span>{likeState.count} liked this</span>
                        </div>
                    )}

                    <button
                        className="booking-btn"
                        onClick={() => {
                            const destination = encodeURIComponent(vacation.destination);
                            const start = new Date(vacation.startDate);
                            const end = new Date(vacation.endDate);

                            const url = `https://www.booking.com/searchresults.html?ss=${destination}` +
                                `&checkin_year=${start.getFullYear()}` +
                                `&checkin_month=${start.getMonth() + 1}` +
                                `&checkin_monthday=${start.getDate()}` +
                                `&checkout_year=${end.getFullYear()}` +
                                `&checkout_month=${end.getMonth() + 1}` +
                                `&checkout_monthday=${end.getDate()}`;

                            window.open(url, "_blank");
                        }}
                    >
                        🚀 Book this vacation
                    </button>
                </div>
            </div>
        </div>
    );
}
