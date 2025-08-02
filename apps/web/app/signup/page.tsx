import React from "react";
import Authpage from "../component/Authpage";
import Navbar from "../component/Navbar";

function page() {
  return (
    <div className="w-full h-screen bg-black flex flex-col">
      <Navbar />
      <Authpage isSignup={true} />
    </div>
  );
}

export default page;
