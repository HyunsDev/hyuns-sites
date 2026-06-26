import { useMemo, useState } from "react";
import {
  BadgeIcon,
  BoxIcon,
  ChevronDownIcon,
  ImageIcon,
  ImagePlusIcon,
  LayersIcon,
  PaletteIcon,
  ShapesIcon
} from "lucide-react";
import { siGithub } from "simple-icons";
import { Button } from "@hyunsdev/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@hyunsdev/ui/components/dropdown-menu";
import { Separator } from "@hyunsdev/ui/components/separator";
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

type SourceKind = "lucide" | "brand" | "svg" | "png";
type AssetKind = "icon" | "banner";

type MakerMode = {
  source: SourceKind;
  asset: AssetKind;
};

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

export function App() {
  const [mode, setMode] = useState<MakerMode>({ source: "lucide", asset: "icon" });

  const title = useMemo(
    () => `${modeLabels[mode.source]} ${mode.asset === "icon" ? "아이콘" : "배너"}`,
    [mode]
  );

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
                      onClick={() => setMode((current) => ({ ...current, source: item.id }))}
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
                    onClick={() => setMode((current) => ({ ...current, asset: "icon" }))}
                  >
                    <BoxIcon />
                    <span>아이콘</span>
                  </WorkbenchSidebarMenuButton>
                </WorkbenchSidebarMenuItem>
                <WorkbenchSidebarMenuItem>
                  <WorkbenchSidebarMenuButton
                    isActive={mode.asset === "banner"}
                    onClick={() => setMode((current) => ({ ...current, asset: "banner" }))}
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
                <p className="text-muted-foreground text-xs">왼쪽에서 소스와 옵션을 고르고 오른쪽에서 결과를 내보냅니다.</p>
              </div>
            </header>
            <div className="grid min-h-0 flex-1 grid-cols-[minmax(280px,380px)_1fr]">
              <section className="border-border bg-background min-h-0 border-r p-4">
                <h2 className="text-sm font-medium">옵션</h2>
                <p className="text-muted-foreground mt-1 text-sm">
                  다음 단계에서 검색, 색상, 크기, 여백, 프리셋 컨트롤을 연결합니다.
                </p>
              </section>
              <section className="bg-muted/30 flex min-h-0 flex-col p-4">
                <div className="preview-grid border-border flex min-h-0 flex-1 items-center justify-center rounded-lg border">
                  <div className="bg-background text-muted-foreground flex aspect-square w-64 items-center justify-center rounded-[22.37%] border text-sm shadow-sm">
                    Preview
                  </div>
                </div>
              </section>
            </div>
          </div>
        </WorkbenchContentArea>
      </Workbench>
    </WorkbenchProvider>
  );
}
