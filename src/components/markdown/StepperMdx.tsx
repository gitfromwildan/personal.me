import { cn } from "@/lib/utils";
import { Children, PropsWithChildren } from "react";

export function Stepper({ children }: PropsWithChildren) {
    const length = Children.count(children);

    return (
        <div className="flex flex-col">
            {Children.map(children, (child, index) => {
                return (
                    <div
                        className={cn(
                            "border-l border-muted pl-9 ml-3 relative",
                            index < length - 1 && "pb-5"
                        )}
                    >
                        <div className="bg-muted text-muted-foreground w-8 h-8 text-xs font-medium rounded-md border border-border/50 flex items-center justify-center absolute -left-4 font-mono">
                            {index + 1}
                        </div>
                        {child}
                    </div>
                );
            })}
        </div>
    );
}

export function StepperItem({
    children,
    title,
}: PropsWithChildren & { title?: string }) {
    return (
        <div className="pt-0.5">
            <h4 className="mt-0">{title}</h4>
            <div>{children}</div>
        </div>
    );
}

export default Stepper;
