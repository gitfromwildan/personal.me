"use client";

import { createContext } from "react";

interface AccordionGroupContextType {
    inGroup: boolean;
}

export const AccordionGroupContext = createContext<AccordionGroupContextType | null>(null);
