import React from "react";
import { Link } from "react-router-dom";

function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-center">
      <p className="text-4xl font-semibold text-custom-blue">404 Not Found</p>
      <p className="text-custom-grey mt-4">
        The page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="mt-6 text-custom-green text-xl font-medium hover:underline"
      >
        Back to Home
      </Link>
    </div>
  );
}

export default PageNotFound;
