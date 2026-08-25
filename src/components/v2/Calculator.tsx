import { useState } from "react";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';
const fullConfig = resolveConfig(tailwindConfig);
const themeColors = fullConfig.theme.colors.v2;

const segments = [
  { label: "Very Low", color: themeColors.green },
  { label: "Low", color: themeColors.yellow },
  { label: "Medium", color: themeColors.magenta },
  { label: "High", color: themeColors.red },
  { label: "Very High", color: "black" },
];

const Calculator = ({ className }: { className?: string }) => {
  const [active, setActive] = useState(2);

  const segmentAngle = 180 / segments.length;

  // -90 = left, 0 = top, 90 = right
  const pointerAngle =
    -90 + segmentAngle / 2 + active * segmentAngle;

  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <div className="relative h-[237px] w-[530px] border-b-2 border-black mx-auto overflow-hidden">
        {/* Gauge */}
        <div
          className="relative left-0 h-[474px] w-[470px] overflow-hidden rounded-t-full mx-auto"
          style={{
            background: `
              conic-gradient(
                from 270deg,
                ${segments[0].color} 0deg ${segmentAngle}deg,
                ${segments[1].color} ${segmentAngle}deg ${segmentAngle * 2}deg,
                ${segments[2].color} ${segmentAngle * 2}deg ${segmentAngle * 3}deg,
                ${segments[3].color} ${segmentAngle * 3}deg ${segmentAngle * 4}deg,
                ${segments[4].color} ${segmentAngle * 4}deg 180deg,
                transparent 180deg 360deg
              )
            `,
          }}
        />
        {/* Pointer */}
        <div
          className="relative bottom-0 left-1/2 h-[172px] w-1 origin-bottom transition-transform duration-500 ease-out"
          style={{
            transform: `translateX(-50%) rotate(${pointerAngle}deg)`,
          }}
        >
          {/* Arrow head */}
          <div className="absolute left-1/2 -translate-x-1/2 border-x-[7px] border-b-[12px] border-x-transparent border-b-black" />
        </div>
        {/* Pivot */}
        <div className="absolute bottom-0 left-1/2 h-[75px] w-[75px] -translate-x-1/2 translate-y-1/2 rounded-t-full bg-black" />
      </div>
    </div>

  );
}

export default Calculator;
