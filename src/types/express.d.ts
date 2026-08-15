import type { UserType } from "@src/models/userModel";
import type { HydratedDocument } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<UserType>;
    }
  }
}

export {};   
