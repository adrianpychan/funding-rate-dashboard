import { FC } from "react";
import { ClipLoader } from "react-spinners";

const LoadSpinner: FC = () => {
  return (
    <div className="flex items-center justify-center flex-1 w-full h-full">
      <ClipLoader color="#3498db" size={40} />
    </div>
  );
};

export default LoadSpinner;
