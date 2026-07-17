import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";

export const RevenueChart = ({ data }) => {
    return (
        <div className="w-full h-[420px]">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={data}
                    margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />

                    <XAxis dataKey="months" />

                    <YAxis
                        yAxisId="left"
                        tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`}
                    />

                    <YAxis
                        yAxisId="right"
                        orientation="right"
                        allowDecimals={false}
                    />

                    <Tooltip
                        formatter={(value, name) =>
                            name === "revenue"
                                ? [`₹${Number(value).toLocaleString("en-IN")}`, "Revenue"]
                                : [value, "Orders"]
                        }
                    />

                    <Legend />

                    <Line
                        yAxisId="left"
                        type="monotone"
                        dataKey="revenue"
                        stroke="#3b82f6"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />

                    <Line
                        yAxisId="right"
                        type="monotone"
                        dataKey="orders"
                        stroke="#22c55e"
                        strokeWidth={3}
                        dot={{ r: 4 }}
                        activeDot={{ r: 6 }}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};