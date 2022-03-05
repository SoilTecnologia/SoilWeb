import User from "utils/models/user";
import { farms } from "./farms";

export const users: User[] = [
  {
    user_id: "1",
    user_name: "Henrique",
    farm: farms,
    user_type: "SUDO",
  },
  {
    user_id: "2",
    user_name: "Igor",
    farm: null,
    user_type: "SUDO",
  },
  {
    user_id: "3",
    user_name: "Peloso",
    farm: farms,
    user_type: "USER",
  },
  {
    user_id: "4",
    user_name: "José",
    farm: farms,
    user_type: "SUDO",
  },
  {
    user_id: "5",
    user_name: "João",
    farm: null,
    user_type: "USER",
  },
  {
    user_id: "6",
    user_name: "Maria",
    farm: farms,
    user_type: "USER",
  },
];
