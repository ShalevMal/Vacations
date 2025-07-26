import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppState } from "../../../Redux/Store";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { vacationSlice } from "../../../Redux/VacationSlice";
import { likeActions } from "../../../Redux/LikeSlice";
import { likesService } from "../../../Services/LikeService";
import { notify } from "../../../Utils/Notify";
import { authService } from "../../../Services/AuthService";
import { VacationCard } from "../VacationCard/VacationCard";
import { VacationFilterPanel } from "../../LayoutArea/VacationFilterPanel/VacationFilterPanel";
import "./VacationList.css";
import heroBigImage from "../../../Assets/Images/vacation1.jpg";
import heroSmallImage from "../../../Assets/Images/fac.jpg";
import { Music } from "../../LayoutArea/Music/Music";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

export function VacationList(): JSX.Element {
    const vacations = useSelector((state: AppState) => state.vacations);
    const likes = useSelector((state: AppState) => state.likes);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAdmin = authService.isAdmin();

    const [filter, setFilter] = useState<"all" | "liked" | "active" | "future">("all");
    const [sortBy, setSortBy] = useState<"date" | "price">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
    const [currentPage, setCurrentPage] = useState(1);
    const vacationsPerPage = 9;
    const [searchText, setSearchText] = useState<string>("");


    useEffect(() => {
        document.title = "Vacations | Levana Vacations";
    }, []);

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            notify.info("Please log in to view vacations.");
            navigate("/login");
            return;
        }

        async function loadData() {
            try {
                const vacations = await vacationService.getAllVacations();
                const likesCount = await likesService.getLikesCountPerVacation();
                const userLikes = await likesService.getUserLikes();

                const likeState = vacations.reduce((acc, v) => {
                    const count = likesCount.find(l => l.vacationId === v._id)?.count ?? 0;
                    acc[v._id] = {
                        isLiked: userLikes.includes(v._id),
                        count
                    };
                    return acc;
                }, {} as AppState["likes"]);

                dispatch(vacationSlice.actions.initVacations(vacations));
                dispatch(likeActions.initLikes(likeState));
            } catch (err: any) {
                notify.error("Failed to load data: " + err.message);
            }
        }

        loadData();
    }, []);

    async function handleLike(vacationId: string) {
        const current = likes[vacationId];
        if (!current) return;

        try {
            if (current.isLiked) {
                await likesService.unlike(vacationId);
            } else {
                await likesService.like(vacationId);
            }
            dispatch(likeActions.toggleLike({ vacationId }));
        } catch (err: any) {
            notify.error("Failed to update like: " + err.message);
        }
    }

    function handleEdit(vacation: VacationModel) {
        navigate("/vacations/edit/" + vacation._id);
    }

    function handleDelete(vacationId: string) {
        confirmAlert({
            title: 'Confirm Deletion',
            message: 'Are you sure you want to delete this vacation?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: async () => {
                        try {
                            await vacationService.deleteVacation(vacationId);
                            dispatch(vacationSlice.actions.deleteVacation(vacationId));
                            notify.success("Vacation deleted.");
                        } catch (err: any) {
                            notify.error("Failed to delete vacation: " + (err?.message || "Unknown error"));
                        }
                    }
                },
                {
                    label: 'Cancel'
                }
            ]
        });
    }

    function getFilteredVacations(): VacationModel[] {
        const now = new Date();
        let result = [...vacations];

        switch (filter) {
            case "liked":
                result = result.filter(v => likes[v._id]?.isLiked);
                break;
            case "active":
                result = result.filter(v => new Date(v.startDate) <= now && new Date(v.endDate) >= now);
                break;
            case "future":
                result = result.filter(v => new Date(v.startDate) > now);
                break;
        }

        if (searchText.trim()) {
            result = result.filter(v =>
                v.destination.toLowerCase().includes(searchText.toLowerCase())
                ||
                v.description.toLowerCase().includes(searchText.toLowerCase())
            );
        }

        result.sort((a, b) => {
            if (sortBy === "price") {
                return sortOrder === "asc" ? a.price - b.price : b.price - a.price;
            } else {
                return sortOrder === "asc"
                    ? new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
                    : new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
            }
        });

        return result;
    }

    const filteredVacations = getFilteredVacations();
    const totalPages = Math.ceil(filteredVacations.length / vacationsPerPage);
    const currentVacations = filteredVacations.slice(
        (currentPage - 1) * vacationsPerPage,
        currentPage * vacationsPerPage
    );

const columnsPerRow = 4;
const lastRowCount = currentVacations.slice(6, 9).length;
const remainingSpots = columnsPerRow - lastRowCount;
const showInspiration = currentVacations.length >= 7;


const getInspireStyle = () => {
    if (remainingSpots > 0) {
        return { gridColumn: `span ${remainingSpots}` };
    }
    return { display: "none" }; 
};

    return (
        <div className="VacationList container mx-auto px-4 py-12">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-4 mb-8">
                <VacationFilterPanel
                    currentFilter={filter}
                    setFilter={(f) => {
                        setFilter(f);
                        setCurrentPage(1);
                    }}
                    sortBy={sortBy}
                    sortOrder={sortOrder}
                    onSortByChange={setSortBy}
                    onSortOrderChange={setSortOrder}
                    onSearchTextChange={(text) => {
                        setSearchText(text);
                        setCurrentPage(1);
                    }}
                    isAdmin={isAdmin}
                />
            </div>

            <div className="hero-section">
                <div className="hero-image">
                    <img src={heroBigImage} alt="Hero" />
                    <div className="hero-title-overlay">
                        <h1>Explore Your Next Vacation</h1>
                    </div>
                    <Music />
                </div>

                {currentVacations.slice(0, 2).map(v => (
                    <VacationCard
                        key={v._id}
                        vacation={v}
                        isAdmin={isAdmin}
                        isLiked={likes[v._id]?.isLiked || false}
                        onLike={handleLike}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <div className="vacation-row">
                {currentVacations.slice(2, 6).map(v => (
                    <VacationCard
                        key={v._id}
                        vacation={v}
                        isAdmin={isAdmin}
                        isLiked={likes[v._id]?.isLiked || false}
                        onLike={handleLike}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}
            </div>

            <div className="vacation-row">
                {currentVacations.slice(6, 9).map(v => (
                    <VacationCard
                        key={v._id}
                        vacation={v}
                        isAdmin={isAdmin}
                        isLiked={likes[v._id]?.isLiked || false}
                        onLike={handleLike}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}

    {showInspiration && remainingSpots > 0 && (
        <div className="inspire-card" style={getInspireStyle()}>
            <img src={heroSmallImage} alt="Inspiration" />
        </div>
    )}
</div>

            <div className="pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                        key={page}
                        className={page === currentPage ? "pagination-button active" : "pagination-button"}
                        onClick={() => setCurrentPage(page)}
                    >
                        {page}
                    </button>
                ))}
            </div>
        </div>
    );
}
