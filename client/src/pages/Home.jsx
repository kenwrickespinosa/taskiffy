import React from "react";
import Navbar from "../components/Navbar";
import image_working from "../assets/images/image_working.png";

function Home() {
  return (
    <>
      <Navbar />
      <div className="flex items-center justify-between p-8">
        <div className="text-left max-w-xl">
          <p className="text-custom-grey text-3xl font-semibold">Manage your daily tasks with us</p>
          <p className="text-xl mt-4 text-gray-800">Managing your tasks and productivity becomes easier.</p>
        </div>
        <div className="max-w-md">
          <img
            src={image_working}
            alt="Task Management"
            className="w-full h-auto shadow-lg rounded-lg"
          />
        </div>
      </div>
    </>
  );
}

export default Home;
