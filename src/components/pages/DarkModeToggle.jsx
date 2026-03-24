import React, { useState } from "react";

export default function DarkModeToggle() {

  const [dark, setDark] = useState(false);

  const toggle = () => {

    setDark(!dark);

    document.body.classList.toggle("dark-mode");

  };

  return (
    <button onClick={toggle}>
      Toggle Dark Mode
    </button>
  );
}