import InfoTooltip from './info-tooltip';

const WithEllipsis = ({
  text,
  maxLength = 35,
  className,
  triggerClassName,
}: {
  text: string;
  maxLength?: number;
  className?: string;
  triggerClassName?: string;
}) => {
  if (text?.length < maxLength) return text;

  const triggerText = text && `${text.slice(0, maxLength)}...`;
  return (
    <InfoTooltip
      triggerContent={triggerText}
      content={text}
      className={className}
      triggerClassName={triggerClassName}
    />
  );
};

export { WithEllipsis };
