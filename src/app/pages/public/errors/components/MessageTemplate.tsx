import { FC } from "react";

interface MessageTemplateProps {
  code: number;
  title: string;
  desc?: string;
}

const MessageTemplate: FC<MessageTemplateProps> = ({ code, title, desc }) => (
  <>
    <h1>{code}</h1>
    <h2>{title}</h2>
    {desc && <h3>{desc}</h3>}
  </>
);

export default MessageTemplate;
