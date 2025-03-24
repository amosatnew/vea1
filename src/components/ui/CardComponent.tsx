import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface CardComponentProps {
  id: string;
  type: 'event' | 'artist' | 'venue';
  title: string;
  subtitle?: string;
  description: string;
  image: string;
  tags: string[];
  price?: number;
  date?: string;
  location?: string;
}

export const CardComponent = ({
  id,
  type,
  title,
  subtitle,
  description,
  image,
  tags,
  price,
  date,
  location
}: CardComponentProps) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/${type}/${id}`);
  };

  // Format date if it exists
  const formattedDate = date ? new Date(date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }) : null;

  // Format time if date exists
  const formattedTime = date ? new Date(date).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  }) : null;

  return (
    <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:shadow-primary/20 hover:translate-y-[-5px] h-full flex flex-col">
      <div className="h-48 overflow-hidden">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
        />
      </div>
      <CardHeader className="p-4 pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl font-semibold text-white">{title}</CardTitle>
          {price && <Badge className="ml-2 bg-primary">${price}</Badge>}
        </div>
        {subtitle && (
          <CardDescription className="text-muted-foreground">{subtitle}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="p-4 pt-0 pb-2 flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        <div className="mt-3 space-y-2">
          {formattedDate && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary">📅</span>
              <span>{formattedDate} • {formattedTime}</span>
            </div>
          )}

          {location && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-primary">📍</span>
              <span>{location}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {tags.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{tags.length - 3}
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-2">
        <Button
          onClick={handleCardClick}
          variant="default"
          className="w-full"
        >
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CardComponent;
