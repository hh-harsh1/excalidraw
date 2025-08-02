import React from "react";

function Input({
  type,
  placeholder,
  onChange,
}: {
  type: string;
  placeholder: string;
  onChange: () => void;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      className="w-full bg-amber-700"
    />
  );
}

export default Input;
