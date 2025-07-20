import { createContext } from "react"
import AuthData from "core/authUser/auth/entities/AuthData"

type AuthContextType = {
    authData: AuthData | null
    updateAuthData: (authDatas: AuthData) => void
    isAuthenticated: boolean
}

const defaultAuthContext: AuthContextType = {
    authData: null,
    updateAuthData: () => { },
    isAuthenticated: false
}

export default createContext(defaultAuthContext)