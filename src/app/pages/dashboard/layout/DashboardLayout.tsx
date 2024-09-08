import { useMemo } from "react";
import { Outlet, useNavigate } from "react-router";
import AuthContext from "../context/AuthContext.";
import useAuth from "app/shared/hooks/useAuth";
import authGuard from "core/user/auth/guards/authGuard/authGuard";
import useLanguage from "app/shared/hooks/useLanguage";
import { StringsKeys } from "core/internationalization/strings";
import {
  AvailableLanguages,
  languages,
} from "core/internationalization/languages";
import Exception from "core/exceptions/Exception";

function DashboardLayout() {
  const { updateAuthDatas, sessionStorageService, logout } = useAuth();
  const { translate, updateLanguage } = useLanguage();
  const navigate = useNavigate();

  const authContext = useMemo(() => {
    return {
      authDatas: sessionStorageService.authDatas,
      updateAuthDatas,
      isAuthenticated: authGuard(sessionStorageService),
    };
  }, [sessionStorageService, updateAuthDatas]);

  const redirect = (path: string) => {
    navigate(`/${path}`);
  };

  const handleLogout = () => {
    logout.execute(redirect, translate).catch((e: Exception) => {
      alert(translate(e.message!));
    });
  };

  return (
    <AuthContext.Provider value={authContext}>
      {Object.keys(languages).map((key) => {
        const languageKey: AvailableLanguages = key as AvailableLanguages;
        return (
          <button
            key={key}
            onClick={() => updateLanguage(languages[languageKey])}
          >
            {AvailableLanguages[languageKey].toUpperCase()}
          </button>
        );
      })}
      <button onClick={handleLogout}>{translate(StringsKeys.logout)}</button>
      <Outlet />
    </AuthContext.Provider>
  );
}

export default DashboardLayout;
