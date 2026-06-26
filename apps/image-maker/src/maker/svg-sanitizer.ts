const allowedTags = new Set([
  "svg",
  "g",
  "path",
  "rect",
  "circle",
  "ellipse",
  "line",
  "polyline",
  "polygon",
  "defs",
  "lineargradient",
  "radialgradient",
  "stop",
  "clippath",
  "mask",
  "title",
  "desc"
]);

const allowedAttributes = new Set([
  "xmlns",
  "viewBox",
  "width",
  "height",
  "d",
  "x",
  "y",
  "x1",
  "x2",
  "y1",
  "y2",
  "cx",
  "cy",
  "r",
  "rx",
  "ry",
  "points",
  "fill",
  "fill-rule",
  "clip-rule",
  "stroke",
  "stroke-width",
  "stroke-linecap",
  "stroke-linejoin",
  "stroke-miterlimit",
  "opacity",
  "fill-opacity",
  "stroke-opacity",
  "transform",
  "id",
  "offset",
  "stop-color",
  "stop-opacity",
  "gradientUnits",
  "gradientTransform",
  "clip-path",
  "mask"
]);

const urlLikePattern = /url\s*\(|https?:|data:|javascript:/i;

function isSafeAttribute(name: string, value: string) {
  if (name.startsWith("on")) {
    return false;
  }

  if (name === "href" || name === "xlink:href" || name === "src") {
    return false;
  }

  if (name === "style") {
    return false;
  }

  if (!allowedAttributes.has(name)) {
    return false;
  }

  if (urlLikePattern.test(value) && !value.startsWith("url(#")) {
    return false;
  }

  return true;
}

export function sanitizeSvg(input: string) {
  const parser = new DOMParser();
  const document = parser.parseFromString(input, "image/svg+xml");
  const parserError = document.querySelector("parsererror");
  const root = document.documentElement;

  if (parserError || root.nodeName.toLowerCase() !== "svg") {
    return {
      svg: "",
      isValid: false,
      removedCount: 0,
      message: "유효한 SVG 루트가 아닙니다."
    };
  }

  let removedCount = 0;

  for (const element of Array.from(document.querySelectorAll("*"))) {
    const tagName = element.tagName.toLowerCase();

    if (!allowedTags.has(tagName)) {
      element.remove();
      removedCount += 1;
      continue;
    }

    for (const attribute of Array.from(element.attributes)) {
      if (!isSafeAttribute(attribute.name, attribute.value)) {
        element.removeAttribute(attribute.name);
        removedCount += 1;
      }
    }
  }

  root.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  if (!root.getAttribute("viewBox")) {
    const width = Number.parseFloat(root.getAttribute("width") ?? "24");
    const height = Number.parseFloat(root.getAttribute("height") ?? "24");

    root.setAttribute("viewBox", `0 0 ${width || 24} ${height || 24}`);
  }

  return {
    svg: new XMLSerializer().serializeToString(root),
    isValid: true,
    removedCount,
    message:
      removedCount > 0
        ? `안전하지 않은 태그 또는 속성 ${removedCount}개를 제거했습니다.`
        : "SVG가 안전 정책을 통과했습니다."
  };
}
