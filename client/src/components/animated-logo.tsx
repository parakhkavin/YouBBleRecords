import logoImage from "../assets/youbble-logo-main.png";

export default function AnimatedLogo() {
  return (
    <div className="w-40 h-40 mx-auto landing-logo flex items-center justify-center">
      <img 
        src={logoImage} 
        alt="YouBBle Records Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
}
