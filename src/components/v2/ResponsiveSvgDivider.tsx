interface ResponsiveSvgDividerProps {
  src: string;
  width: number;
  height: number;
  className?: string;
}

const ResponsiveSvgDivider = ({
  src,
  width,
  height,
  className = "relative top-px block h-auto w-full",
}: ResponsiveSvgDividerProps) => (
  <svg
    aria-hidden="true"
    className={className}
    focusable="false"
    height={height}
    preserveAspectRatio="none"
    viewBox={`0 0 ${width} ${height}`}
    width={width}
    xmlns="http://www.w3.org/2000/svg"
  >
    <image
      href={src}
      height={height}
      preserveAspectRatio="none"
      width={width}
    />
  </svg>
);

export default ResponsiveSvgDivider;
