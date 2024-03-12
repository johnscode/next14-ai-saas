"use client";

import axios from "axios";
import { useState } from "react";
import { Zap } from "lucide-react";
import { useToast } from "@/components/ui/use-toast"

import { Button } from "@/components/ui/button";

interface SubscriptionButtonProps {
  isPro: boolean
}

export const SubscriptionButton = ({
  isPro = false
}: SubscriptionButtonProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()
  const onClick = async () => {
    try {
      setLoading(true);

      const response = await axios.get("/api/stripe");

      window.location.href = response.data.url;
    } catch (error: any) {
      toast({title:"Billing Error", description: error?.response?.data});
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button variant={isPro ? "default" : "premium"} disabled={loading} onClick={onClick} >
      {isPro ? "Manage Subscription" : "Upgrade"}
      {!isPro && <Zap className="w-4 h-4 ml-2 fill-white" />}
    </Button>
  )
};
