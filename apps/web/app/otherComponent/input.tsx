import React, { Ref, Reference } from "react";

function Input({
  type,
  placeholder,
  onChange,
  name,
  ref,
}: {
  type: string;
  placeholder: string;
  onChange: () => void;
  name: string;
  ref: any;
}) {
  return (
    <input
      ref={ref}
      type={type}
      placeholder={placeholder}
      onChange={onChange}
      name={name}
      className="w-[98%] mx-auto bg-[#4A4A4A] h-10 rounded-md pl-2 text-white outline-none"
    />
  );
}

export default Input;
