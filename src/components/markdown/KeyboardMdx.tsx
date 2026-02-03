import React from "react";

const macKeyMap: Record<string, string> = {
    command: "⌘",
    cmd: "⌘",
    option: "⌥",
    alt: "⌥",
    shift: "⇧",
    ctrl: "⌃",
    control: "⌃",
    tab: "⇥",
    caps: "⇪",
    enter: "⏎",
    return: "⏎",
    delete: "⌫",
    escape: "⎋",
    esc: "⎋",
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
    space: "␣",
};

const windowsKeyMap: Record<string, string> = {
    command: "Win",
    cmd: "Win",
    option: "Alt",
    alt: "Alt",
    ctrl: "Ctrl",
    control: "Ctrl",
    delete: "Del",
    escape: "Esc",
    esc: "Esc",
    enter: "Enter",
    return: "Enter",
    tab: "Tab",
    caps: "Caps",
    shift: "Shift",
    space: "Space",
    up: "↑",
    down: "↓",
    left: "←",
    right: "→",
};

export interface KbdProps extends React.HTMLAttributes<HTMLElement> {
    show?: string;
    type?: "window" | "mac";
    children?: React.ReactNode;
}

const KbdComponent: React.FC<KbdProps> = ({
    show: keyProp,
    type = "window",
    children,
    ...props
}) => {
    const getKeyDisplay = (): React.ReactNode => {
        if (!keyProp || typeof keyProp !== "string") return null;

        const lowerKey = keyProp.toLowerCase();

        if (type === "mac") {
            return macKeyMap[lowerKey] || keyProp;
        }

        return (
            windowsKeyMap[lowerKey] ||
            keyProp.charAt(0).toUpperCase() + keyProp.slice(1)
        );
    };

    const renderContent = () => {
        if (children !== undefined && children !== null && children !== "") {
            return children;
        }
        return getKeyDisplay() || keyProp || "";
    };

    return (
        <kbd
            className="inline-flex items-center justify-center px-2 py-1 mx-0.5 text-xs font-mono font-medium text-foreground bg-secondary/70 border rounded-md"
            {...props}
        >
            {renderContent()}
        </kbd>
    );
};

export const Kbd = KbdComponent;
export default KbdComponent;
