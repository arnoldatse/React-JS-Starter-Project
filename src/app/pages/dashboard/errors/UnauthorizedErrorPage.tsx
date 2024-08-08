import { FC } from "react";
import useLanguage from "app/shared/hooks/useLanguage";
import routesPaths from "core/routes/routesPaths";
import { StringsKeys } from "core/internationalization/strings";
import { Link } from "react-router-dom";
import MessageTemplate from "./components/MessageTemplate";

const UnauthorizedErrorPage: FC = () => {
  const { translate } = useLanguage();

  return (
    <>
      <MessageTemplate
        code={401}
        title={`${translate(StringsKeys.youAreNotAuthorized)}! 🔐`}
        desc={`${translate(
          StringsKeys.youDonTHavePermissionToAccessThisPage
        )}!`}
      />
      <Link to={`/${routesPaths.DASHBOARD.HOME}`}>
        {translate(StringsKeys.backToHome)}
      </Link>
    </>
  );
};

export default UnauthorizedErrorPage;
