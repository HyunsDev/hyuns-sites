import { useEffect, useMemo, useState, type ComponentType, type SVGProps } from "react";
import BadgeIcon from "lucide-react/dist/esm/icons/badge.mjs";
import BoxIcon from "lucide-react/dist/esm/icons/box.mjs";
import ChevronDownIcon from "lucide-react/dist/esm/icons/chevron-down.mjs";
import ClipboardIcon from "lucide-react/dist/esm/icons/clipboard.mjs";
import Code2Icon from "lucide-react/dist/esm/icons/code-2.mjs";
import DownloadIcon from "lucide-react/dist/esm/icons/download.mjs";
import ImageIcon from "lucide-react/dist/esm/icons/image.mjs";
import ImagePlusIcon from "lucide-react/dist/esm/icons/image-plus.mjs";
import LayersIcon from "lucide-react/dist/esm/icons/layers.mjs";
import PaletteIcon from "lucide-react/dist/esm/icons/palette.mjs";
import SearchIcon from "lucide-react/dist/esm/icons/search.mjs";
import ShapesIcon from "lucide-react/dist/esm/icons/shapes.mjs";
import { siGithub } from "simple-icons";
import { Alert, AlertDescription, AlertTitle } from "@hyunsdev/ui/components/alert";
import { Button } from "@hyunsdev/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@hyunsdev/ui/components/dropdown-menu";
import { Input } from "@hyunsdev/ui/components/input";
import { Label } from "@hyunsdev/ui/components/label";
import { Separator } from "@hyunsdev/ui/components/separator";
import { Slider } from "@hyunsdev/ui/components/slider";
import { Textarea } from "@hyunsdev/ui/components/textarea";
import { ToggleGroup, ToggleGroupItem } from "@hyunsdev/ui/components/toggle-group";
import {
  Workbench,
  WorkbenchContentArea,
  WorkbenchPrimarySidebar,
  WorkbenchProvider,
  WorkbenchSidebarContent,
  WorkbenchSidebarFooter,
  WorkbenchSidebarGroup,
  WorkbenchSidebarHeader,
  WorkbenchSidebarMenu,
  WorkbenchSidebarMenuButton,
  WorkbenchSidebarMenuItem
} from "@hyunsdev/ui/layouts/workbench";

import { brandIconEntries, loadBrandIconSvg } from "@/maker/brand-icons";
import { getSupportsDisplayP3 } from "@/maker/color";
import { createDefaultOptions, normalizeOptionsForMode } from "@/maker/defaults";
import { loadLucideIcon, lucideIconEntries } from "@/maker/lucide-icons";
import {
  defaultColorPresets,
  readUserColorPresets,
  writeUserColorPresets,
  type ColorPreset
} from "@/maker/presets";
import {
  buildPngPreviewStyle,
  buildVectorSvg,
  downloadBlob,
  downloadText,
  pngSourceToPngBlob,
  svgToPngBlob
} from "@/maker/render";
import { sanitizeSvg } from "@/maker/svg-sanitizer";
import type {
  AssetKind,
  BrandIconEntry,
  CopyStatus,
  LucideIconEntry,
  MakerMode,
  MakerOptions,
  PngSource,
  SourceKind,
  VectorSource
} from "@/maker/types";

const modes: Array<{
  id: SourceKind;
  label: string;
  icon: typeof ShapesIcon;
}> = [
  { id: "lucide", label: "Lucide", icon: ShapesIcon },
  { id: "brand", label: "Brand", icon: BadgeIcon },
  { id: "svg", label: "SVG", icon: LayersIcon },
  { id: "png", label: "PNG", icon: ImageIcon }
];

const modeLabels: Record<SourceKind, string> = {
  lucide: "Lucide",
  brand: "Brand",
  svg: "SVG",
  png: "PNG"
};

const defaultLucideIcon =
  lucideIconEntries.find((icon) => icon.id === "SearchIcon") ?? lucideIconEntries[0]!;
const defaultBrandIcon =
  brandIconEntries.find((icon) => icon.slug === "github") ?? brandIconEntries[0]!;

function slugify(value: string) {
  return value.toLowerCase().replaceAll(/[^a-z0-9]+/g, "-").replaceAll(/^-|-$/g, "");
}

