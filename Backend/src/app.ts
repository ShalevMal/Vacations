import cors from "cors";
import express, { Express } from "express";
import fileUpload from "express-fileupload";
import { appConfig } from "./2-utils/app-config";
import { dataController } from "./5-controllers/data-controller";
import { errorMiddleware } from "./6-middleware/error-middleware";
import { userController } from "./5-controllers/user-controller";
import path from "path";
import { fileSaver } from "uploaded-file-saver";
import { likeController } from "./5-controllers/like-controller";
import dal from "./2-utils/dal";


class App {

    public server: Express;

    public async start(): Promise<void> {

        this.server = express();

        this.server.use(fileUpload({
            createParentPath: true,
            useTempFiles: false,
            limits: { fileSize: 10 * 1024 * 1024 } // 10MB
        }));

        this.server.use(express.json());
        this.server.use(cors());

        fileSaver.config(path.join(__dirname, "1-assets", "images"));
        this.server.use("/api/images", express.static(path.join(__dirname, "1-assets", "images")));

        this.server.use("/api/users", userController.router);
        this.server.use("/api", dataController.router);
        this.server.use("/api", likeController.router);


        this.server.use("*", errorMiddleware.routeNotFound);
        this.server.use(errorMiddleware.catchAll);

        this.server.listen(appConfig.port, async () => {
            await dal.connect();
            console.log("Listening on http://localhost:" + appConfig.port)
        });
    }
}

export const app = new App();
app.start();
