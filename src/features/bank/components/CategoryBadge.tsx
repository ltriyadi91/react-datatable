import { Badge } from "@mantine/core";
import { getCategoryColor } from "@/utils/dataUtils";

interface CategoryBadgeProps {
  category: string;
}

export function CategoryBadge({ category }: CategoryBadgeProps) {
  return (
    <Badge
      color={getCategoryColor(category)}
      variant="light"
      size="md"
      radius="sm"
    >
      {category}
    </Badge>
  );
}
