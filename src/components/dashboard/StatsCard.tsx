
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconClassName?: string;
  onClick?: () => void;
}

const StatsCard = ({
  title,
  value,
  icon: Icon,
  iconClassName = "",
  onClick,
}: StatsCardProps) => {
  return (
    <div
      onClick={onClick}
      className={`p-4 border rounded-lg transition-colors ${
        onClick ? "cursor-pointer hover:bg-accent/50" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className={`p-2 rounded-lg ${iconClassName}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default StatsCard;
