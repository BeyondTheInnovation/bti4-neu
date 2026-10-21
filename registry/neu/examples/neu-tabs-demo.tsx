"use client"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/neu/ui/neu/tabs"

export function NeuTabsDemo() {
  return (
    <div className="neu-ground rounded-(--neu-radius) p-8">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="text-sm">
          The active tab rides a raised key that slides along the carved tray.
        </TabsContent>
        <TabsContent value="password" className="text-sm">
          Idle tabs stay flat on the tray.
        </TabsContent>
        <TabsContent value="billing" className="text-sm">
          Arrow keys move between tabs.
        </TabsContent>
      </Tabs>
    </div>
  )
}
