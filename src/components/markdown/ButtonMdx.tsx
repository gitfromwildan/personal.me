import React from "react";
import * as Icons from "lucide-react";
import Link from "next/link";

type ButtonProps = {
    icon?: keyof typeof Icons;
    text?: string;
    href: string;
    target?: "_blank" | "_self" | "_parent" | "_top";
    size?: "sm" | "md" | "lg";
    variation?: "primary" | "accent" | "outline";
};

const Button: React.FC<ButtonProps> = ({
    icon,
    text,
    href,
    target,
    size = "md",
    variation = "primary",
}) => {
    const baseStyles =
        "inline-flex items-center justify-center rounded font-medium focus:outline-none transition no-underline";

    const sizeStyles = {
        sm: "px-3 py-1 my-6 text-sm",
        md: "px-4 py-2 my-6 text-base",
        lg: "px-5 py-3 my-6 text-lg",
    };

    const variationStyles = {
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90",
        outline: "border border-primary text-primary hover:bg-primary/10",
    };

    const Icon = icon
        ? (Icons[icon] as React.FC<{ className?: string }>)
        : null;

    return (
        <Link
            href={href}
            target={target}
            rel={target === "_blank" ? "noopener noreferrer" : undefined}
            className={`${baseStyles} ${sizeStyles[size]} ${variationStyles[variation]}`}
        >
            {Icon && <Icon className="mr-2 h-5 w-5" />}
            {text && <span>{text}</span>}
        </Link>
    );
};

export default Button;
