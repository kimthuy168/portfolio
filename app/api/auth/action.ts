'use server';

import { createUser, getUserByEmail } from "@/lib/db/queries";
import { signIn } from "./auth";
import { hash } from "bcrypt-ts";

export async function loginAction(formData: {
  email: string;
  password: string;
}) {
  const { email, password } = formData;

  try {
    const existingUser = await getUserByEmail(email);
    if (!existingUser) {
      return { error: "User not found. Please sign up." };
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!result || result.error) {
      if (result?.error === "CredentialsSignin") {
        return { error: "Incorrect email or password." };
      }
      return { error: result?.error || "Login failed." };
    }

    return { success: true , userId: existingUser.id};
  } catch (error) {
    console.error("Unexpected login error:", error);
    return { error: "Unexpected error during login." };
  }
}

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

  return { success: true , userId: user.id};
}