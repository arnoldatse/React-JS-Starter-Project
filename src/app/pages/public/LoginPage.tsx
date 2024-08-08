import { FC, FormEvent, useState } from "react";

// ** router Imports
import { useNavigate } from "react-router-dom";

// ** Hooks
import useAuth from "app/shared/hooks/useAuth";
import useLanguage from "app/shared/hooks/useLanguage";
import { StringsKeys } from "core/internationalization/strings";
import authRepository from "app/repositories/authRepository";
import LoginViewModel from "core/user/auth/viewModels/LoginViewModel/LoginViewModel";

const defaultValues = {
  password: "admin",
  email: "admin@test.com",
};

const LoginPage: FC = () => {
  const [email, setEmail] = useState<string>(defaultValues.email);
  const [password, setPassword] = useState<string>(defaultValues.password);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // ** Hooks
  const navigate = useNavigate();
  const { sessionStorageService } = useAuth();
  const { translate } = useLanguage();

  // view model methods
  const redirect = (path: string) => {
    navigate(`/${path}`);
  };

  const loginError = (errorMessage: string) => {
    setError(errorMessage);
  };

  const [loginViewModel] = useState(
    new LoginViewModel(authRepository, sessionStorageService)
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    loginViewModel.submit(
      email,
      password,
      rememberMe,
      redirect,
      loginError,
      translate
    );
  };

  return (
    <>
      <div>
        Email: <strong>admin@test.com</strong> /{" "}
        {translate(StringsKeys.password)}: <strong>admin</strong>
      </div>
      {error && <div>{error}</div>}
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
            {translate(StringsKeys.password)}
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
            {translate(StringsKeys.password)}
          </label>
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)}
          />
        </div>
        <button type="submit">{translate(StringsKeys.login)}</button>
      </form>
    </>
  );
};

export default LoginPage;
