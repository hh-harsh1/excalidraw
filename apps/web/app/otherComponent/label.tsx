import React from "react";

function label({ name, children }: { name: string; children: string }) {
  return (
    <label htmlFor={name} className="text-white">
      {children}
    </label>
  );
}

export default label;
