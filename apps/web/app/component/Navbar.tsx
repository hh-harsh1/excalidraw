import React from "react";
import Image from "next/image";
import Link from "next/link";

function Navbar() {
  const links = [
    {
      href: "/signup",
      title: "Signup",
    },
    {
      href: "/login",
      title: "Login",
    },
  ];

  return (
    <div className=" w-full bg-black">
      <div className="h-18 w-full border-neutral-800 border-b">
        <nav className="pl-4 max-w-7xl h-full 200 mx-auto flex justify-between items-center">
          <div className="w-[50%] flex items-center justify-start">
            <div className="h-[45px] w-[45px] bg-white rounded-full justify-center items-center flex overflow-hidden mr-3">
              <Image
                src={"/excali.jpg"}
                width={70}
                height={70}
                alt="logo"
              ></Image>
            </div>
            <h1 className="bg-gradient-to-tr from-[#0575E6] via-[#6DD5FA] to-[#021B79] text-transparent bg-clip-text inline-block text-2xl font-medium">
              Excalidraw
            </h1>
          </div>

          <div className="w-[50%] flex items-center justify-end">
            {links.map((link, idx) => (
              <Link
                key={idx}
                className="text-neutral-200 ml-8 text-xl hover:text-neutral-400 transition-text duration-200"
                href={link.href}
              >
                {link.title}
              </Link>
            ))}
          </div>
        </nav>
      </div>
    </div>
  );
}

export default Navbar;
