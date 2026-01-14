import { FC, ReactNode } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LabelList, Legend } from 'recharts';
import { LucideIcon } from 'lucide-react';

// --- Colors ---
// Fybeca Brand Colors: Dark Blue (#00338D) and Red (#E30613)
export const COLORS = ['#00338D', '#E30613', '#2563EB', '#EF4444', '#1E40AF', '#B91C1C'];

// --- Stat Card ---
interface StatCardProps {
    icon: LucideIcon;
    label: string;
    value: string | number;
    color: string;
}

export const StatCard: FC<StatCardProps> = ({ icon: Icon, label, value, color }) => (
    <div className={`${color} p-4 rounded-lg flex items-center justify-between shadow-md`}>
        <div>
            <div className="text-2xl font-bold text-gray-800">{value}</div>
            <div className="text-sm text-gray-600">{label}</div>
        </div>
        <Icon className="w-10 h-10 text-gray-600 opacity-50" />
    </div>
);

// --- Donut Chart ---
interface DonutChartProps {
    data: { name: string; value: number; percent?: number }[];
    title: string;
    icon: LucideIcon;
    total: number;
}

export const DonutChart: FC<DonutChartProps> = ({ data, title, icon: Icon, total }) => (
    <div className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl shadow-md flex flex-col items-center border border-blue-100">
        <div className="flex items-center mb-4 self-start">
            <Icon className="w-6 h-6 text-blue-900 mr-2" />
            <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <div className="w-full flex items-center justify-between">
            <div className="w-32 h-32 relative">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            cx="50%"
                            cy="50%"
                            innerRadius={35}
                            outerRadius={55}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {data.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex-1 ml-4 min-w-0">
                <div className="text-3xl font-bold text-gray-800 mb-1">{total}</div>
                <div className="text-xs text-gray-500 mb-3">Total</div>
                {data.map((item, idx) => (
                    <div key={idx} className="flex items-center text-xs mb-1">
                        <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }}></div>
                        <span className="text-gray-700 truncate">{item.name}: </span>
                        <span className="font-semibold ml-1">{item.percent ? Number(item.percent).toFixed(1) : ((item.value / total) * 100).toFixed(1)}%</span>
                    </div>
                ))}
            </div>
        </div>
    </div>
);

// --- Horizontal Bar Chart ---
interface CustomBarChartProps {
    data: any[];
    xKey: string;
    yKey: string;
    title: string;
    icon: ReactNode;
    color?: string;
}

export const CustomBarChart: FC<CustomBarChartProps> = ({ data, xKey, yKey, title, icon, color = "#00338D" }) => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full border border-gray-100">
        <div className="flex items-center mb-4">
            <div className="mr-3">
                {icon}
            </div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <ResponsiveContainer width="100%" height={250}>
            <RechartsBarChart data={data} layout="vertical" margin={{ top: 5, right: 40, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                <XAxis type="number" hide />
                <YAxis dataKey={yKey} type="category" width={100} tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey={xKey} fill={color} radius={[0, 4, 4, 0]}>
                    <LabelList
                        dataKey="percent"
                        position="right"
                        formatter={(val: number) => `${val?.toFixed(1)}%`}
                        style={{ fill: '#4B5563', fontSize: '11px', fontWeight: 'bold' }}
                    />
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    </div>
);

// --- Vertical Bar Chart (Column Chart) ---
export const VerticalBarChart: FC<CustomBarChartProps> = ({ data, xKey, yKey, title, icon, color = "#00338D" }) => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full border border-gray-100">
        <div className="flex items-center mb-4">
            <div className="mr-3">
                {icon}
            </div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={xKey} tick={{ fontSize: 11 }} interval={0} angle={-30} textAnchor="end" height={60} />
                <YAxis />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey={yKey} fill={color} radius={[4, 4, 0, 0]}>
                    <LabelList
                        dataKey="percent"
                        position="top"
                        formatter={(val: number) => `${val?.toFixed(1)}%`}
                        style={{ fill: '#4B5563', fontSize: '11px', fontWeight: 'bold' }}
                    />
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    </div>
);
// --- Grouped Bar Chart ---
interface GroupedBarChartProps {
    data: any[];
    xKey: string;
    series1Key: string;
    series2Key: string;
    title: string;
    icon: ReactNode;
    colors?: [string, string];
}

export const GroupedBarChart: FC<GroupedBarChartProps> = ({ data, xKey, series1Key, series2Key, title, icon, colors = ["#00338D", "#E30613"] }) => (
    <div className="bg-white p-6 rounded-xl shadow-md h-full border border-gray-100">
        <div className="flex items-center mb-4">
            <div className="mr-3">
                {icon}
            </div>
            <h3 className="font-semibold text-gray-800">{title}</h3>
        </div>
        <ResponsiveContainer width="100%" height={350}>
            <RechartsBarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={xKey} tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar dataKey={series1Key} fill={colors[0]} radius={[4, 4, 0, 0]} name="Quito">
                    <LabelList
                        dataKey={series1Key}
                        position="top"
                        formatter={(val: number) => `${val?.toFixed(0)}%`}
                        style={{ fill: '#4B5563', fontSize: '10px', fontWeight: 'bold' }}
                    />
                </Bar>
                <Bar dataKey={series2Key} fill={colors[1]} radius={[4, 4, 0, 0]} name="Guayaquil">
                    <LabelList
                        dataKey={series2Key}
                        position="top"
                        formatter={(val: number) => `${val?.toFixed(0)}%`}
                        style={{ fill: '#4B5563', fontSize: '10px', fontWeight: 'bold' }}
                    />
                </Bar>
            </RechartsBarChart>
        </ResponsiveContainer>
    </div>
);
