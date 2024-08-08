import Roles from "./Roles";

export default interface AuthDatas {
  id: string | number;
  username: string | string;
  role: Roles;
  token: string;
}
