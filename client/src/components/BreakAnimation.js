import React from "react";
import Lottie from "lottie-react";
 
import animationData from "./BrakeAnimation.json"; // ✅ Adjust path as needed
 
const  BrakeAnimation = () => {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{ height: "360px" }}>
      <Lottie animationData={animationData} loop={true} style={{ width: 300, height: 300 }} />
    </div>
  );
};
 
export default BrakeAnimation;