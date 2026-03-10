"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";

export async function login(prevState: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", Object.fromEntries(formData));
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return "Invalid credentials.";
        default:
          return "Something went wrong.";
      }
    }
    throw error; // This is important for Next.js redirect to work
  }
}

export async function logout() {
  await signOut({ redirectTo: "/login" });
}
