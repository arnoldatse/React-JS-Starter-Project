import Roles from "./Role";

export default interface AuthData {
  id: string | number;
  username: string;
  email: string
  role: Roles;
  token: string;
}
