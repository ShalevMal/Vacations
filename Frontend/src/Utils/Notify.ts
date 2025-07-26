import { errorExtractor } from "error-extractor";
import { Notyf } from "notyf";

class Notify {
    private notyf = new Notyf({
        duration: 3000,
        position: { x: "center", y: "top" },
        dismissible: true,
        types: [
            {
                type: "info",
                background: "#3498db", 
                icon: false
            }
        ]
    });

    public success(message: string): void {
        this.notyf.success(message);
    }

    public error(err: any): void {
        const message = errorExtractor.getMessage(err);
        this.notyf.error(message);
    }

    public info(message: string): void {
        this.notyf.open({
            type: "info",
            message: message
        });
    }
}


export const notify = new Notify();
