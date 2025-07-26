import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { vacationService } from "../../../Services/VacationService";
import { VacationModel } from "../../../Models/VacationModel";
import { notify } from "../../../Utils/Notify";
import { appConfig } from "../../../Utils/AppConfig";
import { authService } from "../../../Services/AuthService";
import "./EditVacation.css";


export function EditVacation(): JSX.Element {
    const { vacationId } = useParams<{ vacationId: string }>();
    const { register, handleSubmit, setValue, setError, formState } = useForm<VacationModel>();
    const navigate = useNavigate();
    const [preview, setPreview] = useState<string | null>(null);
    const [isImageCleared, setIsImageCleared] = useState(false);

    useEffect(() => {
        if (!authService.isAdmin()) {
            notify.error("Access denied.");
            navigate("/home");
        }

        document.title = "Edit Vacation | Levana Vacations";

        vacationService.getOneVacation(vacationId!)
            .then(v => {
                setValue("destination", v.destination);
                setValue("description", v.description);
                setValue("startDate", v.startDate.slice(0, 10));
                setValue("endDate", v.endDate.slice(0, 10));
                setValue("price", v.price);
                setPreview(appConfig.vacationImagesUrl + v.imageName);
            })
            .catch(err => notify.error(err));
    }, [vacationId, navigate, setValue]);

    function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => setPreview(reader.result as string);
            reader.readAsDataURL(file);
        }
    }

    function cancelImage() {
        setPreview(null);
        setValue("image", null);
        setIsImageCleared(true);
    }

    async function send(vacation: VacationModel) {
        try {
            if (new Date(vacation.startDate) >= new Date(vacation.endDate)) {
                setError("endDate", {
                    type: "manual",
                    message: "End date must be after start date"
                });
                return;
            }

            vacation._id = vacationId!;

            const fileList = vacation.image as unknown as FileList;

            if (fileList && fileList.length > 0) {
                vacation.image = fileList[0];
            } else if (isImageCleared) {
                vacation.imageName = "default.png";
                delete vacation.image;
            }

            await vacationService.updateVacation(vacation);
            notify.success("Vacation updated successfully");
            navigate("/vacations");
        } catch (err: any) {
            notify.error(err);
        }
    }

    return (
        <div className="AddVacation">
            <h2 className="form-title">Edit Vacation</h2>

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
                                    maxLength: 55,
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
                                        <img
                                            src={preview}
                                            alt="Image Preview"
                                            className="inline-preview"
                                        />
                                        <button
                                            type="button"
                                            className="cancel-preview-btn"
                                            onClick={cancelImage}
                                        >
                                            Cancel Image
                                        </button>
                                    </>
                                )}
                            </div>

                            <span className="error">
                                {formState.errors.image?.message || " "}
                            </span>
                        </div>

                    </div>
                </div>

                <div className="form-actions">
                    <button type="button" className="back-btn" onClick={() => navigate("/vacations")}>
                        ← Back to Vacations
                    </button>
                    <button type="submit" className="add-btn">Update Vacation</button>
                </div>
            </form>
        </div>
    );
}
