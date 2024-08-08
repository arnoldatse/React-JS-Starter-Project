import { FC } from "react";
import useLanguage from "app/shared/hooks/useLanguage";
import routesPaths from "core/routes/routesPaths";
import { StringsKeys } from "core/internationalization/strings";
import MessageTemplate from "./components/MessageTemplate";
import { Link } from "react-router-dom";

const ServerErrorPage: FC = () => {
  const { translate } = useLanguage();

  return (
    <>
      <MessageTemplate
        code={500}
        title={`${translate(StringsKeys.internalServerError)} 👨🏻‍💻`}
        desc={translate(StringsKeys.oopsSomethingWentWrong)}
      />
      <Link to={`/${routesPaths.HOME}`}>
        {translate(StringsKeys.backToHome)}
      </Link>
    </>
  );
};

export default ServerErrorPage;
