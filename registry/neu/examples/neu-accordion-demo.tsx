"use client"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/neu/ui/neu/accordion"

export function NeuAccordionDemo() {
  return (
    <div className="neu-ground rounded-(--neu-radius) p-8">
      <Accordion type="single" collapsible defaultValue="item-1">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Does it cast shadows?</AccordionTrigger>
          <AccordionContent>
            No. Triggers and content sit flat on the ground; only the groove
            borders separate the items.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. The stock accordion height animation is untouched.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  )
}
