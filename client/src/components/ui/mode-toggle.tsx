"use client"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"


export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="mx-2">
        <Button size="icon" className="md:flex hidden" onClick={theme === 'light' ? ()=>setTheme('dark') : ()=>setTheme('light')}>
           <Sun className=" rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute top-[22px]  rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
    </div>
  )
}
