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
    const q = url.searchParams.get("q")?.trim() || "";

    if (!q) return Response.json({ data: [] }, { status: 200 });

    const words = q.split(/\s+/).filter(Boolean);

    const conditions: string[] = [];
    const values: string[] = [];
    let idx = 1;

    words.forEach((word) => {
      conditions.push(`
        FirstName ILIKE '%' || $${idx} || '%'
        OR LastName ILIKE '%' || $${idx} || '%'
        OR ProductName ILIKE '%' || $${idx} || '%'
        OR Phone ILIKE '%' || $${idx} || '%'
        OR NationalCode ILIKE '%' || $${idx} || '%'
      `);
      values.push(word);
      idx++;
    });

    const whereClause = "WHERE " + conditions.join(" AND ");

    const query = `
  SELECT 
    c.*,
    COALESCE(SUM(CASE WHEN t.transactiontype = 'IN' THEN t.weight ELSE 0 END), 0) AS total_in,
    COALESCE(SUM(CASE WHEN t.transactiontype = 'OUT' THEN t.weight ELSE 0 END), 0) AS total_out
  FROM customers c
  LEFT JOIN transactions t ON t.customerid = c.customerid
  ${whereClause}
  GROUP BY c.customerid
  ORDER BY c.customerid DESC
`;

    const { rows } = await client.query(query, values);

    return Response.json({ data: rows }, { status: 200 });
  } catch (error) {
    return Response.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};
