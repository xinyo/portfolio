import { Check } from "lucide-react";

import { factoryAvatarOptions } from "@/apps/factory/store";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type FactoryAvatarPickerProps = {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  ariaLabelPrefix: string;
};

export function FactoryAvatarPicker({
  value,
  onChange,
  ariaLabel,
  ariaLabelPrefix,
}: FactoryAvatarPickerProps) {
  return (
    <div className="factory-avatar-picker" role="radiogroup" aria-label={ariaLabel}>
      {factoryAvatarOptions.map((avatar) => {
        const isSelected = avatar.src === value || avatar.path === value;

        return (
          <button
            key={avatar.path}
            type="button"
            className="factory-avatar-picker-option"
            aria-label={`${ariaLabelPrefix} ${avatar.id}`}
            aria-checked={isSelected}
            data-selected={isSelected}
            role="radio"
            onClick={() => onChange(avatar.src)}
          >
            <Avatar className="factory-contact-avatar">
              <AvatarImage src={avatar.src} alt="" />
              <AvatarFallback>{avatar.id}</AvatarFallback>
            </Avatar>
            {isSelected && <Check className="factory-avatar-picker-check" />}
          </button>
        );
      })}
    </div>
  );
}
