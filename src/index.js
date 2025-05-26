import { app } from "./app.js";
import { connectDB } from "./db/db.config.js";
import dotenv from 'dotenv';
dotenv.config();

connectDB().then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log("Connected")
    })
}).catch(err => console.log(err))
