import React from "react";

const Header = React.memo(function Header() {
  return (
    <header className="text-center space-y-2">
      <h1 className="text-3xl font-bold tracking-tight text-blue-600">
        MerchAI Restyler
      </h1>
      <p className="text-neutral-500">
        Transform basic product photos into marketing assets instantly.
      </p>
    </header>
  );
});

export default Header;