function filterLucideIcons(query: string) {
  const normalized = query.trim().toLowerCase();
  const source = normalized
    ? lucideIconEntries.filter((icon) => icon.title.toLowerCase().includes(normalized))
    : lucideIconEntries;

  return source.slice(0, 48);
}

function filterBrandIcons(query: string) {
  const normalized = query.trim().toLowerCase();
  const source = normalized
    ? brandIconEntries.filter((icon) => {
        const haystack = [icon.title, icon.slug, ...icon.aliases].join(" ").toLowerCase();

        return haystack.includes(normalized);
      })
    : brandIconEntries;

  return source.slice(0, 48);
}

function FieldRow({
  label,
  children,
  value
}: {
  label: string;
  children: React.ReactNode;
  value?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <Label className="text-xs">{label}</Label>
        {value ? <span className="text-muted-foreground text-xs tabular-nums">{value}</span> : null}
      </div>
      {children}
    </div>
  );
}

function ColorInput({
  label,
  value,
  onChange
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <FieldRow label={label} value={value}>
      <div className="flex gap-2">
        <Input
          aria-label={label}
          className="h-8 w-10 shrink-0 p-1"
          type="color"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
        <Input value={value} onChange={(event) => onChange(event.target.value)} />
      </div>
    </FieldRow>
  );
}

