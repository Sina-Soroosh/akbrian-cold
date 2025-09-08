import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";

export const GET = async (req: Request): Promise<Response> => {
  try {
    const client = await getClient();
    if (!client)
      return Response.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );

    const { isLogin } = await getUser();
    if (!isLogin)
      return Response.json({ message: "Unauthorized" }, { status: 403 });

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const pageSize = 10;
    const offset = (page - 1) * pageSize;

    const query = `
  SELECT *
  FROM FilledBasketsColdStorage
  ORDER BY EntryDate DESC
  LIMIT $1 OFFSET $2;
`;
    const { rows } = await client.query(query, [pageSize, offset]);

    const countQuery = `SELECT COUNT(*) AS total FROM FilledBasketsColdStorage;`;
    const { rows: countRows } = await client.query(countQuery);
    const total = parseInt(countRows[0].total, 10);

    return Response.json(
      {
        data: rows,
        pagination: {
          page,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};
