import { pool } from "@/utils/database";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  callbacks: {
    async session({ session }) {
      // store the user id from postgres to session
      const sessionUser = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [session.user.email]
      );
      session.user.id = sessionUser.rows[0].id.toString();
      return session;
    },
    async signIn({ account, profile, user, credentials }) {
      try {
        // check if user already exists
        const userDetail = await pool.query(
          "SELECT * FROM users WHERE email = $1",
          [profile.email]
        );

        // if not, create a new document and save user in MongoDB
        if (!userDetail.rowCount) {
          await pool.query(
            "INSERT INTO users (email, username, image) VALUES($1, $2, $3)",
            [
              profile.email,
              profile.name.replace(" ", "").toLowerCase(),
              profile.picture,
            ]
          );
        }
        return true;
      } catch (error) {
        console.log("Error checking if user exists: ", error.message);
        return false;
      }
    },
  },
});

export { handler as GET, handler as POST };
