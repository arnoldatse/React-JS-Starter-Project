import { useContext } from "react";
import AuthContext from "app/pages/dashboard/context/AuthContext.";

const useAuthContext = () => {
    return useContext(AuthContext);
};

export default useAuthContext;