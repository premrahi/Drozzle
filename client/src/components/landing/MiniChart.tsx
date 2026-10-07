import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export default function MiniChart({ title, data, keyName }: { title: string; data: Array<Record<string, number | string>>; keyName: string }) {
  const color = keyName === "mem" ? "#a855f7" : "#1da1ff";
  return (
    <div className="mini-chart">
      <h4>{title}</h4>
      <ResponsiveContainer width="100%" height="82%">
        <AreaChart data={data}>
          <defs><linearGradient id={`preview-${keyName}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.24} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
          <CartesianGrid stroke="rgba(255,255,255,.06)" vertical={false} />
          <XAxis dataKey="label" hide /><YAxis hide />
          <Area type="monotone" dataKey={keyName} stroke={color} fill={`url(#preview-${keyName})`} strokeWidth={2} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
