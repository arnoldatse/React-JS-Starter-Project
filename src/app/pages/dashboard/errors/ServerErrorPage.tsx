import { FC } from "react";
import { StringsKey } from "core/internationalization/strings";
import useLanguage from "app/shared/hooks/useLanguage";
import { Link } from "react-router";
import MessageTemplate from "./components/MessageTemplate";
import mapPathService from "app/shared/services/mapPathService";
import PublicNavigationLocation from "core/navigation/PublicNavigationLocation";

const ServerErrorPage: FC = () => {
  const { translate } = useLanguage();

  return (
    <>
      <MessageTemplate code={500} title={`${translate(StringsKey.internalServerError)} 👨🏻‍💻`} desc={`${translate(StringsKey.oopsSomethingWentWrong)}!`} />
      <Link to={mapPathService.mapToBrowserPath(PublicNavigationLocation.HOME)}>
        {translate(StringsKey.backToHome)}
      </Link>
    </>
  );
};

export default ServerErrorPage;
