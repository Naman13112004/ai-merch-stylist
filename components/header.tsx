import React from "react";
import { Sparkles } from "lucide-react";

const Header = React.memo(function Header() {
  return (
    <header className="text-center space-y-3 py-4">
      <div className="inline-flex items-center justify-center p-3 bg-blue-50 rounded-full mb-2">
        <Sparkles className="w-6 h-6 text-blue-600" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
        MerchAI <span className="text-blue-600">Restyler</span>
      </h1>
      <p className="text-lg text-slate-500 max-w-lg mx-auto">
        Transform basic product photos into professional marketing assets in seconds.
      </p>
    </header>
  );
});

export default Header;