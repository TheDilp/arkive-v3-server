import {
  HeadingType,
  MentionAtomType,
  ParagraphType,
} from "../types/dataTypes";

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

const doc = {
  type: "doc",
  content: [
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: "right",
      },
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: "right",
      },
      content: [
        {
          type: "image",
          attrs: {
            alt: "",
            src: "https://the-arkive-v3.nyc3.cdn.digitaloceanspaces.com/https://the-arkive-v3.nyc3.cdn.digitaloceanspaces.com/assets/63434506-9b40-42fe-bea7-25cec7c6fedc/images/Logo.webp",
            crop: null,
            title: "",
            width: 163,
            height: 163,
            rotate: null,
            fileName: null,
            resizable: false,
          },
        },
      ],
    },
    {
      type: "heading",
      attrs: {
        level: 1,
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
      content: [
        {
          text: "Description",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: 0,
        nodeLineHeight: null,
        nodeTextAlignment: "start",
      },
      content: [
        {
          text: " The Celestial Blade is a beautiful, ethereal sword with a silver blade and golden hilt. The sword's blade glows with a soft white light, illuminating the area around it with a gentle radiance. ",
          type: "text",
        },
        {
          type: "mentionAtom",
          attrs: {
            id: "3692cbfc-a3bb-4fa5-9838-b280a9aed312",
            name: "documents",
            label: "Veltru",
            alterId: null,
          },
        },
        {
          text: " ",
          type: "text",
        },
        {
          type: "mentionAtom",
          attrs: {
            id: "3692cbfc-a3bb-4fa5-9838-b280a9aed312",
            name: "documents",
            label: "Bunseki",
            projectId: "63434506-9b40-42fe-bea7-25cec7c6fedc",
            alterId: null,
          },
        },
        {
          text: " ",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
    },
    {
      type: "heading",
      attrs: {
        level: 1,
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
      content: [
        {
          text: "Abilities",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: 0,
        nodeLineHeight: null,
        nodeTextAlignment: "start",
      },
      content: [
        {
          text: 'The Celestial Blade is imbued with powerful magic that enhances the wielder\'s abilities in combat. When wielded by a good-aligned creature, the sword deals an additional 2d6 radiant damage to evil-aligned creatures. In addition, the sword has the ability to cast the spell "Cure Wounds" once per day at a 3rd-level spell slot.',
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: 0,
        nodeLineHeight: null,
        nodeTextAlignment: "start",
      },
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: 0,
        nodeLineHeight: null,
        nodeTextAlignment: "start",
      },
      content: [
        {
          text: "Furthermore, when the wielder is in grave danger, the Celestial Blade has the ability to summon a powerful celestial ally to aid them. Once per week, the sword can summon a Planetar or Solar to fight alongside the wielder for 1 minute.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: 0,
        nodeLineHeight: null,
        nodeTextAlignment: "start",
      },
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: 0,
        nodeLineHeight: null,
        nodeTextAlignment: "start",
      },
      content: [
        {
          text: "However, the sword's power is not without a cost. The Celestial Blade demands that its wielder uphold a strict code of honor and righteousness, punishing any act of cowardice or injustice. If the wielder fails to adhere to this code, the sword will refuse to work for them until they have atoned for their transgressions.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: 0,
        nodeLineHeight: null,
        nodeTextAlignment: "start",
      },
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: 0,
        nodeLineHeight: null,
        nodeTextAlignment: "start",
      },
      content: [
        {
          text: "Overall, the Celestial Blade is a powerful magical weapon that is as just and noble as its wielder. It is a symbol of hope and righteousness that inspires allies and strikes fear into the hearts of evil-doers. And it will defeat the moon too if you ask it nicely.",
          type: "text",
        },
      ],
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
    },
    {
      type: "paragraph",
      attrs: {
        style: "",
        nodeIndent: null,
        nodeLineHeight: null,
        nodeTextAlignment: null,
      },
      content: [
        {
          type: "mentionAtom",
          attrs: {
            id: "4cf6ed1f-2a62-44e4-9438-fa8fe5722fb1",
            name: "maps",
            label: "Mappp",
            alterId: null,
          },
        },
        {
          text: " ",
          type: "text",
        },
      ],
    },
  ],
};

export function extractMentionContent(mention: MentionAtomType) {
  if (mention.attrs?.projectId) {
    let link = `https://thearkive.app/project/${mention.attrs.projectId}/${mention.attrs.name}/${mention.attrs.id}`;
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
        if ("attrs" in obj && "label" in obj.attrs)
          return extractMentionContent(obj as MentionAtomType);
      })
      .join(" ");
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

  return text.join(" ").replaceAll('"', "'");
}
