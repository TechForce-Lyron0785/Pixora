"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/screens/LoadingScreen";

export default function WithLoading({ children }) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 0); // 0 second loading minimum

    return () => clearTimeout(timer);
  }, []);

  return isLoading ? <LoadingScreen /> : children;
} 