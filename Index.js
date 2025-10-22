require('dotenv').config();
const express = require("express");
const cors = require("cors");   // ✅ Import cors
const bodyParser = require("body-parser");  
const connectDB = require("./utils/db");

const Roles = require("./Routes/RoleRoutes");
const User = require("./Routes/UserRoutes");
const supplier= require("./Routes/SupplierRoutes");
const product=require("./Routes/ProductRoutes");
const stock=require("./Routes/StockRoutes");
const Asset=require("./Routes/AssetRoutes");
const license = require("./Routes/LicenseRoutes");
const maintenance = require("./Routes/MaintenanaceRoutes");
const dead = require("./Routes/DeadRoutes");
const assetLocation = require("./Routes/AssetLocationRoutes");
const AuthRoutes = require("./Routes/AuthRoutes");
const app = express();
const port = 5008;

// ✅ CORS Middleware
app.use(cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// ✅ Middleware to parse JSON
app.use(express.json());

// ✅ Routes
app.use("/roles", Roles);
app.use("/user", User);
app.use("/supplier", supplier);
app.use("/product", product);
app.use("/stock", stock);
app.use("/asset", Asset);
app.use("/license", license);
app.use("/maintenance", maintenance);
app.use("/dead",dead);
app.use("/assetLocation", assetLocation);
app.use("/auth", AuthRoutes);
// ✅ DB + Server start
connectDB().then(() => {
    app.listen(port, () => {
        console.log("Server is running on port:", port);
    });
});
