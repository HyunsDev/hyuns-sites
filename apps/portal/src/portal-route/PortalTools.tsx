import { useSyncExternalStore } from "react";
import { Link, useCanGoBack, useRouter } from "@tanstack/react-router";
import { ArrowLeftIcon, ArrowRightIcon, HomeIcon } from "lucide-react";
import { Button } from "@hyunsdev/ui/components/button";
import { ButtonGroup } from "@hyunsdev/ui/components/button-group";
import { AccentSelector } from "./AccentSelector";
import { ThemeButtonGroup } from "./ThemeButtonGroup";

type RouterStateWithIndex = {
  __TSR_index?: number;
};

export function PortalTools() {
  const router = useRouter();
  const canGoBack = useCanGoBack();
  const canGoForward = useSyncExternalStore(
    router.history.subscribe,
    () => {
      const state = router.history.location.state as RouterStateWithIndex;

      return (state.__TSR_index ?? 0) < router.history.length - 1;
    }
  );

  return (
    <div className="flex flex-wrap items-center justify-center gap-2 px-2">
      <ButtonGroup>
        <Button
          size="icon-sm"
          aria-label="뒤로"
          onClick={() => router.history.back()}
          disabled={!canGoBack}
        >
          <ArrowLeftIcon />
        </Button>
        <Button size="icon-sm" aria-label="홈" asChild>
          <Link to="/">
            <HomeIcon />
          </Link>
        </Button>
        <Button
          size="icon-sm"
          aria-label="앞으로"
          onClick={() => router.history.forward()}
          disabled={!canGoForward}
        >
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
      <AccentSelector />
      <ThemeButtonGroup />
    </div>
  );
}
