import { FC } from "react";
import useLanguage from "app/shared/hooks/useLanguage";
import { StringsKeys } from "core/internationalization/strings";

const Dashboard: FC = () => {
  const { translate } = useLanguage();
  return <div>{translate(StringsKeys.dashbord)}</div>;
};

export default Dashboard;
