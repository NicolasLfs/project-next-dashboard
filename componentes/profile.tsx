"use client";

import React from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";

export default function Profile() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <p>Carregando...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Você precisa estar logado para ver esta página.</p>;
  }

  return (
    <div>
      <div>
        <h1>Seja bem-vindo(a), {session?.user?.name}!</h1>
        <p>Email: {session?.user?.email}</p>
        <Image
          src={session?.user?.image ?? ""}
          alt="Avatar"
          width={100}
          height={100}
        />
      </div>
    </div>
  );
}
