import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/Store";
import { VacationModel } from "../../../Models/VacationModel";
import { appConfig } from "../../../Utils/AppConfig";
import "./VacationCard.css";

type VacationCardProps = {
    vacation: VacationModel;
    isAdmin: boolean;
    isLiked: boolean;
    onLike: (vacationId: string) => void;
    onEdit?: (vacation: VacationModel) => void;
    onDelete?: (vacationId: string) => void;
};

export function VacationCard({
    vacation,
    isAdmin,
    isLiked,
    onLike,
    onEdit,
    onDelete
}: VacationCardProps): JSX.Element {

    const navigate = useNavigate();

    const likesState = useSelector((state: AppState) => state.likes);
    const likesCount = likesState[vacation._id]?.count ?? 0;

    function handleCardClick() {
        navigate("/vacation-details/" + vacation._id);
    }

    function stopPropagation(e: React.MouseEvent) {
        e.stopPropagation();
    }

    const imageUrl = appConfig.vacationImagesUrl + vacation.imageName;

return (
    <div className="VacationCard" onClick={handleCardClick}>

        <div className="image-wrapper">
            <img src={imageUrl} alt={vacation.destination} crossOrigin="anonymous" />
            <div className="destination-title">{vacation.destination}</div>
        </div>

        {!isAdmin && (
            <div className="like-container" onClick={stopPropagation}>
                <button className="like-btn" onClick={() => onLike(vacation._id)}>
                    {isLiked ? "❤️" : "🤍"}
                </button>
                <span className="likes-count">{likesCount}</span>
            </div>
        )}

        <div className="vacation-content">

            <div className="description-container">
                <p className="description">
                    {vacation.description}
                </p>
            </div>

            <hr className="vacation-separator" />

            <div className="dates">
                {new Date(vacation.startDate).toLocaleDateString()} →{" "}
                {new Date(vacation.endDate).toLocaleDateString()}
            </div>

            <div className="bottom-row">
                <span className="price">${vacation.price.toLocaleString()}</span>

                {isAdmin && (
                    <div className="admin-actions" onClick={stopPropagation}>
                        <button className="edit-btn" onClick={() => onEdit?.(vacation)}>✏️</button>
                        <button className="delete-btn" onClick={() => onDelete?.(vacation._id)}>🗑️</button>
                    </div>
                )}
            </div>

        </div>
    </div>
);
}
