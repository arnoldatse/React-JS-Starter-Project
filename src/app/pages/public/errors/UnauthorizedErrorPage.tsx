import { FC } from "react";
import routesPaths from "core/routes/routesPaths";
import { StringsKeys } from "core/internationalization/strings";
import useLanguage from "app/shared/hooks/useLanguage";
import MessageTemplate from "./components/MessageTemplate";
import { Link } from "react-router-dom";

const UnauthorizedErrorPage: FC = () => {
  const { translate } = useLanguage();

  return (
    <>
      <MessageTemplate
        code={401}
        title={`${translate(StringsKeys.youAreNotAuthorized)}! 🔐`}
        desc={translate(StringsKeys.youDonTHavePermissionToAccessThisPage)}
      />
      <Link to={`/${routesPaths.HOME}`}>
        {translate(StringsKeys.backToHome)}
      </Link>
    </>
  );
};

export default UnauthorizedErrorPage;
