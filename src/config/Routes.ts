import authRoutes from "@src/routes/authRoutes";
import doctorRoutes from "@src/routes/doctorRoutes";
import appointmentRoutes from "@src/routes/appointmentRoutes";
import ratingRoutes from "@src/routes/ratingRoute";
import adminRoutes from "@src/routes/adminRoutes"
import notificationRoutes from "@src/routes/notificationRoutes";
module.exports = (app: any) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1", doctorRoutes);
  app.use("/api/v1", appointmentRoutes);
  app.use("/api/v1", ratingRoutes);
  app.use("/api/v1", notificationRoutes);
  app.use("/api/v1/admin",adminRoutes)
};
