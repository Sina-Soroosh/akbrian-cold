import { serialize } from "cookie";

export const POST = async () => {
  try {
    const cookieToken = await serialize("user-token", "", {
      httpOnly: true,
      path: "/",
      maxAge: -1,
    });

    const headers = new Headers();

    headers.append("Set-Cookie", cookieToken);

    return Response.json({ message: "Logout is successfully" }, { headers });
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error !!", error },
      {
        status: 500,
      }
    );
  }
};
