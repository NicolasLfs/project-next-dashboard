"use client";
import { signIn } from "next-auth/react";

export default function SignInFacebook() {
  return <button onClick={() => signIn("facebook")}>Facebook</button>;
}
