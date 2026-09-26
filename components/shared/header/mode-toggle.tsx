"use client"

import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useSyncExternalStore } from "react"
import { Button } from "@/components/ui/button"
import { MoonIcon, SunIcon, SunMoon } from "lucide-react"
import { useTheme } from "next-themes"

const ModeToggle = () => {
  const { theme, setTheme } = useTheme()
  const emptySubscribe = () => () => {}

  const isMounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  )

  if (!isMounted) {
    return null
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            className="focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        }
      >
        {theme === "system" ? (
          <SunMoon />
        ) : theme === "dark" ? (
          <MoonIcon />
        ) : (
          <SunIcon />
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuCheckboxItem
          checked={theme === "system"}
          onClick={() => setTheme("system")}
        >
          System
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "dark"}
          onClick={() => setTheme("dark")}
        >
          Dark
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem
          checked={theme === "light"}
          onClick={() => setTheme("light")}
        >
          Light
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ModeToggle
