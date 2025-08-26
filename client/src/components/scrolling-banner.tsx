interface ScrollingBannerProps {
  items: Array<{
    icon: string;
    title: string;
    description: string;
  }>;
}

export default function ScrollingBanner({ items }: ScrollingBannerProps) {
  // Duplicate items for seamless scroll
  const duplicatedItems = [...items, ...items];

  return (
    <div className="relative overflow-hidden">
      <div className="flex space-x-6 scroll-banner">
        {duplicatedItems.map((item, index) => (
          <div 
            key={index} 
            className="flex-none w-80 bg-secondary rounded-lg p-6 hover-glow"
            data-testid={`program-card-${index}`}
          >
            <div className="text-3xl mb-4">{item.icon}</div>
            <h3 className="font-heading font-bold text-xl mb-2">{item.title}</h3>
            <p className="text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
