const NetworkLegend = () => {
  return (
    <div className="flex gap-4 rounded-lg bg-gray-800 p-3 font-sans text-xs text-white shadow">
      <div className="flex items-center gap-2">
        <div className="h-4 w-2 rounded-lg bg-green-700" />
        Organisations
      </div>
      <div className="flex items-center gap-2">
        <div className="h-4 w-2 rounded-lg bg-purple-500" />
        Initiatives
      </div>
    </div>
  );
};

export default NetworkLegend;
