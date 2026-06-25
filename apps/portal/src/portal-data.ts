import { load } from "js-yaml";
import portalYaml from "./portal.yml?raw";

export type PortalDirection = "prev" | "next";

export type PortalItem = {
  label: string;
  icon?: string;
  href?: string;
  path?: string;
  direction?: PortalDirection;
  disabled?: boolean;
};

export type PortalGroup = {
  title: string;
  icon?: string;
  items: PortalItem[];
};

export type PortalColumn = {
  groups: PortalGroup[];
};

export type PortalPage = {
  path: string;
  title: string;
  description?: string;
  columns: PortalColumn[];
};

export type PortalConfig = {
  pages: PortalPage[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getString(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (typeof value !== "string" || value.length === 0) {
    throw new Error(`Portal YAML: missing string field "${key}".`);
  }

  return value;
}

function getOptionalString(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (typeof value === "undefined") {
    return undefined;
  }

  if (typeof value !== "string") {
    throw new Error(`Portal YAML: field "${key}" must be a string.`);
  }

  return value;
}

function getOptionalDirection(record: Record<string, unknown>) {
  const value = record.direction;

  if (typeof value === "undefined") {
    return undefined;
  }

  if (value !== "prev" && value !== "next") {
    throw new Error('Portal YAML: field "direction" must be "prev" or "next".');
  }

  return value;
}

function getArray(record: Record<string, unknown>, key: string) {
  const value = record[key];

  if (!Array.isArray(value)) {
    throw new Error(`Portal YAML: field "${key}" must be an array.`);
  }

  return value;
}

function normalizeItem(value: unknown): PortalItem {
  if (!isRecord(value)) {
    throw new Error("Portal YAML: each item must be an object.");
  }

  return {
    label: getString(value, "label"),
    icon: getOptionalString(value, "icon"),
    href: getOptionalString(value, "href"),
    path: getOptionalString(value, "path"),
    direction: getOptionalDirection(value),
    disabled: value.disabled === true
  };
}

function normalizeGroup(value: unknown): PortalGroup {
  if (!isRecord(value)) {
    throw new Error("Portal YAML: each group must be an object.");
  }

  return {
    title: getString(value, "title"),
    icon: getOptionalString(value, "icon"),
    items: getArray(value, "items").map(normalizeItem)
  };
}

function normalizeColumn(value: unknown): PortalColumn {
  if (!isRecord(value)) {
    throw new Error("Portal YAML: each column must be an object.");
  }

  return {
    groups: getArray(value, "groups").map(normalizeGroup)
  };
}

function normalizePage(value: unknown): PortalPage {
  if (!isRecord(value)) {
    throw new Error("Portal YAML: each page must be an object.");
  }

  return {
    path: getString(value, "path"),
    title: getString(value, "title"),
    description: getOptionalString(value, "description"),
    columns: getArray(value, "columns").map(normalizeColumn)
  };
}

function parsePortalConfig(): PortalConfig {
  const parsed = load(portalYaml);

  if (!isRecord(parsed)) {
    throw new Error("Portal YAML: root must be an object.");
  }

  return {
    pages: getArray(parsed, "pages").map(normalizePage)
  };
}

export const portalConfig = parsePortalConfig();

export function getPortalPage(path: string) {
  return portalConfig.pages.find((page) => page.path === path) ?? null;
}
