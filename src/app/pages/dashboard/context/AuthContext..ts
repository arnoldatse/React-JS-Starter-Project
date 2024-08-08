import { createContext } from "react"
import AuthDatas from "core/user/auth/entities/AuthDatas"

type AuthContextType = {
    authDatas: AuthDatas | null
    updateAuthDatas: (authDatas: AuthDatas) => void
    isAuthenticated: boolean
}

const defaultAuthContext: AuthContextType = {
    authDatas: null,
    updateAuthDatas: () => { },
    isAuthenticated: false
}

export default createContext(defaultAuthContext)