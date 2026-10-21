"use client"

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/registry/neu/ui/neu/navigation-menu"

export function NeuNavigationMenuDemo() {
  return (
    <div className="neu-ground flex min-h-96 flex-col items-start rounded-(--neu-radius) p-4 sm:p-8">
      <NavigationMenu className="max-w-full flex-none">
        <NavigationMenuList className="flex-wrap">
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-75 gap-1">
                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Introduction</div>
                    <div className="text-(--neu-text-muted)">
                      One surface token, everything derived.
                    </div>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">
                    <div className="font-medium">Installation</div>
                    <div className="text-(--neu-text-muted)">
                      Add the theme, then pull components.
                    </div>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-50 gap-1">
                <li>
                  <NavigationMenuLink href="#">Button</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">Tabs</NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink href="#">Select</NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuLink
              href="#"
              className={navigationMenuTriggerStyle()}
            >
              Docs
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  )
}
