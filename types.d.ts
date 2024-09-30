declare global {
  namespace NextAuth {
    interface User {
      id: string;
      name: string;
      email: string;
      image?: string | StaticImport; // Ou outros campos que você precisa
    }
  }
}
