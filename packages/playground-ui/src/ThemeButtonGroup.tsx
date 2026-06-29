import { MonitorIcon, MoonIcon, SunIcon } from "lucide-react"

import { useTheme } from "@hyunsdev/ui/components/theme-provider"
import { ToggleGroup, ToggleGroupItem } from "@hyunsdev/ui/components/toggle-group"
import { isThemeMode } from "@hyunsdev/ui/lib/theme"

export function ThemeButtonGroup() {
  const { theme, setTheme } = useTheme()
  const handleValueChange = (value: string) => {
    if (isThemeMode(value)) {
      setTheme(value)
    }
  }

  return (
    <ToggleGroup
      type="single"
      className="bg-transparent"
      aria-label="Theme selector"
      value={theme}
      size="sm"
      onValueChange={handleValueChange}
    >
      <ToggleGroupItem value="light">
        <SunIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="dark">
        <MoonIcon />
      </ToggleGroupItem>
      <ToggleGroupItem value="system">
        <MonitorIcon />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}
