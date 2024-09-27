"use client";

import { lusitana } from "@/app/ui/fonts";

import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import SignInGoogle from "@/componentes/sign-in-g";
import SignInFacebook from "@/componentes/sign-in-f";

export default function LoginForm() {
  const [errorMessage, formAction] = useActionState(authenticate, undefined);

  return (
    <div>
      <form action={formAction} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please log in to continue.
          </h1>
          <SignInGoogle />
          <SignInFacebook />
        </div>
      </form>
    </div>
  );
}
