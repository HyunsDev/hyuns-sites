import type { ElementType } from "react";
import {
  AtSignIcon,
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
  LinkIcon,
  MessageCircleIcon,
  NotebookTextIcon,
  TvMinimalPlayIcon,
  WrenchIcon
} from "lucide-react";

const icons: Record<string, ElementType> = {
  AtSign: AtSignIcon,
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
  Link: LinkIcon,
  MessageCircle: MessageCircleIcon,
  NotebookText: NotebookTextIcon,
  TvMinimalPlay: TvMinimalPlayIcon,
  Wrench: WrenchIcon
};

export function getPortalIcon(name?: string): ElementType {
  if (!name) {
    return LinkIcon;
  }

  return icons[name] ?? LinkIcon;
}
