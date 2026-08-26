import { useState } from "react";
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';
import { ChevronUp } from "lucide-react";
import { useTranslations } from "next-intl";

const fullConfig = resolveConfig(tailwindConfig);
const themeColors = fullConfig.theme.colors.v2;

const Calculator = ({ className, label }: { className?: string; label?: string }) => {
  const t = useTranslations("site.components.calculator");
  const segments = [
    { label: t("labels.neutral"), color: themeColors.green },
    { label: t("labels.low"), color: themeColors.yellow },
    { label: t("labels.medium"), color: themeColors.magenta },
    { label: t("labels.high"), color: themeColors.red },
    { label: t("labels.veryHigh"), color: "black" },
  ];

  const activeIndex = segments.findIndex(s => s.label === label);
  const isDynamic = activeIndex !== -1;
  
  // Default to 2 ("Medium") for the neutral/shaking state if no valid label is passed
  const active = isDynamic ? activeIndex : 2; 

  const segmentAngle = 180 / segments.length;

  // -90 = left, 0 = top, 90 = right
  const pointerAngle = -90 + segmentAngle / 2 + active * segmentAngle;

  return (
    <div className={`flex flex-col justify-center items-center ${className}`}>
      <style>
        {`
          @keyframes gaugeShake {
            0%, 100% { transform: rotate(0deg); }
            25% { transform: rotate(-3deg); }
            75% { transform: rotate(3deg); }
          }
        `}
      </style>
      {/* Removed overflow-hidden here so the labels don't get clipped */}
      <div className="relative h-[237px] w-[530px] border-b-2 border-black mx-auto">
        
        {/* Labels */}
        {segments.map((segment, index) => {
          const theta = 180 - (segmentAngle / 2 + index * segmentAngle);
          const radius = 245; // Radius of the gauge
          const x = Math.cos((theta * Math.PI) / 180) * radius;
          const y = Math.sin((theta * Math.PI) / 180) * radius;

          return (
            <div
              key={segment.label}
              className="absolute whitespace-nowrap z-20 font-bold px-3 py-1 text-sm uppercase -translate-x-1/2 translate-y-1/2"
              style={{
                left: `calc(50% + ${x}px)`,
                bottom: `${y-1}px`,
                backgroundColor: themeColors.blue,
                color: themeColors.pink,
              }}
            >
              {segment.label}
            </div>
          );
        })}

        {/* Gauge */}
        <div
          className="relative left-0 bottom-[2px] h-[474px] w-[470px] overflow-hidden rounded-t-full mx-auto"
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

        {/* Pointer Main Wrapper (handles the target rotation) */}
        <div
          className="absolute bottom-0 left-1/2 h-[172px] w-1 origin-bottom transition-transform duration-700 ease-out z-10"
          style={{
            transform: `translateX(-50%) rotate(${isDynamic ? pointerAngle : 0}deg)`,
          }}
        >
          {/* Pointer Inner Wrapper (handles the shaking animation independently) */}
          <div 
            className="relative h-full w-full origin-bottom"
            style={{
              animation: !isDynamic ? 'gaugeShake 0.4s infinite alternate ease-in-out' : 'none'
            }}
          >
            {/* Arrow head */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-black" style={{ height: 'calc(100% + 28px)' }}>
              <ChevronUp className="h-20 w-20" strokeWidth={3} />
            </div>
            {/* Arrow body */}
            <div 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 bg-black h-full" 
            />
          </div>
        </div>

        {/* Pivot (Height halved and Y-translation removed to stay within the visible boundary) */}
        <div className="absolute bottom-0 left-1/2 h-[37.5px] w-[75px] -translate-x-1/2 rounded-t-full bg-black z-20" />
      </div>
    </div>
  );
}

export default Calculator;