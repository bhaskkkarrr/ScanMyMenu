import React from "react";

const FoodLoader = ({ size = "medium"}) => {
  // Size configurations
  const sizeConfig = {
    medium: {
      container: "w-24 h-24",
      plate: "w-20 h-20",
      food: "text-3xl",
      text: "text-sm mt-3",
    },
  };

  const config = sizeConfig[size] || sizeConfig.medium;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      {/* Animated Plate with Food */}
      <div className={`relative ${config.container}`}>
        {/* Rotating Plate */}
        <div
          className={`absolute inset-0 ${config.plate} rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-lg animate-spin`}
          style={{ animationDuration: "3s" }}
        >
          {/* Plate rim */}
          <div className="absolute inset-2 rounded-full bg-white shadow-inner"></div>
        </div>
      </div>

    </div>
  );
};

// Demo component showing different variations
const FoodLoaderDemo = () => {
  return (
    <div className="min-h-screen flex justify-center items-center p-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="rounded-2xl p-8 flex flex-col justify-center items-center">
            <FoodLoader size="medium" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodLoaderDemo;
