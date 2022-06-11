import { createContext } from "react";
import { UserType } from "./types";

export const UserContext = createContext<UserType | undefined>(undefined);
