import { useMemo } from "react";
import { useAppSelector } from "../store/hooks";
import { Card } from "../components/ui";
import { Package, Boxes, CheckCircle, AlertCircle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import type { Part } from "../types";

export const Dashboard = () => {
  const parts = useAppSelector((state) => state.parts.parts);
  const assets = useAppSelector((state) => state.assets.assets);
  const utilizations = useAppSelector(
    (state) => state.utilization.utilizations
  );

  const statistics = useMemo(() => {
    const totalParts = parts.length;
    const totalAssets = assets.length;
    const assignedAssets = assets.filter((a) => a.status === "assigned").length;
    const availableAssets = assets.filter(
      (a) => a.status === "available"
    ).length;
    const maintenanceAssets = assets.filter(
      (a) => a.status === "maintenance"
    ).length;
    const utilizationRate =
      totalAssets > 0 ? Math.round((assignedAssets / totalAssets) * 100) : 0;

    return {
      totalParts,
      totalAssets,
      assignedAssets,
      availableAssets,
      maintenanceAssets,
      utilizationRate,
    };
  }, [parts, assets]);

  const frequentlyUsedParts = useMemo(() => {
    const partUsageMap = new Map<string, { part: Part; count: number }>();

    assets.forEach((asset) => {
      const part = parts.find((p) => p.id === asset.partId);
      if (part) {
        const existing = partUsageMap.get(part.id);
        if (existing) {
          existing.count += 1;
        } else {
          partUsageMap.set(part.id, { part, count: 1 });
        }
      }
    });

    return Array.from(partUsageMap.values())
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => ({
        name: item.part.name,
        count: item.count,
      }));
  }, [parts, assets]);

  const assetStatusData = [
    { name: "Available", value: statistics.availableAssets, color: "#10b981" },
    { name: "Assigned", value: statistics.assignedAssets, color: "#f59e0b" },
    {
      name: "Maintenance",
      value: statistics.maintenanceAssets,
      color: "#ef4444",
    },
  ];

  const recentUtilizations = useMemo(() => {
    return [...utilizations]
      .sort(
        (a, b) =>
          new Date(b.assignedDate).getTime() -
          new Date(a.assignedDate).getTime()
      )
      .slice(0, 5);
  }, [utilizations]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-600 mt-1">
          Overview of asset management system
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="!p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Parts</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {statistics.totalParts}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Package className="text-blue-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="!p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Total Assets</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {statistics.totalAssets}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Boxes className="text-purple-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="!p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">Available</p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {statistics.availableAssets}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="text-green-600" size={24} />
            </div>
          </div>
        </Card>

        <Card className="!p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-slate-600 font-medium">
                Utilization Rate
              </p>
              <p className="text-3xl font-bold text-slate-900 mt-2">
                {statistics.utilizationRate}%
              </p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-lg">
              <AlertCircle className="text-yellow-600" size={24} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Frequently Used Parts">
          {frequentlyUsedParts.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={frequentlyUsedParts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No usage data available
            </div>
          )}
        </Card>

        <Card title="Asset Status Distribution">
          {statistics.totalAssets > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={assetStatusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name}: ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {assetStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-slate-500">
              No assets available
            </div>
          )}
        </Card>
      </div>

      <Card title="Recent Activity">
        {recentUtilizations.length > 0 ? (
          <div className="space-y-3">
            {recentUtilizations.map((util) => {
              const asset = assets.find((a) => a.id === util.assetId);
              const part = asset
                ? parts.find((p) => p.id === asset.partId)
                : null;

              return (
                <div
                  key={util.id}
                  className="flex items-center justify-between p-3 bg-slate-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-slate-900">
                      {part?.name || "Unknown Part"} -{" "}
                      {asset?.serialNumber || "N/A"}
                    </p>
                    <p className="text-sm text-slate-600">
                      Assigned on{" "}
                      {new Date(util.assignedDate).toLocaleDateString()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      util.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    {util.status}
                  </span>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-slate-500 text-center py-8">No recent activity</p>
        )}
      </Card>
    </div>
  );
};
