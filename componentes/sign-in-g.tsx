"use client";
import { signIn } from "next-auth/react";
import Image from "next/image";

export default function SignIn() {
  return (
    <div className="flex gap-2 w-2/4">
      <button
        onClick={() => signIn("google")}
        className="bg-white border border-gray-300 rounded-lg shadow-sm px-4 py-2 flex items-center gap-2 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google Logo"
          width={24}
          height={24}
        />
        <span className="text-sm font-medium text-gray-800">Google</span>
      </button>
    </div>
  );
}
