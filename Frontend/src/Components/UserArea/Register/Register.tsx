import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../../Models/UserModel";
import { authService } from "../../../Services/AuthService";
import { useEffect } from "react";
import "./Register.css";
import { notify } from "../../../Utils/Notify";

export function Register(): JSX.Element {

    const { register, handleSubmit, formState: { errors } } = useForm<UserModel>();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Register | Levana Vacations";
    }, []);

    async function submit(user: UserModel) {
        try {
            await authService.register(user);
            notify.success("Welcome! You're registered successfully.");
            navigate("/vacations");
        } catch (err: any) {
            notify.error("Registration failed: " + (err.response?.data || err.message));
        }
    }

    return (
        <div className="RegisterContainer">
            <form className="RegisterBox" onSubmit={handleSubmit(submit)}>
                <h2>Create Account</h2>

                <div className="form-grid">

                    <div className="form-group-col">
                        <div className="form-group">
                            <label>First Name</label>
                            <input type="text" {...register("firstName", { required: true, minLength: 2 })} />
                            <span className="error-message">{errors.firstName && "Missing or too short"}</span>
                        </div>

                        <div className="form-group">
                            <label>Last Name</label>
                            <input type="text" {...register("lastName", { required: true, minLength: 2 })} />
                            <span className="error-message">{errors.lastName && "Missing or too short"}</span>
                        </div>
                    </div>

                    <div className="divider" />

                    <div className="form-group-col">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" {...register("email", { required: true })} />
                            <span className="error-message">{errors.email && "Invalid email"}</span>
                        </div>

                        <div className="form-group">
                            <label>Password</label>
                            <input type="password" {...register("password", { required: true, minLength: 4 })} />
                            <span className="error-message">{errors.password && "Min 4 characters"}</span>
                        </div>
                    </div>
                </div>

                <button className="btn-filled">Register</button>
            </form>
        </div>
    );
}
