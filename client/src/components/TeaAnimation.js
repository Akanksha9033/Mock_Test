import React from "react";
import Lottie from "lottie-react";
 
import animationData from "./Tea-Animation.json"; // ✅ Adjust path as needed
 
const  TeaAnimation = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "260px" }}>
      <Lottie animationData={animationData} loop={true} style={{ width: 500, height: 250 }} />
    </div>
  );
};
 
export default TeaAnimation;