import * as AccordionPrimitive from "@radix-ui/react-accordion"
import { AccordionContent } from "./content";
import { AccordionTrigger } from "./trigger";
import { AccordionItem } from "./item";

const Accordion = AccordionPrimitive.Root;

AccordionItem.displayName = "AccordionItem"
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export {
    Accordion,
    AccordionItem,
    AccordionTrigger,
    AccordionContent
}
