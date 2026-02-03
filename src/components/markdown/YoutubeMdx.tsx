import React from "react";
import { cn } from "@/lib/utils";

interface YoutubeProps {
    videoId: string;
    className?: string;
}

const Youtube: React.FC<YoutubeProps> = ({ videoId, className }) => {
    return (
        <div
            className={cn(
                "relative w-full aspect-video rounded-lg overflow-hidden my-6",
                className
            )}
        >
            <iframe
                className="absolute inset-0 w-full h-full"
                src={`https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&showinfo=0&autohide=1&controls=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
            />
        </div>
    );
};

export default Youtube;
