import getClient from "@/utils/db";
import getUser from "@/utils/getUserServer";

type Params = { params: { code: string } };

export const GET = async (
  req: Request,
  { params }: Params
): Promise<Response> => {
  try {
    const client = await getClient();
    if (!client) {
      return Response.json(
        { message: "Internal Server Error" },
        { status: 500 }
      );
    }

    const { isLogin } = await getUser();
    if (!isLogin) {
      return Response.json({ message: "Unauthorized" }, { status: 403 });
    }

    const basketCode = (await params).code.trim().toUpperCase();
    const hall = basketCode.charAt(0);
    const number = basketCode.slice(1);

    if (!hall || !number) {
      return Response.json(
        {
          data: [],
        },
        { status: 200 }
      );
    }

    const { rows: occupiedBaskets } = await client.query(
      `
      WITH LastStatus AS (
        SELECT
          tb.BasketCode,
          t.Hall,
          t.CustomerID,
          t.TransactionType,
          ROW_NUMBER() OVER (PARTITION BY t.Hall, tb.BasketCode ORDER BY t.TransactionDate DESC, t.TransactionID DESC) AS rn
        FROM TransactionBaskets tb
        JOIN Transactions t ON t.TransactionID = tb.TransactionID
      )
      SELECT Hall, BasketCode, CustomerID
      FROM LastStatus
      WHERE rn = 1 AND TransactionType = 'IN' AND Hall = $1 AND BasketCode=$2
      ORDER BY Hall, BasketCode
    `,
      [hall, number]
    );

    if (occupiedBaskets.length === 0) {
      return Response.json(
        {
          data: [],
        },
        { status: 200 }
      );
    }

    const customerIds = occupiedBaskets.map((occ) => occ.customerid);

    const { rows: customers } = await client.query(
      `
  SELECT 
    c.*,
    COALESCE(SUM(CASE WHEN t.transactiontype = 'IN' THEN t.weight ELSE 0 END), 0) AS total_in,
    COALESCE(SUM(CASE WHEN t.transactiontype = 'OUT' THEN t.weight ELSE 0 END), 0) AS total_out
  FROM customers c
  LEFT JOIN transactions t ON t.customerid = c.customerid
  WHERE c.customerid IN ($1)
  GROUP BY c.customerid
  ORDER BY c.customerid DESC
      `,
      customerIds
    );

    return Response.json(
      {
        data: customers,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("GET /api/baskets/[code] error:", error);
    return Response.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
};
