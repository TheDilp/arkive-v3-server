import { FastifyReply } from "fastify";
import tiny from "tiny-json-http";

function getDiscordItemThumbnail(type: "documents" | "maps" | "boards") {
  if (type === "documents")
    return "https://api.iconify.design/ph/file-text.svg?color=white";
  if (type === "maps")
    return "https://api.iconify.design/ph/map-trifold.svg?color=white";
  if (type === "boards")
    return "https://api.iconify.design/ph/graph-light.svg?color=white";
  return "";
}

function getDiscordItemTitle(
  type: "documents" | "maps" | "boards",
  title: string
) {
  if (type === "documents" || type === "maps") return title;
  if (type === "boards") return `${title} (Graph)`;
  return "";
}

export async function sendPublicItem(
  id: string,
  title: string,
  itemType: "documents" | "maps" | "boards",
  webhookUrl: string,
  rep: FastifyReply,
  image?: string | null,
  content?: string
) {
  try {
    let data: {
      title: string;
      url: string;
      thumbnail: { url: string };
      image?: { url: string };
      description?: string;
    } = {
      title: getDiscordItemTitle(itemType, title),
      url: `https://thearkive.app/view/${itemType}/${id}`,
      thumbnail: {
        url: getDiscordItemThumbnail(itemType),
      },
    };
    if (image) data.image = { url: image };
    if (content) data.description = content;

    await tiny.post({
      url: webhookUrl,
      headers: {
        "Content-type": "application/json",
      },
      data: {
        embeds: [data],
      },
    });
    rep.send(true);
  } catch (error) {
    rep.code(500);
    rep.send(false);
    console.log(error);
    return;
  }
}
