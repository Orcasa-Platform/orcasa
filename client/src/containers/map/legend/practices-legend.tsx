const PracticesLegend = () => {
  const renderMarkersLegend = () => {
    const legendItem = (text: string) => (
      <div key={text} className="-mt-px flex h-[21px] w-full items-center text-right">
        <span className="mr-[10px] w-[60px]">{text}</span>
        <span className="h-[6px] w-[8px] rotate-45 bg-gray-200 p-0" />
        <span className="mr-3 w-full border-t border-dashed border-gray-200" />
      </div>
    );
    return (
      <div className="flex justify-end">
        <div className="relative h-[90px] w-[274px] text-xs text-slate-500">
          <div className="flex flex-col">
            {['>1k', '500-1k', '100-500', '1-100'].map(legendItem)}
          </div>
          <div className="absolute right-3 top-0">
            <div className="absolute right-0 top-[70px] h-5 w-5 border border-gray-200" />
            <div className="absolute right-0 top-[50px] h-10 w-10 border border-gray-200" />
            <div className="absolute right-0 top-[30px] h-[60px] w-[60px] border border-gray-300" />
            <div className="absolute right-0 top-[10px] h-20 w-20 border border-gray-200" />
          </div>
        </div>
      </div>
    );
  };
  return (
    <div className="flex h-[280px] w-[325px] flex-col gap-3 bg-white p-3 font-sans shadow">
      <header className="text-base font-semibold text-gray-700">Total practices implemented</header>
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-start gap-1 text-sm text-slate-500">
          Sum of practices.
        </div>
        {renderMarkersLegend()}
      </div>
      <div className="flex items-center gap-2 border-t border-gray-100 pb-1 pt-3">
        <div className="flex h-3">
          <div className="w-3 bg-brown-500" />
        </div>
        <div className="text-sm text-slate-700">Practices</div>
      </div>
      <div className="flex items-center gap-2 border-t border-gray-100 pb-1 pt-3">
        <div className="border-2 border-slate-700">
          <div className="flex h-3">
            <div className="w-3 bg-brown-500" />
          </div>
        </div>
        <div className="text-sm text-slate-700">Practices by country</div>
      </div>
    </div>
  );
};

export default PracticesLegend;
