import React from "react";

function Loader() {
  return (
    <>
      <div className="fixed inset-0 bg-[#00000054] flex justify-center items-center">
        <div className="w-12 h-12 border-r-2 border-t-2 border-green-600 animate-spin rounded-full"></div>
      </div>
    </>
  );
}

export default Loader;
