
import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PremiumFeatureProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  highlighted?: boolean;
}

const PremiumFeature: React.FC<PremiumFeatureProps> = ({
  title,
  description,
  icon,
  highlighted = false,
}) => {
  return (
    <Card
      className={`relative overflow-hidden transition-all duration-300 ${
        highlighted
          ? "bg-primary/5 border-primary/20 shadow-lg"
          : "bg-white hover:shadow-md"
      }`}
    >
      {highlighted && (
        <Badge className="absolute top-4 right-4 bg-primary text-white">
          Premium
        </Badge>
      )}
      <div className="p-6">
        <div
          className={`w-12 h-12 flex items-center justify-center rounded-lg mb-4 ${
            highlighted
              ? "bg-primary/10 text-primary"
              : "bg-secondary text-foreground/70"
          }`}
        >
          {icon}
        </div>
        <h3 className="text-lg font-medium mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <Button
          variant={highlighted ? "default" : "outline"}
          className={`w-full ${
            highlighted
              ? "bg-primary hover:bg-primary/90"
              : "text-primary hover:bg-primary/5 hover:text-primary hover:border-primary/30"
          }`}
        >
          {highlighted ? "Unlock Premium" : "Learn More"}
        </Button>
      </div>
    </Card>
  );
};

export default PremiumFeature;
