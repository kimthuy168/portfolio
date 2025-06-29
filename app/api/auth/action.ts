'use server';


import { createUser, getUserByEmail } from "@/lib/db/queries";
import { hash } from "bcrypt-ts";
import { AuthError } from "next-auth";
import { signIn } from "./auth";


export async function registerAction(formData: {
  email: string;
  name: string;
  password: string;
}) {
  const { email, name, password } = formData;

  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return { error: "Email already exists" };
  }

  const hashedPassword = await hash(password, 10);
  const user = await createUser(email, hashedPassword, "credentials", name);

  if (!user) {
    return { error: "Failed to create user" };
  }

  return { success: true };
}

// Login with credentials
export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  const { email, password } = formData;

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: "Invalid credentials" };
    }

    console.error("Login failed", error);
    return { error: "Unexpected error during login" };
  }
}
