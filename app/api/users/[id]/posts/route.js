import { pool } from "@/utils/database";

export const GET = async (request, { params }) => {
  try {
    const prompts = await pool.query(
      "SELECT * FROM prompt INNER JOIN users ON users.id = prompt.creator WHERE creator = $1",
      [parseInt(params.id)]
    );
    console.log(prompts);
    return new Response(JSON.stringify(prompts.rows), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch prompts created by user", {
      status: 500,
    });
  }
};
