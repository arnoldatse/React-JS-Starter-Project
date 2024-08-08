import { FC } from "react";
import routesPaths from "core/routes/routesPaths";
import { StringsKeys } from "core/internationalization/strings";
import useLanguage from "app/shared/hooks/useLanguage";
import { Link } from "react-router-dom";
import MessageTemplate from "./components/MessageTemplate";

const ServerErrorPage: FC = () => {
  const { translate } = useLanguage();

  return (
    <>
      <MessageTemplate code={500} title={`${translate(StringsKeys.internalServerError)} 👨🏻‍💻`} desc={`${translate(StringsKeys.oopsSomethingWentWrong)}!`} />
      <Link to={`/${routesPaths.DASHBOARD.HOME}`}>
        {translate(StringsKeys.backToHome)}
      </Link>
    </>
  );
};

export default ServerErrorPage;
