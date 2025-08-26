import { Music } from "lucide-react";

export default function AnimatedLogo() {
  return (
    <div className="w-32 h-32 mx-auto landing-logo bg-accent rounded-full flex items-center justify-center">
      <Music className="w-12 h-12 text-accent-foreground" />
    </div>
  );
}
