"use client";

import { useRouter } from "next/navigation";
import React from "react";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

const SignOutButton = () => {
  const router = useRouter();
  return (
    <Button
      onClick={() =>
        authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              router.push("authentication");
            },
          },
        })
      }
    >
      LogOut
    </Button>
  );
};

export default SignOutButton;
