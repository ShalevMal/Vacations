import { appConfig } from "./app-config";
import mongoose from "mongoose";

async function connect(): Promise<void> {
        try {
            const db = await mongoose.connect(appConfig.mongodbConnectionString);
            console.log("✅ Connected to MongoDB:", db.connections[0].name);
        }
         catch (err: any) {
            console.error("❌ Failed to connect to MongoDB:", err);
        }
    }

export default {
    connect
};
