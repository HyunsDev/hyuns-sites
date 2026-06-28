import type { ComponentPropsWithoutRef, ElementType } from "react";
import {
  AtSignIcon,
  BlocksIcon,
  BookOpenTextIcon,
  CameraIcon,
  CaptionsIcon,
  ChartSplineIcon,
  Code2Icon,
  ExternalLinkIcon,
  FolderClockIcon,
  FolderIcon,
  Globe2Icon,
  HomeIcon,
  HouseIcon,
  ImagePlusIcon,
  LinkIcon,
  MessageCircleIcon,
  NotebookTextIcon,
  PaletteIcon,
  TvMinimalPlayIcon,
  WrenchIcon
} from "lucide-react";
import { siInstagram, siThreads, siVelog, siYoutube } from "simple-icons";
import type { SimpleIcon } from "simple-icons";

type SvgIconProps = ComponentPropsWithoutRef<"svg">;

function createSimpleIcon(simpleIcon: SimpleIcon): ElementType {
  function SimplePortalIcon(props: SvgIconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
        focusable="false"
        {...props}
      >
        <path d={simpleIcon.path} />
      </svg>
    );
  }

  SimplePortalIcon.displayName = `${simpleIcon.title}Icon`;

  return SimplePortalIcon;
}

function normalizeIconName(name: string) {
  return name.toLowerCase().replaceAll(/[\s_-]/g, "");
}

const lucideIcons: Record<string, ElementType> = {
  AtSign: AtSignIcon,
  Blocks: BlocksIcon,
  BookOpenText: BookOpenTextIcon,
  Camera: CameraIcon,
  Captions: CaptionsIcon,
  ChartSpline: ChartSplineIcon,
  Code2: Code2Icon,
  ExternalLink: ExternalLinkIcon,
  Folder: FolderIcon,
  FolderClock: FolderClockIcon,
  Globe2: Globe2Icon,
  Home: HomeIcon,
  House: HouseIcon,
  ImagePlus: ImagePlusIcon,
  Link: LinkIcon,
  MessageCircle: MessageCircleIcon,
  NotebookText: NotebookTextIcon,
  Palette: PaletteIcon,
  TvMinimalPlay: TvMinimalPlayIcon,
  Wrench: WrenchIcon
};

const simpleIcons: Record<string, ElementType> = {
  instagram: createSimpleIcon(siInstagram),
  threads: createSimpleIcon(siThreads),
  velog: createSimpleIcon(siVelog),
  youtube: createSimpleIcon(siYoutube)
};

export function getPortalIcon(name?: string): ElementType | undefined {
  if (!name) {
    return undefined;
  }

  const simpleIconMatch = name.match(/^simple:(.+)$/i);
  const simpleIconName = simpleIconMatch?.[1] ?? name;

  return lucideIcons[name] ?? simpleIcons[normalizeIconName(simpleIconName)] ?? LinkIcon;
}
