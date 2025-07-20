import { FC } from "react";
import useLanguage from "app/shared/hooks/useLanguage";
import { StringsKey } from "core/internationalization/strings";
import { Link } from "react-router";
import MessageTemplate from "./components/MessageTemplate";
import mapPathService from "app/shared/services/mapPathService";
import PublicNavigationLocation from "core/navigation/PublicNavigationLocation";

const NotFoundErrorPage: FC = () => {
  const { translate } = useLanguage();
  return (
    <>
      <MessageTemplate code={404} title={translate(StringsKey.weCouldNotFindThePageYouAreLookingFor)} />
      <Link to={mapPathService.mapToBrowserPath(PublicNavigationLocation.HOME)}>
        {translate(StringsKey.backToHome)}
      </Link>
    </>
  );
};

export default NotFoundErrorPage;
