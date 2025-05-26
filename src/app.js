import express from "express";
import cors from "cors";
import { userRouter } from "./routes/user.routes.js";
import path from "path"
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const app = express();

app.use(express.json());
app.use(cors({
    origin: "*"
}));
app.use(express.static(path.join(__dirname, "public")));

//Routes

app.use("/api/v1", userRouter)

app.get("/",(req,res)=>{
    console.log("Hie");
    res.send("Hello from backend!");
})
