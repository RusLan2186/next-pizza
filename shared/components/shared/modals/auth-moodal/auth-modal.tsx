"use client";

import { Button, Dialog, DialogContent, DialogTitle } from "@/components/ui";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { LoginForm } from "./forms/login-form";

interface Props {
  className?: string;
  open: boolean;
  onClose: () => void;
}
export const AuthModal: React.FC<Props> = ({ open, onClose }) => {
  const [type, setType] = useState<"login" | "register">("login");
  const [oauthProvider, setOauthProvider] = useState<
    "github" | "google" | null
  >(null);

  const onSwitchType = () => {
    setType((prev) => (prev === "login" ? "register" : "login"));
  };
  const handleClose = () => {
    setOauthProvider(null);
    onClose();
  };

  const handleOAuthSignIn = (provider: "github" | "google") => {
    setOauthProvider(provider);
    signIn(provider, { callbackUrl: "/", redirect: true });
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[450px] bg-white px-4 py-8 sm:p-10">
        <DialogTitle className="sr-only">Authentication</DialogTitle>
        {type === "login" ? (
          <LoginForm onClose={handleClose} />
        ) : (
          <h1>Register</h1>
        )}
        <hr />
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => handleOAuthSignIn("github")}
            type="button"
            loading={oauthProvider === "github"}
            spinnerClassName="text-white"
            className="gap-2 h-12 p-2 flex-1"
          >
            <img
              className="w-6 h-6"
              src="https://github.githubassets.com/favicons/favicon.svg"
              alt="github"
            />
            GitHub
          </Button>

          <Button
            variant="secondary"
            onClick={() => handleOAuthSignIn("google")}
            type="button"
            loading={oauthProvider === "google"}
            spinnerClassName="text-white"
            className="gap-2 h-12 p-2 flex-1"
          >
            <img
              className="w-6 h-6"
              src="https://fonts.gstatic.com/s/i/productlogos/googleg/v6/24px.svg"
              alt="google"
            />
            Google
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={onSwitchType}
          type="button"
          className="h-12"
        >
          {type === "login" ? "Register" : "Login"}
        </Button>
      </DialogContent>
    </Dialog>
  );
};
