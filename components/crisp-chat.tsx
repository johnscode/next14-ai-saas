"use client";

import { useEffect } from "react";
import { Crisp } from "crisp-sdk-web";

export const CrispChat = () => {
  useEffect(() => {
    Crisp.configure("c2e9005e-35b2-43f0-a7f4-0cd66e6f02be");
  }, []);

  return null;
};
