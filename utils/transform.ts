import {
  HeadingType,
  MentionAtomType,
  ParagraphType,
} from "../types/dataTypes";

export function formatImage(image: string) {
  return image.replaceAll(" ", "%20");
}

export function removeNull(obj: JSON) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => {
      if ((k === "content" || k === "properties") && v === null) return false;
      return true;
    })
  );
}

export function onlyUniqueStrings(
  value: string,
  index: number,
  self: string[]
) {
  return self.indexOf(value) === index;
}

export function hasValueDeep(json: any, findValue: string): boolean {
  const lowercasedFindValue = findValue.toLowerCase();
  let hasValue = false;

  if (typeof json === "object" && !Array.isArray(json)) {
    const keys = Object.keys(json);
    keys.forEach((key) => {
      if (hasValue) return hasValue;
      if (
        key === "text" ||
        key === "label" ||
        key === "content" ||
        key === "attrs"
      ) {
        if (typeof json[key] === "string") {
          hasValue = json[key]?.toLowerCase().includes(lowercasedFindValue);
          if (hasValue) return hasValue;
        }
        if (typeof json[key] === "object") {
          hasValue = hasValue || hasValueDeep(json[key], lowercasedFindValue);
          if (hasValue) return hasValue;
        }
      }
      if (hasValue) return hasValue;
      return hasValue;
    });
  }
  if (Array.isArray(json)) {
    for (let index = 0; index < json.length; index += 1) {
      hasValue = hasValue || hasValueDeep(json[index], lowercasedFindValue);

      if (hasValue) return hasValue;
    }
  }
  return hasValue;
}

export function extractMentionContent(mention: MentionAtomType) {
  if (mention.attrs?.projectId) {
    let link = `https://thearkive.app/view/documents/${mention.attrs.id}`;
    const text = `[${mention?.attrs?.label}](${link})`;
    return text;
  }
  return mention.attrs.label;
}

export function extractParagraphContent(paragraph: ParagraphType) {
  if (paragraph?.content) {
    const text = paragraph?.content
      .filter((obj) => obj?.type !== "image")
      .map((obj) => {
        if ("text" in obj) return obj.text;
        // if ("attrs" in obj && "alt" in obj.attrs) return "";
        if ("attrs" in obj && "label" in obj.attrs) {
          return extractMentionContent(obj as MentionAtomType);
        }
      })
      .join("");
    return `${text}`;
  }
  return "";
}
export function extractHeadingContent(heading: HeadingType) {
  const text = heading?.content?.map((obj) => obj?.text).join(" ");
  return `${text}\n`;
}

export function extractDocumentText(content: any) {
  if (!content) return false;
  const text: string[] = [];
  let len = 0;
  Object.entries(content).forEach(([key, value]) => {
    if (len >= 250) {
      return;
    }

    if (key === "content") {
      if (Array.isArray(value)) {
        value.forEach((obj) => {
          if (len >= 250) {
            return;
          }
          if (obj?.type === "heading") {
            const heading = extractHeadingContent(obj);
            len += heading.length;
            text.push(heading);
          } else if (obj?.type === "paragraph") {
            const paragraph = extractParagraphContent(obj);
            text.push(paragraph);
            len += paragraph.length;
          }
        });
      }
    }
  });

  return text.join("").slice(0, 249).replaceAll('"', "'").concat("...");
}
