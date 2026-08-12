import authRoutes from "@src/routes/authRoutes";
import doctorRoutes from "@src/routes/doctorRoutes";
import appointmentRoutes from "@src/routes/appointmentRoutes";
module.exports = (app: any) => {
  app.use("/api/v1/auth", authRoutes);
  app.use("/api/v1", doctorRoutes);
  app.use("/api/v1", appointmentRoutes);
};
