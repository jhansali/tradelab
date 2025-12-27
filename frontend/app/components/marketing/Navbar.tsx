"use client";

const Navbar = () => {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-morphism border-b border-slate-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            type="button"
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Trade<span className="text-indigo-400">Lab</span>
            </span>
          </button>
          <div className="hidden md:block">
            <div className="flex items-baseline space-x-8">
              <button
                onClick={() => scrollTo("features")}
                className="text-slate-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo("how-it-works")}
                className="text-slate-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                How it Works
              </button>
              <button
                onClick={() => scrollTo("faq")}
                className="text-slate-400 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                FAQ
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a href="/signin" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
              Sign in
            </a>
            <a
              href="/signup"
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2 rounded text-sm font-semibold transition-all shadow-lg shadow-indigo-600/20"
            >
              Start Paper Trading
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
