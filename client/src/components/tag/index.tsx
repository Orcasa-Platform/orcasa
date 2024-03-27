const Tag = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex max-w-[200px] items-center rounded-2xl border border-green-700 px-2 text-2xs font-medium text-green-700">
      {children}
    </div>
  );
};

export default Tag;
