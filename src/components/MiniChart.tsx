import { useMemo } from "react";
import { motion } from "framer-motion";

interface MiniChartProps {
  data: number[];
  isPositive: boolean;
  width?: number;
  height?: number;
}

export const MiniChart = ({
  data,
  isPositive,
  width = 100,
  height = 40,
}: MiniChartProps) => {
  const pathD = useMemo(() => {
    if (data.length < 2) return "";

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * (height - 4) - 2;
      return { x, y };
    });

    const path = points.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${acc} L ${point.x} ${point.y}`;
    }, "");

    return path;
  }, [data, width, height]);

  const areaPath = useMemo(() => {
    if (data.length < 2) return "";
    return `${pathD} L ${width} ${height} L 0 ${height} Z`;
  }, [pathD, width, height]);

  const gradientId = useMemo(
    () => `gradient-${Math.random().toString(36).substring(7)}`,
    []
  );

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="overflow-visible"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop
            offset="0%"
            stopColor={isPositive ? "hsl(145 80% 42%)" : "hsl(0 72% 55%)"}
            stopOpacity="0.3"
          />
          <stop
            offset="100%"
            stopColor={isPositive ? "hsl(145 80% 42%)" : "hsl(0 72% 55%)"}
            stopOpacity="0"
          />
        </linearGradient>
      </defs>
      <motion.path
        d={areaPath}
        fill={`url(#${gradientId})`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
      <motion.path
        d={pathD}
        fill="none"
        stroke={isPositive ? "hsl(145 80% 42%)" : "hsl(0 72% 55%)"}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
    </svg>
  );
};
