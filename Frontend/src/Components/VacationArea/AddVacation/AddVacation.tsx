import { useForm } from "react-hook-form";
import { VacationModel } from "../../../Models/VacationModel";
import { vacationService } from "../../../Services/VacationService";
import { notify } from "../../../Utils/Notify";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { vacationSlice } from "../../../Redux/VacationSlice";
import { authService } from "../../../Services/AuthService";
import "./AddVacation.css";

export function AddVacation(): JSX.Element {

        document.title = "Add Vacation | Levana Vacations";

    const { register, handleSubmit, formState, setError, setValue } = useForm<VacationModel>();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [preview, setPreview] = useState<string | null>(null);

    useEffect(() => {
        if (!authService.isAdmin()) {
            notify.error("Access denied.");
            navigate("/home");
        }
    }, [navigate]);

    async function send(vacation: VacationModel) {
        try {
            if (new Date(vacation.startDate) >= new Date(vacation.endDate)) {
                setError("endDate", {
                    type: "manual",
                    message: "End date must be after start date"
                });
                return;
            }

            vacation.image = (vacation.image as unknown as FileList)[0];
            await vacationService.addVacation(vacation);
            notify.success("Vacation has been added.");

            const vacations = await vacationService.getAllVacations();
            dispatch(vacationSlice.actions.initVacations(vacations));

            navigate("/vacations");
        }
        catch (err: any) {
            notify.error(err);
        }
    }

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setPreview(reader.result as string);
        reader.readAsDataURL(file);
    }

    function cancelImage() {
        setPreview(null);
        setValue("imageName", "default.png");
    }

    return (
        <div className="AddVacation">
            <h2 className="form-title">Add New Vacation</h2>

            <form onSubmit={handleSubmit(send)} className="add-vacation-form">
                <div className="form-layout">

                    <div className="left-column">

                        <div className="form-group">
                            <label>Destination</label>
                            <input
                                type="text"
                                placeholder="e.g. Barcelona"
                                {...register("destination", {
                                    required: true,
                                    minLength: 3,
                                    maxLength: 50,
                                    pattern: /^[A-Za-z\u0590-\u05FF0-9\s.'-]+$/
                                })}
                            />
                            <span className="error">
                                {formState.errors.destination?.message || (formState.errors.destination && "Destination must be 3–50 characters") || " "}
                            </span>
                        </div>

                        <div className="form-row dates-row">
                            <div className="form-group small">
                                <label>Start Date</label>
                                <input
                                    type="date"
                                    {...register("startDate", { required: true })}
                                />
                                <span className="error">
                                    {formState.errors.startDate?.message || " "}
                                </span>
                            </div>
                            <div className="form-group small">
                                <label>End Date</label>
                                <input
                                    type="date"
                                    {...register("endDate", { required: true })}
                                />
                                <span className="error">
                                    {formState.errors.endDate?.message || (formState.errors.endDate && "End date must be after start date") || " "}
                                </span>
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Price (USD)</label>
                            <input
                                type="number"
                                placeholder="$"
                                {...register("price", {
                                    required: true,
                                    min: 1,
                                    max: 100000
                                })}
                            />
                            <span className="error">
                                {formState.errors.price?.message || (formState.errors.price && "Price must be between 1–100,000") || " "}
                            </span>
                        </div>

                    </div>

                    <div className="right-column">

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                placeholder="Describe the vacation..."
                                {...register("description", {
                                    required: true,
                                    minLength: 5,
                                    maxLength: 100,
                                    pattern: /^[\p{L}\p{N}\p{P}\p{Z}\p{Emoji}]+$/u
                                })}
                            />
                            <span className="error">
                                {formState.errors.description?.message || (formState.errors.description && "Description must be 5–100 characters.") || " "}
                            </span>
                        </div>

                        <div className="form-group">
                            <label>Cover Image</label>
                            <div className="custom-file-upload">

                                <div className={`upload-content ${preview ? "hidden" : ""}`}>
                                    <span role="img" aria-label="camera">📷</span>
                                    <span>Select Image</span>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        {...register("image")}
                                        onChange={handleImageChange}
                                    />
                                </div>
                                {preview && (
                                    <>
                                        <img src={preview} alt="Preview" className="inline-preview" />
                                        <button type="button" className="cancel-preview-btn" onClick={cancelImage}>
                                            Cancel Image
                                        </button>
                                    </>
                                )}
                            </div>
                            <input type="hidden" {...register("imageName")} />
                            <span className="error">{formState.errors.image?.message || " "}</span>
                        </div>
                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="back-btn" onClick={() => navigate("/vacations")}>
                        ← Back to Vacations
                    </button>
                    <button type="submit" className="add-btn">Add Vacation</button>
                </div>
            </form>
        </div>
    );
}
