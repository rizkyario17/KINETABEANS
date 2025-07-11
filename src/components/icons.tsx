import { Wallet } from "lucide-react";

export function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <div className="flex items-center gap-2" {...props}>
      <Wallet className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold text-primary font-headline">InventoryKU</span>
    </div>
  );
}
