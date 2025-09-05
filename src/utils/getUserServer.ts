"use server";

import { verifyToken } from "@/utils/auth";
import { cookies } from "next/headers";
import getClient from "./db";
import { UserType } from "@/types/User";

const getMe = async (): Promise<false | UserType> => {
  try {
    const client = await getClient();

    if (!client) {
      return false;
    }

    const token = (await cookies()).get("user-token");

    if (!token) {
      return false;
    }

    const verifiedToken = verifyToken(token.value);

    if (!verifiedToken.isSuccessfully) {
      return false;
    }

    let user: UserType | null;

    if ((verifiedToken.payload as { username: string }).username) {
      const { rows, rowCount } = await client.query(
        "SELECT id,username,password FROM USERS WHERE username=$1",
        [(verifiedToken.payload as { username: string }).username]
      );

      if (rowCount !== 1) {
        return false;
      }

      user = rows[0];
    } else {
      return false;
    }

    return user || false;
  } catch {
    return false;
  }
};

const getUser = async () => {
  const user = await getMe();

  if (user !== false) {
    return { isLogin: true, user };
  }

  return { isLogin: false };
};

export default getUser;
