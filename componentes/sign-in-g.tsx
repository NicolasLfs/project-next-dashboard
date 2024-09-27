"use client";
import { signIn } from "next-auth/react";

export default function SignIn() {
  return (
    <button type="submit" onClick={() => signIn("google")}>
      Signin with Google
    </button>
  );
}
