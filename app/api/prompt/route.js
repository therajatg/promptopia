import { pool } from "@/utils/database";

export const GET = async (req) => {
  try {
    // const res = await pool.query("SELECT * FROM prompt");
    const res = await pool.query(
      "SELECT * FROM prompt INNER JOIN users on prompt.creator = users.id"
    );
    console.log(res);
    return new Response(JSON.stringify(res.rows), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts", { status: 500 });
  }
};
