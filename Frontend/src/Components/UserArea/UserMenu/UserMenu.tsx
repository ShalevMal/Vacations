import { useSelector } from "react-redux";
import "./UserMenu.css";
import { AppState } from "../../../Redux/Store";
import { UserModel } from "../../../Models/UserModel";
import { NavLink } from "react-router-dom";
import { userService } from "../../../Services/UserService";

export function UserMenu(): JSX.Element {

    const user = useSelector<AppState, UserModel>(store => store.user);

function logMeOut() {
    userService.logout();
}

    return (
        <div className="UserMenu">
            {!user && <div>
                <span> Hello Guest | </span>
                <NavLink to="/login">Login</NavLink>
                <span> | </span>
                <NavLink to="/register">Register</NavLink>
            </div>}

            {user && <div>
                    <span> Hello {user.firstName} {user.lastName} | </span>
                    <NavLink to="/home" onClick={logMeOut}>Logout</NavLink>
            </div>}

        </div>
    );
}
