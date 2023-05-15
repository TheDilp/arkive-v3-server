import { getAuth } from "@clerk/fastify";
import { FastifyRequest, FastifyReply } from "fastify";

export async function clerkPreHandler(
  req: FastifyRequest,
  reply: FastifyReply
) {
  const { sessionId } = getAuth(req);
  if (!sessionId) {
    reply.status(401);
    reply.send({ error: "User could not be verified" });
  }
}

export function checkIfLocal(req: FastifyRequest, rep: FastifyReply) {
  const { userId } = getAuth(req);
  if (!userId) {
    rep.code(403);
    rep.send("NOT AUTHORIZED");
    return null;
  } else {
    return userId;
  }
  return null;
}
