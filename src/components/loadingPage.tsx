import React from "react";
import { Skeleton } from "./ui/skeleton";

const LoadingPage = () => {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-1/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
};

export default LoadingPage;
