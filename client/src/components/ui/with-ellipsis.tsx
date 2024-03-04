import InfoTooltip from './info-tooltip';

const WithEllipsis = ({ text, maxLength = 35 }: { text: string; maxLength?: number }) => {
  if (text?.length < maxLength) return text;

  const triggerText = text && `${text.slice(0, maxLength)}...`;
  return <InfoTooltip triggerContent={triggerText} content={text} />;
};

export { WithEllipsis };
