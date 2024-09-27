"use client";

import { lusitana } from "@/app/ui/fonts";

import { useActionState } from "react";
import { authenticate } from "@/app/lib/actions";
import SignInGoogle from "@/componentes/sign-in-g";
import SignInFacebook from "@/componentes/sign-in-f";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { signIn } from "next-auth/react";

export default function LoginForm() {
  const [errorMessage, formAction, isPending] = useActionState(
    authenticate,
    undefined
  );

  return (
    <div>
      <form action={formAction} className="space-y-3">
        <div className="flex-1 rounded-lg bg-gray-50 px-6 pb-4 pt-8">
          <h1 className={`${lusitana.className} mb-3 text-2xl`}>
            Please log in to continue.
          </h1>
          <button type="submit" onClick={() => signIn("google")}>
            Signin with Google
          </button>
          <SignInFacebook />
          <div
            className="flex h-8 items-end space-x-1"
            aria-live="polite"
            aria-atomic="true"
          >
            {errorMessage && (
              <>
                <ExclamationCircleIcon className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-500">{errorMessage}</p>
              </>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
