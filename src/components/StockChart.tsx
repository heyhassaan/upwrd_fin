import { useMemo } from "react";
import { motion } from "framer-motion";

interface StockChartProps {
  data: number[];
  isPositive: boolean;
  height?: number;
}

export const StockChart = ({ data, isPositive, height = 300 }: StockChartProps) => {
  const width = 800;
  const padding = { top: 20, right: 20, bottom: 30, left: 60 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const { pathD, areaPath, yTicks, xLabels } = useMemo(() => {
    if (data.length < 2) return { pathD: "", areaPath: "", yTicks: [], xLabels: [] };

    const min = Math.min(...data) * 0.995;
    const max = Math.max(...data) * 1.005;
    const range = max - min || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * chartWidth + padding.left;
      const y = chartHeight - ((value - min) / range) * chartHeight + padding.top;
      return { x, y, value };
    });

    const linePath = points.reduce((acc, point, index) => {
      if (index === 0) {
        return `M ${point.x} ${point.y}`;
      }
      return `${acc} L ${point.x} ${point.y}`;
    }, "");

    const area = `${linePath} L ${points[points.length - 1].x} ${chartHeight + padding.top} L ${padding.left} ${chartHeight + padding.top} Z`;

    // Generate Y-axis ticks
    const tickCount = 5;
    const yTicks = Array.from({ length: tickCount }, (_, i) => {
      const value = min + (range / (tickCount - 1)) * i;
      const y = chartHeight - ((value - min) / range) * chartHeight + padding.top;
      return { value, y };
    });

    // Generate X-axis labels
    const labelCount = 5;
    const xLabels = Array.from({ length: labelCount }, (_, i) => {
      const index = Math.floor((data.length - 1) * (i / (labelCount - 1)));
      const x = (index / (data.length - 1)) * chartWidth + padding.left;
      return { label: `Day ${index + 1}`, x };
    });

    return { pathD: linePath, areaPath: area, yTicks, xLabels };
  }, [data, chartWidth, chartHeight]);

  const gradientId = "chart-gradient";

  return (
    <div className="w-full overflow-x-auto">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full min-w-[600px]"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop
              offset="0%"
              stopColor={isPositive ? "hsl(145 80% 42%)" : "hsl(0 72% 55%)"}
              stopOpacity="0.4"
            />
            <stop
              offset="100%"
              stopColor={isPositive ? "hsl(145 80% 42%)" : "hsl(0 72% 55%)"}
              stopOpacity="0"
            />
          </linearGradient>
        </defs>

        {/* Grid lines */}
        {yTicks.map((tick, i) => (
          <line
            key={i}
            x1={padding.left}
            y1={tick.y}
            x2={width - padding.right}
            y2={tick.y}
            stroke="hsl(220 14% 16%)"
            strokeDasharray="4"
          />
        ))}

        {/* Y-axis labels */}
        {yTicks.map((tick, i) => (
          <text
            key={i}
            x={padding.left - 10}
            y={tick.y}
            textAnchor="end"
            dominantBaseline="middle"
            className="fill-muted-foreground text-xs"
          >
            {tick.value.toFixed(2)}
          </text>
        ))}

        {/* X-axis labels */}
        {xLabels.map((label, i) => (
          <text
            key={i}
            x={label.x}
            y={height - 5}
            textAnchor="middle"
            className="fill-muted-foreground text-xs"
          >
            {label.label}
          </text>
        ))}

        {/* Area fill */}
        <motion.path
          d={areaPath}
          fill={`url(#${gradientId})`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        />

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={isPositive ? "hsl(145 80% 42%)" : "hsl(0 72% 55%)"}
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
    </div>
  );
};
