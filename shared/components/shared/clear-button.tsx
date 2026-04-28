import { X } from "lucide-react";

interface Props {
  className?: string;
  onClick?: () => void;
}

export const ClearButton: React.FC<Props> = ({ className, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30 hover:opacity-100 cursor-pointer"
    >
      <X className="h-5 w-5" />
    </button>
  );
};
