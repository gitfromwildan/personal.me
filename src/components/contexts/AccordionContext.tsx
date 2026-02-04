"use client";

import { createContext } from "react";

interface AccordionGroupContextType {
    inGroup: boolean;
    activeId: string | null;
    setActiveId: (id: string | null) => void;
}

export const AccordionGroupContext = createContext<AccordionGroupContextType>({
    inGroup: false,
    activeId: null,
    setActiveId: () => { },
});
