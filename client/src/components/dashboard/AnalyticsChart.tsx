import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface Props {
  title: string;
  data: Array<Record<string, unknown>>;
  keys: string[];
  colors: string[];
  suffix: string;
}

const toId = (value: string) =>
  value.toLowerCase().replace(/[^a-z0-9]+/g, "-");

export default function AnalyticsChart({
  title,
  data,
  keys,
  colors,
  suffix,
}: Props) {
  const chartId = toId(title);

  return (
    <div className="panel chart-panel">
      <div className="panel-header">
        <h3>{title}</h3>
        <span>•••</span>
      </div>

      <div className="chart">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              {keys.map((key, index) => (
                <linearGradient
                  key={key}
                  id={`${chartId}-${key}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="0%"
                    stopColor={colors[index]}
                    stopOpacity={0.25}
                  />
                  <stop
                    offset="100%"
                    stopColor={colors[index]}
                    stopOpacity={0}
                  />
                </linearGradient>
              ))}
            </defs>

            <CartesianGrid
              stroke="var(--chart-grid)"
              vertical={false}
            />

            <XAxis
              dataKey="label"
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              minTickGap={28}
            />

            <YAxis
              tick={{ fill: "var(--muted)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={34}
            />

            <Tooltip
              contentStyle={{
                background: "var(--panel-strong)",
                border: "1px solid var(--border)",
                borderRadius: 10,
                color: "var(--text)",
              }}
            />

            {keys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index]}
                fill={`url(#${chartId}-${key})`}
                strokeWidth={2}
                dot={false}
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="legend">
        {keys.map((key, index) => (
          <span key={key}>
            <i style={{ background: colors[index] }} /> {key}
          </span>
        ))}
      </div>
    </div>
  );
}
