import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import { Home } from "../../PagesArea/Home/Home";
import { Page404 } from "../Page404/Page404";
import "./Routing.css";
import { VacationList } from "../../VacationArea/VacationList/VacationList";
import { Register } from "../../UserArea/Register/Register";
import { Login } from "../../UserArea/Login/Login";
import { EditVacation } from "../../VacationArea/EditVacation/EditVacation";
import { AddVacation } from "../../VacationArea/AddVacation/AddVacation";
import { VacationDetails } from "../../VacationArea/VacationDetails/VacationDetails";
import { VacationReport } from "../VacationReport/VacationReport";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { authService } from "../../../Services/AuthService";
import { authActions } from "../../../Redux/UserState";
import { appConfig } from "../../../Utils/AppConfig";

export function Routing() {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!authService.isLoggedIn()) {
            authService.logout(); 
            dispatch(authActions.logout()); 
            navigate("/home"); 
        }
    }, []);

    // ________________________________________________________________________
    useEffect(() => {
    fetch(appConfig.vacationsUrl)
        .then(res => res.json())
        .catch(err => console.error("❌ Error fetching vacations:", err));
}, []);
    // ________________________________________________________________________

    
        return (
        <div className="Routing">
            <Routes>
                <Route path="/" element={<Navigate to="/home" />} />
                <Route path="/home" element={<Home />} />
                <Route path="/vacations" element={<VacationList />} />
                <Route path="*" element={<Page404 />} />
                <Route path="/register" element={<Register />} />
                <Route path="/login" element={<Login />} />
                <Route path="/vacations/edit/:vacationId" element={<EditVacation />} />
                <Route path="/add-vacation" element={<AddVacation />} />
                <Route path="/vacation-details/:prodId" element={<VacationDetails />} />
                <Route path="/admin/report" element={<VacationReport />} />
                <Route path="//" element={<EditVacation />} />

            </Routes>
        </div>
    );
}
