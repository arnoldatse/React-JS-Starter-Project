import { useContext, useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import AuthContext from "../context/AuthContext.";
import useAuth from "app/shared/hooks/useAuth";
import authGuard from "core/authUser/auth/guards/authGuard/authGuard";
import { StringsKey } from "core/internationalization/strings";
import {
  AvailableLanguages,
  languages,
} from "core/internationalization/languages";
import AppContext from "app/shared/contexts/AppContext";
import BrowserNavigator from "details/navigation/browser/browserNavigator/BrowserNavigator";

function DashboardLayout() {
  const {
    language: {updateLanguage, translate},
    navigator,
  } = useContext(AppContext);

  const { updateAuthData, sessionStorageService, logoutUseCase } = useAuth();

  const navigate = useNavigate();
  const defineNavigateToPageInNavigator = () => {
    if ((navigator as BrowserNavigator).getNavigate() !== navigate) {
      (navigator as BrowserNavigator).setNavigate(navigate);
    }
  };

  const authContext = useMemo(() => {
    return {
      authData: sessionStorageService.authData,
      updateAuthData,
      isAuthenticated: authGuard(sessionStorageService),
    };
  }, [sessionStorageService, updateAuthData]);

  const [loggingOut, setLoggingOut] = useState(false);

  const handleLogout = () => {
    if(!loggingOut) {
      setLoggingOut(true);
      defineNavigateToPageInNavigator();

      logoutUseCase.execute(navigator, translate)
      .catch(() => {
        alert(translate(StringsKey.FailedToLogoutUser));
      })
      .finally(() => {
        setLoggingOut(false);
      });
    }
  }

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
      <button onClick={handleLogout}>{translate(StringsKey.logout)}</button>
      <Outlet />
    </AuthContext.Provider>
  );
}

export default DashboardLayout;
