import type { UserType } from "@src/models/userModal";
import type { HydratedDocument } from "mongoose";

declare global {
  namespace Express {
    interface Request {
      user?: HydratedDocument<UserType>;
    }
  }
}

export {};   
