import { ReactNode } from "react";

interface CarouselProps {
  children: ReactNode;
  className?: string;
}

export default function Carousel({ children, className = "" }: CarouselProps) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div className="flex space-x-6">
        {children}
      </div>
    </div>
  );
}
