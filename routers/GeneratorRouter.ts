import { Configuration, OpenAIApi } from "openai";
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

import { FastifyReply, FastifyRequest } from "fastify";
import { FastifyInstance } from "fastify";

const openai = new OpenAIApi(configuration);

export const generatorRouter = (server: FastifyInstance, _: any, done: any) => {
  server.post(
    "/generate",
    async (req: FastifyRequest<{ Body: string }>, rep: FastifyReply) => {
      try {
        const data: { prompt: string } = JSON.parse(req.body);
        const response = await openai.createCompletion({
          model: "text-babbage-001",
          prompt: data.prompt,
          temperature: 0.5,
          max_tokens: 100,
        });
        return response.data;
      } catch (error) {
        rep.status(500);
        console.log(error);
        return false;
      }
    }
  );
  done();
};
