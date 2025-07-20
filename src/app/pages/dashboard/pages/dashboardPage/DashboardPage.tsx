import { FC } from "react";
import useLanguage from "app/shared/hooks/useLanguage";
import { StringsKey } from "core/internationalization/strings";

const Dashboard: FC = () => {
  const { translate } = useLanguage();
  return <div>{translate(StringsKey.dashboard)}</div>;
};

export default Dashboard;
