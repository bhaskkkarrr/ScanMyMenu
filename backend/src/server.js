const express = require("express");
const cors = require("cors");
require("dotenv").config();
const dbConnect = require("./config/dbConnect");

// Connect to the database
dbConnect();

const app = express();
const PORT = process.env.PORT || 3000;

const { contactMessageRoutes } = require("./routes/contactMessageRoutes");

// Routes Import
const { authRoutes } = require("./routes/authRoutes");
const { categoryRoutes } = require("./routes/foodCategoryRoutes");
const { menuItemRoutes } = require("./routes/MenuItemRoutes");
const { tableRoutes } = require("./routes/TableRoutes");
const { publicRoutes } = require("./routes/publicRoutes");
const { settingsRoutes } = require("./routes/settingsRoutes");

const errorHandler = require("./middleware/errorMiddleware");
console.log(process.env.BASE_URL);
console.log(process.env.BASE_LOCAL_URL);
const allowedOrigins = [process.env.BASE_URL, process.env.BASE_LOCAL_URL];

// App Routes
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/public", publicRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/menu", menuItemRoutes);
app.use("/api/table", tableRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/contact", contactMessageRoutes);
app.use(errorHandler);

// Server Port
app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
