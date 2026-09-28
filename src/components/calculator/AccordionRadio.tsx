import * as React from "react";

const radioInputClassName = `
  cursor-pointer appearance-none size-6 min-w-6 max-w-6 shrink-0 p-1 rounded-full
  border border-v2-magenta bg-v2-pink checked:bg-v2-magenta
  checked:ring-v2-magenta hover:ring-v2-magenta hover:bg-v2-magenta
  focus:ring focus:ring-v2-magenta focus:ring-offset-v2-pink
  focus:bg-v2-magenta focus:text-v2-magenta
  disabled:cursor-not-allowed disabled:hover:bg-v2-pink`;

interface AccordionRadioProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  checked: boolean;
}

export const AccordionRadio = ({
  checked,
  className,
  ...props
}: AccordionRadioProps) => (
  <input
    {...props}
    type="radio"
    checked={checked}
    style={
      checked
        ? {
            backgroundImage:
              "radial-gradient(circle, white 0 30%, transparent 31%)",
          }
        : undefined
    }
    className={`${radioInputClassName} ${className ?? ""}`}
  />
);
