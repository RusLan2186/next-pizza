import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth/next";

export const getUserSession = async () => {
  const session = await getServerSession(authOptions);

  return session?.user ?? null;

}