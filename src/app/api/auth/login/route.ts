import { UserType } from "@/types/User";
import { compereHashedPassword, generateToken } from "@/utils/auth";
import getClient from "@/utils/db";
import { serialize } from "cookie";

type Parameters = {
  username: string;
  password: string;
};

export const POST = async (req: Request): Promise<Response> => {
  try {
    const client = await getClient();

    if (!client) {
      return Response.json(
        { message: "Internal Server Error !!" },
        { status: 500 }
      );
    }

    const body: Parameters = await req.json();

    const { rows, rowCount } = await client.query(
      "SELECT id,username,password FROM USERS WHERE username=$1",
      [body.username]
    );

    if (rowCount !== 1) {
      return Response.json({ message: "Notfound user !!" }, { status: 404 });
    }

    const user: UserType = rows[0];

    const isValidPassword: boolean = compereHashedPassword(
      body.password,
      user.password
    );

    if (!isValidPassword) {
      return Response.json({ message: "Notfound user !!" }, { status: 404 });
    }

    const token: string = generateToken({ username: user.username });

    const cookieToken: string = await serialize("user-token", token, {
      httpOnly: true,
      path: "/",
    });

    const headers: Headers = new Headers();

    headers.append("Set-Cookie", cookieToken);

    return Response.json(
      { message: "Login is successfully" },
      {
        status: 200,
        headers,
      }
    );
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error !!", error },
      { status: 500 }
    );
  }
};
