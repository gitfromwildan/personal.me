"use client";

import React, { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { AccordionGroupContext } from "@/components/contexts/AccordionContext";

interface AccordionGroupProps {
    children: ReactNode;
    className?: string;
}

const AccordionGroup: React.FC<AccordionGroupProps> = ({
    children,
    className,
}) => {
    return (
        <AccordionGroupContext.Provider value={{ inGroup: true }}>
            <div className={cn("border rounded-lg overflow-hidden", className)}>
                {children}
            </div>
        </AccordionGroupContext.Provider>
    );
};

export default AccordionGroup;
