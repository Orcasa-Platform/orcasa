export const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();
  const { href } = e.currentTarget;
  const targetId = href.replace(/.*\#/, '');
  const element = document.getElementById(targetId);

  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
    });
  }
};
