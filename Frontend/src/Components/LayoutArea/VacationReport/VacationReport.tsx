import { useSelector } from "react-redux";
import { AppState } from "../../../Redux/Store";
import { VacationModel } from "../../../Models/VacationModel";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell
} from "recharts";
import "./VacationReport.css";

export function VacationReport(): JSX.Element {

    document.title = "Vacations Report | Levana Vacations";

    const vacations = useSelector((state: AppState) => state.vacations);
    const likes = useSelector((state: AppState) => state.likes);

    const reportData = vacations.map((v: VacationModel) => ({
        destination: v.destination,
        likesCount: likes[v._id]?.count || 0
    }));

    const totalLikes = reportData.reduce((sum, v) => sum + v.likesCount, 0);

    const maxLikes = Math.max(...reportData.map(r => r.likesCount));
    const topDestination = reportData.find(r => r.likesCount === maxLikes)?.destination;

    const getColor = (count: number): string => {
        if (count >= 12) return "#6366f1";   
        if (count >= 6) return "#8b5cf6";    
        if (count >= 3) return "#c4b5fd";    
        return "#ede9fe";                    
    };

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload?.length) {
            const { destination, likesCount } = payload[0].payload;
            const percent = totalLikes > 0 ? ((likesCount / totalLikes) * 100).toFixed(1) : "0";
            const isTop = destination === topDestination;
            return (
                <div className="custom-tooltip bg-white p-3 border rounded shadow-sm text-sm">
                    <div>
                        <strong>{destination} {isTop && "🔥"}</strong>
                    </div>
                    <div>{likesCount} Likes ({percent}%)</div>
                </div>
            );
        }
        return null;
    };

    const handleDownloadCSV = () => {
        const header = "Destination,Likes";
        const rows = reportData.map(r => `${r.destination},${r.likesCount}`);
        const csvContent = [header, ...rows].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "vacation-likes-report.csv");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="VacationReport container mx-auto px-4 py-12">
            <h1 className="text-4xl font-semibold text-center text-gray-800 mb-10">
                Vacations Report
            </h1>
            <div className="text-center mb-6">
                <button className="download-csv-btn" onClick={handleDownloadCSV}>
                    ⬇️ Download CSV
                </button>
            </div>

            <ResponsiveContainer width="100%" height={450}>
                <BarChart
                    data={reportData}
                    margin={{ top: 10, right: 30, left: 20, bottom: 70 }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                        dataKey="destination"
                        angle={-30}
                        textAnchor="end"
                        interval={0}
                        height={80}
                        tick={{ fontSize: 12 }}
                    />
                    <YAxis allowDecimals={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="likesCount" radius={[10, 10, 0, 0]}>
                        {reportData.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getColor(entry.likesCount)}
                            />
                        ))}
                    </Bar>
                </BarChart>

            </ResponsiveContainer>
        </div>
    );
}
