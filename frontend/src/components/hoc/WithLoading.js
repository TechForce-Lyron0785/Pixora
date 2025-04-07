"use client";

import { useState, useEffect, memo } from "react";
import LoadingScreen from "@/components/screens/LoadingScreen";

function WithLoading({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // We only want this loading effect to run once when the component is mounted
    // not on every re-render or tab focus
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0); // 0 second loading minimum

    return () => clearTimeout(timer);
  }, []); // Empty dependency array means this only runs once on mount

  return isLoading ? <LoadingScreen /> : children;
}

export default memo(WithLoading); 