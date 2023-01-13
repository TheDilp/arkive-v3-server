export function removeNull(obj: JSON) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k, v]) => {
      if ((k === "content" || k === "properties") && v === null) return false;
      return true;
    }),
  );
}

export function onlyUniqueStrings(value: string, index: number, self: string[]) {
  return self.indexOf(value) === index;
}

export function hasValueDeep(json: any, findValue: string): boolean {
  const lowercasedFindValue = findValue.toLowerCase();
  let hasValue = false;

  if (typeof json === "object" && !Array.isArray(json)) {
    const keys = Object.keys(json);
    keys.forEach((key) => {
      if (hasValue) return hasValue;
      if (key === "text" || key === "label" || key === "content" || key === "attrs") {
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
