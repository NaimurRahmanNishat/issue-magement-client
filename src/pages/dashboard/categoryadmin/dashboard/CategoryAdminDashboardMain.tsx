import Loading from "@/components/shared/Loading";
import { useGetCategoryAdminStatsQuery, type MonthlyIssue } from "@/redux/features/stats/statsApi";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Legend,
  Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid
} from 'recharts';

const CategoryAdminDashboardMain = () => {
  
  const {
    data: categoryadminData,
    isLoading,
    error
  } = useGetCategoryAdminStatsQuery();

  // FIXED fallback
  const stats = categoryadminData?.data || {
    category: "",
    totalIssues: 0,
    pendingIssues: 0,
    inProgressIssues: 0,
    solvedIssues: 0,
    monthlyPostIssue:[] as MonthlyIssue[],
  };

  // Pie Chart
  const pieData = [
    { name: "Pending", value: stats.pendingIssues, color: "#f59e0b" },
    { name: "In Progress", value: stats.inProgressIssues, color: "#3b82f6" },
    { name: "Solved", value: stats.solvedIssues, color: "#10b981" }
  ].filter(item => item.value > 0);

  // Line Chart
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

  const lineData = stats.monthlyPostIssue.map(item => ({
    month: monthNames[item.month - 1],
    issues: item.count
  }));

  // Stats Cards
  const statsCards = [
    { label: "Total Issues", value: stats.totalIssues, color: "bg-blue-500", icon: "📊" },
    { label: "Pending", value: stats.pendingIssues, color: "bg-amber-500", icon: "⏳" },
    { label: "In Progress", value: stats.inProgressIssues, color: "bg-blue-600", icon: "🔄" },
    { label: "Solved", value: stats.solvedIssues, color: "bg-green-500", icon: "✅" },
  ];

  
  if (isLoading) return <Loading />;
  if (error) return <div>Failed to fetch data</div>;

  return (
    <div className="min-h-screen py-6">
      <div className="">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Category Admin Dashboard</h1>
          <p className="text-gray-600">
            Category: <span className="font-semibold capitalize">{stats.category}</span>
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statsCards.map((card, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">{card.label}</p>
                  <p className="text-3xl font-bold text-gray-800 mt-2">{card.value}</p>
                </div>
                <div className={`${card.color} w-12 h-12 rounded-full flex items-center justify-center text-2xl`}>
                  {card.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Pie Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Issue Status Distribution</h2>

            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>`${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>

                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[300px] flex items-center justify-center text-gray-500">No data available</div>
            )}
          </div>

          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Monthly Issue Trends (2025)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={lineData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="issues" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CategoryAdminDashboardMain;
