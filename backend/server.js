import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import "./config/db.js";
import schoolRoutes from "./routes/schoolRoutes.js"

// function call from dotenv file to find .env file
dotenv.config();

// calling expresss function 
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", schoolRoutes);


app.get("/", (req, res)=> {
    res.json({
        success: true,
        message: "School Management API is running"
    });
});

const PORT = process.env.PORT || 5000;

// Listen

app.listen(PORT, ()=> {
    console.log(`Server running on port ${PORT}`)
})