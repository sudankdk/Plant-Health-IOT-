import React from "react";
import BarChart from "../Component/Chart";

const Home = () => {
  return (
    <div>
      <div>
        <p>Plant Hydration</p>
      </div>
      <div className=" bg-gray-100 flex items-center justify-center flex-col">
        <BarChart />
      </div>
    </div>
  );
};

export default Home;