export function App() {
  const [mode, setMode] = useState<MakerMode>({ source: "lucide", asset: "icon" });
  const [options, setOptions] = useState<MakerOptions>(() => createDefaultOptions("icon", "lucide"));
  const [lucideQuery, setLucideQuery] = useState("search");
  const [brandQuery, setBrandQuery] = useState("github");
  const [selectedLucide, setSelectedLucide] = useState<LucideIconEntry>(defaultLucideIcon);
  const [selectedLucideIcon, setSelectedLucideIcon] =
    useState<ComponentType<SVGProps<SVGSVGElement>> | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<BrandIconEntry>(defaultBrandIcon);
  const [brandSvg, setBrandSvg] = useState("");
  const [svgInput, setSvgInput] = useState(
    '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2 2 22h20L12 2Z"/></svg>'
  );
  const [pngSource, setPngSource] = useState<PngSource | null>(null);
  const [status, setStatus] = useState<CopyStatus>("idle");
  const [supportsDisplayP3, setSupportsDisplayP3] = useState(false);
  const [userPresets, setUserPresets] = useState<ColorPreset[]>(() => readUserColorPresets());

  useEffect(() => {
    setOptions((current) => normalizeOptionsForMode(current, mode.asset, mode.source));
  }, [mode.asset, mode.source]);

  useEffect(() => {
    setSupportsDisplayP3(getSupportsDisplayP3());
  }, []);

  useEffect(() => {
    let isCurrent = true;

    loadLucideIcon(selectedLucide)
      .then((Icon) => {
        if (isCurrent) {
          setSelectedLucideIcon(() => Icon);
        }
      })
      .catch(() => {
        if (isCurrent) {
          setSelectedLucideIcon(null);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [selectedLucide]);

  useEffect(() => {
    let isCurrent = true;

    if (mode.source !== "brand") {
      return;
    }

    loadBrandIconSvg(selectedBrand.slug)
      .then((svg) => {
        if (isCurrent) {
          setBrandSvg(svg);
          setOptions((current) => ({ ...current, iconColor: selectedBrand.hex }));
        }
      })
      .catch(() => {
        if (isCurrent) {
          setBrandSvg("");
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [mode.source, selectedBrand]);

  const sanitizedSvg = useMemo(() => sanitizeSvg(svgInput), [svgInput]);
  const lucideResults = useMemo(() => filterLucideIcons(lucideQuery), [lucideQuery]);
  const brandResults = useMemo(() => filterBrandIcons(brandQuery), [brandQuery]);

  const vectorSource = useMemo<VectorSource | null>(() => {
    if (mode.source === "lucide") {
      if (!selectedLucideIcon) {
        return null;
      }

      return {
        kind: "lucide",
        title: selectedLucide.title,
        Icon: selectedLucideIcon
      };
    }

    if (mode.source === "brand" && brandSvg) {
      return {
        kind: "brand",
        title: selectedBrand.title,
        slug: selectedBrand.slug,
        hex: selectedBrand.hex,
        svg: brandSvg
      };
    }

    if (mode.source === "svg" && sanitizedSvg.isValid) {
      return {
        kind: "svg",
        title: "Custom SVG",
        svg: sanitizedSvg.svg
      };
    }

    return null;
  }, [brandSvg, mode.source, sanitizedSvg, selectedBrand, selectedLucide, selectedLucideIcon]);

  const outputSvg = useMemo(() => {
    if (!vectorSource) {
      return "";
    }

    return buildVectorSvg(vectorSource, options);
  }, [options, vectorSource]);

  const title = `${modeLabels[mode.source]} ${mode.asset === "icon" ? "아이콘" : "배너"}`;
  const canExportVector = mode.source !== "png" && outputSvg.length > 0;
  const canExportPng = canExportVector || (mode.source === "png" && pngSource !== null);

  function updateMode(nextMode: Partial<MakerMode>) {
    setMode((current) => ({ ...current, ...nextMode }));
    setStatus("idle");
  }

  function updateOptions(nextOptions: Partial<MakerOptions>) {
    setOptions((current) =>
      normalizeOptionsForMode({ ...current, ...nextOptions }, mode.asset, mode.source)
    );
  }

  async function copySvg() {
    if (!canExportVector) {
      return;
    }

    try {
      await navigator.clipboard.writeText(outputSvg);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  async function copyPng() {
    if (!canExportPng) {
      return;
    }

    try {
      const blob =
        mode.source === "png" && pngSource
          ? await pngSourceToPngBlob(pngSource, options)
          : await svgToPngBlob(outputSvg, options);
      const clipboardItem = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([clipboardItem]);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  async function downloadPng() {
    if (!canExportPng) {
      return;
    }

    try {
      const blob =
        mode.source === "png" && pngSource
          ? await pngSourceToPngBlob(pngSource, options)
          : await svgToPngBlob(outputSvg, options);
      downloadBlob(blob, `${slugify(title)}.png`);
      setStatus("downloaded");
    } catch {
      setStatus("error");
    }
  }

  function onPngFileChange(file: File | undefined) {
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setPngSource({
        kind: "png",
        title: file.name,
        dataUrl: String(reader.result)
      });
    };
    reader.readAsDataURL(file);
  }

  function applyPreset(preset: ColorPreset) {
    updateOptions(preset.options);
  }

  function saveCurrentPreset() {
    const nextPreset: ColorPreset = {
      id: `user-${Date.now()}`,
      name: `Preset ${userPresets.length + 1}`,
      options: {
        backgroundColor: options.backgroundColor,
        iconColor: options.iconColor,
        paddingPercent: options.paddingPercent,
        radiusPercent: options.radiusPercent
      }
    };
    const nextPresets = [...userPresets, nextPreset];

    setUserPresets(nextPresets);
    writeUserColorPresets(nextPresets);
  }

  return (
    <WorkbenchProvider>
      <Workbench>
        <WorkbenchPrimarySidebar>
          <WorkbenchSidebarHeader>
            <div className="flex items-center gap-2 px-2 py-1.5">
              <div className="bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-md">
                <ImagePlusIcon className="size-4" />
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">Image Maker</div>
                <div className="text-muted-foreground truncate text-xs">Icon and banner assets</div>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="mt-2 w-full justify-between" variant="outline" size="sm">
                  Sites
                  <ChevronDownIcon className="size-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-56">
                <DropdownMenuItem asChild>
                  <a href="https://hyuns.dev">HyunsDev</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://hyuns.space">Hyuns Space</a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href="https://hyuns.dev">Portal</a>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </WorkbenchSidebarHeader>
          <WorkbenchSidebarContent>
            <WorkbenchSidebarGroup>
              <WorkbenchSidebarMenu>
                {modes.map((item) => (
                  <WorkbenchSidebarMenuItem key={item.id}>
                    <WorkbenchSidebarMenuButton
                      isActive={mode.source === item.id}
                      onClick={() => updateMode({ source: item.id })}
                    >
                      <item.icon />
                      <span>{item.label} 아이콘/배너</span>
                    </WorkbenchSidebarMenuButton>
                  </WorkbenchSidebarMenuItem>
                ))}
              </WorkbenchSidebarMenu>
            </WorkbenchSidebarGroup>
            <Separator className="my-2" />
            <WorkbenchSidebarGroup>
              <WorkbenchSidebarMenu>
                <WorkbenchSidebarMenuItem>
                  <WorkbenchSidebarMenuButton
                    isActive={mode.asset === "icon"}
                    onClick={() => updateMode({ asset: "icon" })}
                  >
                    <BoxIcon />
                    <span>아이콘</span>
                  </WorkbenchSidebarMenuButton>
                </WorkbenchSidebarMenuItem>
                <WorkbenchSidebarMenuItem>
                  <WorkbenchSidebarMenuButton
                    isActive={mode.asset === "banner"}
                    onClick={() => updateMode({ asset: "banner" })}
                  >
                    <PaletteIcon />
                    <span>배너</span>
                  </WorkbenchSidebarMenuButton>
                </WorkbenchSidebarMenuItem>
              </WorkbenchSidebarMenu>
            </WorkbenchSidebarGroup>
          </WorkbenchSidebarContent>
          <WorkbenchSidebarFooter>
            <a
              className="text-muted-foreground hover:text-foreground flex items-center gap-2 rounded-md px-2 py-2 text-xs transition-colors"
              href="https://github.com/HyunsDev/hyuns-sites"
              rel="noreferrer"
              target="_blank"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
                className="size-4"
                focusable="false"
              >
                <path d={siGithub.path} />
              </svg>
              <span className="min-w-0 truncate">Developed By HyunsDev</span>
            </a>
          </WorkbenchSidebarFooter>
        </WorkbenchPrimarySidebar>
        <WorkbenchContentArea>
          <div className="flex min-h-0 flex-1 flex-col">
            <header className="border-border bg-background/95 flex h-14 shrink-0 items-center justify-between border-b px-5">
              <div>
                <h1 className="text-base font-semibold">{title}</h1>
                <p className="text-muted-foreground text-xs">
                  왼쪽에서 소스와 옵션을 고르고 오른쪽에서 SVG 또는 PNG로 내보냅니다.
                </p>
              </div>
              <ToggleGroup
                type="single"
                value={mode.asset}
                onValueChange={(value) => {
                  if (value) {
                    updateMode({ asset: value as AssetKind });
                  }
                }}
              >
                <ToggleGroupItem value="icon">Icon</ToggleGroupItem>
                <ToggleGroupItem value="banner">Banner</ToggleGroupItem>
              </ToggleGroup>
            </header>
            <div className="grid min-h-0 flex-1 grid-cols-[minmax(300px,420px)_1fr]">
              <section className="border-border bg-background min-h-0 overflow-auto border-r p-4">
                <div className="space-y-5">
                  {mode.source === "lucide" ? (
                    <IconSearchPanel
                      label="Lucide 검색"
                      query={lucideQuery}
                      onQueryChange={setLucideQuery}
                      items={lucideResults}
                      selectedId={selectedLucide.id}
                      onSelect={(item) => setSelectedLucide(item)}
                      getId={(item) => item.id}
                      getTitle={(item) => item.title}
                      getSwatch={() => options.iconColor}
                    />
                  ) : null}
                  {mode.source === "brand" ? (
                    <IconSearchPanel
                      label="Brand 검색"
                      query={brandQuery}
                      onQueryChange={setBrandQuery}
                      items={brandResults}
                      selectedId={selectedBrand.slug}
                      onSelect={setSelectedBrand}
                      getId={(item) => item.slug}
                      getTitle={(item) => item.title}
                      getSwatch={(item) => item.hex}
                    />
                  ) : null}
                  {mode.source === "svg" ? (
                    <div className="space-y-3">
                      <FieldRow label="SVG 입력">
                        <Textarea
                          className="min-h-40 font-mono text-xs"
                          value={svgInput}
                          onChange={(event) => setSvgInput(event.target.value)}
                        />
                      </FieldRow>
                      <Alert>
                        <Code2Icon className="size-4" />
                        <AlertTitle>SVG 보안 정책</AlertTitle>
                        <AlertDescription>{sanitizedSvg.message}</AlertDescription>
                      </Alert>
                    </div>
                  ) : null}
                  {mode.source === "png" ? (
                    <div className="space-y-3">
                      <FieldRow label="PNG 파일">
                        <Input
                          accept="image/png"
                          type="file"
                          onChange={(event) => onPngFileChange(event.target.files?.[0])}
                        />
                      </FieldRow>
                      <Alert>
                        <ImageIcon className="size-4" />
                        <AlertTitle>PNG는 sRGB 고정</AlertTitle>
                        <AlertDescription>
                          PNG 입력 화면은 아이콘 색과 P3 옵션을 제공하지 않습니다.
                        </AlertDescription>
                      </Alert>
                    </div>
                  ) : null}
                  <Separator />
                  <SizeOptions mode={mode} options={options} onChange={updateOptions} />
                  <Separator />
                  <ColorInput
                    label="배경 색"
                    value={options.backgroundColor}
                    onChange={(backgroundColor) => updateOptions({ backgroundColor })}
                  />
                  {mode.source !== "png" ? (
                    <>
                      <ColorInput
                        label="아이콘 색"
                        value={options.iconColor}
                        onChange={(iconColor) => updateOptions({ iconColor })}
                      />
                      <FieldRow label="색 영역" value={options.colorSpace}>
                        <ToggleGroup
                          type="single"
                          value={options.colorSpace}
                          onValueChange={(value) => {
                            if (value) {
                              updateOptions({ colorSpace: value as MakerOptions["colorSpace"] });
                            }
                          }}
                        >
                          <ToggleGroupItem value="srgb">sRGB</ToggleGroupItem>
                          <ToggleGroupItem value="display-p3">Display P3</ToggleGroupItem>
                        </ToggleGroup>
                      </FieldRow>
                      {options.colorSpace === "display-p3" && !supportsDisplayP3 ? (
                        <Alert>
                          <PaletteIcon className="size-4" />
                          <AlertTitle>Display P3 표시 미지원</AlertTitle>
                          <AlertDescription>
                            이 브라우저는 Display P3 표시를 지원하지 않아 sRGB로 미리보기됩니다.
                          </AlertDescription>
                        </Alert>
                      ) : null}
                    </>
                  ) : null}
                  <PresetPanel
                    presets={[...defaultColorPresets, ...userPresets]}
                    onApply={applyPreset}
                    onSave={saveCurrentPreset}
                  />
                </div>
              </section>
              <section className="bg-muted/30 flex min-h-0 flex-col gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-sm font-medium">미리보기</h2>
                    <p className="text-muted-foreground text-xs">
                      {options.width} x {options.height}px, padding {options.paddingPercent}%
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Button disabled={!canExportVector} size="sm" variant="outline" onClick={copySvg}>
                      <ClipboardIcon className="size-4" />
                      SVG 복사
                    </Button>
                    <Button disabled={!canExportPng} size="sm" variant="outline" onClick={copyPng}>
                      <ClipboardIcon className="size-4" />
                      PNG 복사
                    </Button>
                    <Button
                      disabled={!canExportVector}
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        downloadText(outputSvg, `${slugify(title)}.svg`, "image/svg+xml");
                        setStatus("downloaded");
                      }}
                    >
                      <DownloadIcon className="size-4" />
                      SVG 다운로드
                    </Button>
                    <Button disabled={!canExportPng} size="sm" onClick={downloadPng}>
                      <DownloadIcon className="size-4" />
                      PNG 다운로드
                    </Button>
                  </div>
                </div>
                <div className="preview-grid border-border flex min-h-0 flex-1 items-center justify-center rounded-lg border p-6">
                  <Preview
                    mode={mode}
                    options={options}
                    outputSvg={outputSvg}
                    pngSource={pngSource}
                  />
                </div>
                <div className="text-muted-foreground h-5 text-xs" role="status">
                  {status === "copied"
                    ? "클립보드에 복사했습니다."
                    : status === "downloaded"
                      ? "파일 다운로드를 시작했습니다."
                      : status === "error"
                        ? "브라우저 권한 또는 지원 상태 때문에 작업하지 못했습니다."
                        : ""}
                </div>
              </section>
            </div>
          </div>
        </WorkbenchContentArea>
      </Workbench>
    </WorkbenchProvider>
  );
}

function PresetPanel({
  presets,
  onApply,
  onSave
}: {
  presets: ColorPreset[];
  onApply: (preset: ColorPreset) => void;
  onSave: () => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label className="text-xs">컬러 프리셋</Label>
        <Button size="sm" variant="outline" onClick={onSave}>
          저장
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {presets.map((preset) => (
          <button
            className="border-border hover:bg-accent flex min-w-0 items-center gap-2 rounded-md border px-2 py-1.5 text-left text-xs transition-colors"
            key={preset.id}
            type="button"
            onClick={() => onApply(preset)}
          >
            <span className="flex shrink-0 -space-x-1">
              <span
                className="border-background size-4 rounded-full border"
                style={{ backgroundColor: preset.options.backgroundColor }}
              />
              <span
                className="border-background size-4 rounded-full border"
                style={{ backgroundColor: preset.options.iconColor }}
              />
            </span>
            <span className="truncate">{preset.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function SizeOptions({
  mode,
  options,
  onChange
}: {
  mode: MakerMode;
  options: MakerOptions;
  onChange: (nextOptions: Partial<MakerOptions>) => void;
}) {
  return (
    <div className="space-y-4">
      <FieldRow label="이미지 크기" value={`${options.width} x ${options.height}`}>
        <div className="grid grid-cols-2 gap-2">
          <Input
            disabled={mode.asset === "banner"}
            min={64}
            type="number"
            value={options.width}
            onChange={(event) => onChange({ width: Number(event.target.value) })}
          />
          <Input
            disabled={mode.asset === "banner"}
            min={64}
            type="number"
            value={options.height}
            onChange={(event) => onChange({ height: Number(event.target.value) })}
          />
        </div>
      </FieldRow>
      <FieldRow label="모서리 둥글기" value={`${Math.round(options.radiusPercent * 100) / 100}%`}>
        <Slider
          disabled={mode.asset === "banner"}
          max={50}
          min={0}
          step={0.1}
          value={[options.radiusPercent]}
          onValueChange={([radiusPercent]) => onChange({ radiusPercent })}
        />
      </FieldRow>
      <FieldRow label="여백" value={`${options.paddingPercent}%`}>
        <Slider
          max={40}
          min={0}
          step={1}
          value={[options.paddingPercent]}
          onValueChange={([paddingPercent]) => onChange({ paddingPercent })}
        />
      </FieldRow>
    </div>
  );
}

function IconSearchPanel<T>({
  label,
  query,
  onQueryChange,
  items,
  selectedId,
  onSelect,
  getId,
  getTitle,
  getSwatch
}: {
  label: string;
  query: string;
  onQueryChange: (query: string) => void;
  items: T[];
  selectedId: string;
  onSelect: (item: T) => void;
  getId: (item: T) => string;
  getTitle: (item: T) => string;
  getSwatch: (item: T) => string;
}) {
  return (
    <div className="space-y-3">
      <FieldRow label={label}>
        <div className="relative">
          <SearchIcon className="text-muted-foreground pointer-events-none absolute top-1/2 left-2 size-4 -translate-y-1/2" />
          <Input
            className="pl-8"
            value={query}
            onChange={(event) => onQueryChange(event.target.value)}
          />
        </div>
      </FieldRow>
      <div className="border-border grid max-h-64 grid-cols-2 gap-1 overflow-auto rounded-lg border p-1">
        {items.map((item) => {
          const id = getId(item);
          const isSelected = selectedId === id;

          return (
            <button
              className="data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground hover:bg-accent/70 flex min-w-0 items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors"
              data-selected={isSelected}
              key={id}
              type="button"
              onClick={() => onSelect(item)}
            >
              <span
                className="border-border size-3 shrink-0 rounded-full border"
                style={{ backgroundColor: getSwatch(item) }}
              />
              <span className="truncate">{getTitle(item)}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Preview({
  mode,
  options,
  outputSvg,
  pngSource
}: {
  mode: MakerMode;
  options: MakerOptions;
  outputSvg: string;
  pngSource: PngSource | null;
}) {
  const maxWidth = mode.asset === "banner" ? "min(100%, 960px)" : "min(70%, 420px)";
  const aspectRatio = `${options.width} / ${options.height}`;

  if (mode.source === "png" && pngSource) {
    return (
      <div
        className="border-border bg-background shadow-sm"
        style={{
          ...buildPngPreviewStyle(pngSource, options),
          width: maxWidth,
          height: "auto",
          aspectRatio
        }}
      />
    );
  }

  if (!outputSvg) {
    return (
      <div className="text-muted-foreground flex aspect-square w-72 items-center justify-center rounded-lg border bg-background text-sm">
        미리보기할 소스를 선택하세요.
      </div>
    );
  }

  return (
    <img
      alt="Generated preview"
      className="border-border bg-background shadow-sm"
      src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(outputSvg)}`}
      style={{
        width: maxWidth,
        aspectRatio,
        objectFit: "contain"
      }}
    />
  );
}
