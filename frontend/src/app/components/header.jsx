const Header = () => {
  return (
    <header className="w-full border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <h1 className="text-lg font-semibold tracking-tight text-slate-900">
          AI Builder
        </h1>
        <p className="text-sm text-slate-500">
          Prompt to production in minutes
        </p>
      </div>
    </header>
  );
};

export default Header;
