import React from "react";
import CommandButtons from "./CommandButtons";
import Build_canvas from "./Build_canvas";


const Workspace = () => {
  return (
    <div className="work_space bg-green" data-title="Build space" >
      <CommandButtons />
      <Build_canvas />
    </div>
  );
};

export default Workspace;
  