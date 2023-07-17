import { pool } from "@/utils/database";

export const POST = async (req) => {
  const { prompt, userId, tag } = await req.json();
  try {
    const res = await pool.query(
      "INSERT INTO prompt VALUES($1, $2, $3) RETURNING *",
      [parseInt(userId), prompt, tag]
    );
    return new Response(JSON.stringify(res.rows[0]), { status: 201 });
  } catch (error) {
    return new Response("Failed to create a new prompt", { status: 500 });
  }
};
