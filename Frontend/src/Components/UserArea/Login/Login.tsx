import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { CredentialsModel } from "../../../Models/CredentialsModel";
import { authService } from "../../../Services/AuthService";
import "./Login.css";
import { useEffect } from "react";
import { notify } from "../../../Utils/Notify";

export function Login(): JSX.Element {
    const { register, handleSubmit, formState: { errors } } = useForm<CredentialsModel>();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Login | Levana Vacations";
    }, []);

async function submit(credentials: CredentialsModel) {
    try {
        await authService.login(credentials);
        const name = authService.getDisplayName();
        notify.success(`Welcome back ${name}! 🏖️`);
        navigate("/vacations");
    } catch (err: any) {
        notify.error("Login failed: " + (err.response?.data || err.message));
    }
}

    return (
        <div className="LoginContainer">
            <form className="LoginBox" onSubmit={handleSubmit(submit)}>

                <h2 className="form-title">Welcome Back</h2>

                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        {...register("email", {
                            required: "Email is required",
                            pattern: {
                                value: /^\S+@\S+$/i,
                                message: "Invalid email format"
                            }
                        })}
                    />
                    <span className="error">{errors.email?.message || ""}</span>
                </div>

                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        {...register("password", {
                            required: "Password is required",
                            minLength: {
                                value: 4,
                                message: "Password must be at least 4 characters"
                            }
                        })}
                    />
                    <span className="error">{errors.password?.message || ""}</span>
                </div>

                <div className="form-actions">
                    <button className="btn-filled">Login</button>
                </div>
            </form>
        </div>
    );
}
