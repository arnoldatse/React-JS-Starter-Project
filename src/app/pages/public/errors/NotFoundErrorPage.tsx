import { FC } from "react";
import routesPaths from "core/routes/routesPaths";
import useLanguage from "app/shared/hooks/useLanguage";
import { StringsKeys } from "core/internationalization/strings";
import { Link } from "react-router-dom";
import MessageTemplate from "./components/MessageTemplate";

const NotFoundErrorPage: FC = () => {
  const { translate } = useLanguage();
  return (
    <>
      <MessageTemplate
        code={404}
        title={`${translate(StringsKeys.pageNotFound)} ⚠️`}
        desc={translate(StringsKeys.WeCouldntFindThePageYouAreLookingFor)}
      />
      <Link to={`/${routesPaths.HOME}`}>
        {translate(StringsKeys.backToHome)}
      </Link>
    </>
  );
};

export default NotFoundErrorPage;
