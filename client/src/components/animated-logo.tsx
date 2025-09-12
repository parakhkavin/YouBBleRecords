import logoImage from "../assets/youbble-logo.jpg";

export default function AnimatedLogo() {
  return (
    <div className="w-32 h-32 mx-auto landing-logo flex items-center justify-center">
      <img 
        src={logoImage} 
        alt="YouBBle Records Logo" 
        className="w-full h-full object-cover rounded-full"
      />
    </div>
  );
}
