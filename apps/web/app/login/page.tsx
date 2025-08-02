import React from "react";
import Navbar from "../component/Navbar";
import Authpage from "../component/Authpage";

function page() {
  return (
    <div className="w-full h-screen bg-black flex flex-col">
      <Navbar />
      <Authpage isSignup={false} />
    </div>
  );
}

export default page;
