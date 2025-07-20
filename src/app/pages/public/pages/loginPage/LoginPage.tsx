import { FC, FormEvent, useContext, useState } from "react";

// ** router Imports
import { useNavigate } from "react-router";

// ** Hooks
import { StringsKey } from "core/internationalization/strings";
import authRepository from "app/shared/repositories/authRepository";
import LoginViewModel from "core/authUser/auth/viewModels/LoginViewModel/LoginViewModel";
import BrowserNavigator from "details/navigation/browser/browserNavigator/BrowserNavigator";
import AppContext from "app/shared/contexts/AppContext";

const defaultValues = {
  password: "admin",
  email: "admin@test.com",
};

const LoginPage: FC = () => {
   const {
    language: { translate },
    navigator,
    logger
  } = useContext(AppContext);
  const [email, setEmail] = useState<string>(defaultValues.email);
  const [password, setPassword] = useState<string>(defaultValues.password);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const setLoggingIn = useState(false)[1];

  // ** Hooks
  const navigate = useNavigate();
  const navigateToPage = (path: string) => {
    navigate(`/${path}`);
  };
  const defineNavigateToPageInNavigator = () => {
    if ((navigator as BrowserNavigator).getNavigate() !== navigateToPage) {
      (navigator as BrowserNavigator).setNavigate(navigateToPage);
    }
  };

  const [loginViewModel] = useState(
    new LoginViewModel(authRepository)
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if(!loginViewModel.loggingIn) {
      console.log('navigator:', navigator);
      setLoggingIn(true);
      defineNavigateToPageInNavigator();
      loginViewModel
        .submit(email, password, true, navigator, translate)
        .finally(() => {
          logger.log({
            message: "Login process completed",
            email: email,
            password: password,
          }, "LoginPage.onSubmit", false);
          setLoggingIn(false)
        });
    }
    e.preventDefault();
  };

  return (
    <>
      <div>
        Email: <strong>admin@test.com</strong> /{" "}
        {translate(StringsKey.password)}: <strong>admin</strong>
      </div>
      {loginViewModel.failedLoggingInException && <div>{loginViewModel.failedLoggingInException.message}</div>}
      <form autoComplete="off" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email-field">Email</label>
          <input
            type="email"
            name="email"
            id="email-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="password-field">
            {translate(StringsKey.password)}
          </label>
          <input
            type="password"
            name="password"
            id="password-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="remember-me-field">
            {translate(StringsKey.password)}
          </label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </div>
        <button type="submit">{translate(StringsKey.login)}</button>
      </form>
    </>
  );
};

export default LoginPage;
