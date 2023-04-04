import { FastifyReply } from "fastify";
import tiny from "tiny-json-http";
import { formatImage } from "./transform";
import { AvailableDiscordTypes } from "../types/dataTypes";

export function getRandomIntInclusive(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); // The maximum is inclusive and the minimum is inclusive
}

function getDiscordItemThumbnail(type: AvailableDiscordTypes) {
  if (type === "documents")
    return "https://api.iconify.design/ph/file-text.svg?color=white";
  if (type === "maps")
    return "https://api.iconify.design/ph/map-trifold.svg?color=white";
  if (type === "boards")
    return "https://api.iconify.design/ph/graph-light.svg?color=white";
  return "";
}

function getDiscordItemTitle(type: AvailableDiscordTypes, title: string) {
  if (
    type === "documents" ||
    type === "maps" ||
    type === "random_tables" ||
    type === "random_table_options"
  )
    return title;
  if (type === "boards") return `${title} (Graph)`;
  return "";
}

function getDiscordItemURL(
  type: AvailableDiscordTypes,
  id?: string,
  image?: string | null
) {
  if (type === "images" && image) return image;
  else if (type === "images" && !image) return "";
  else if (type === "random_tables" || type === "random_table_options")
    return "";
  else return `https://thearkive.app/view/${type}/${id}`;
}

export async function sendPublicItem(
  id: string,
  title: string,
  itemType: AvailableDiscordTypes,
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
      url: getDiscordItemURL(itemType, id, image),
      thumbnail: {
        url: getDiscordItemThumbnail(itemType),
      },
    };
    if (image) data.image = { url: formatImage(image) };
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
    return;
  }
}
