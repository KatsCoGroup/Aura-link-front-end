import Lottie from "lottie-react";
import GradientLoader from "../../assets/loading-animation/gradient loader 02.json";
import SandyLoader from "../../assets/loading-animation/Sandy Loading.json";

export const GradientLoadingAnimation = () => {
  return <Lottie animationData={GradientLoader} />;
};

export const SandyLoadingAnimation = () => {
  return <Lottie animationData={SandyLoader} />;
};

export const PageLoader = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      {/* Control the size of the animation here */}
      <div className="w-[300px] h-[300px]">
        <Lottie animationData={GradientLoader} loop={true} />
      </div>
    </div>
  );
};
