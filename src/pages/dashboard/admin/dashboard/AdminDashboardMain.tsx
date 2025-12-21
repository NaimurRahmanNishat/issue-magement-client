import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import adminMan from "../../../../assets/man-with-laptop.png";
import Chartar from "./Chartar";
import Loading from "@/components/shared/Loading";
import {
  useGetAdminStatsQuery
} from "@/redux/features/stats/statsApi";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AuroraText } from "@/components/ui/aurora-text";
import LineChartPage from "./LineChartPage";
import { motion } from "framer-motion";

const AdminDashboardMain = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const { data: adminData, isLoading, error } = useGetAdminStatsQuery();

  if (isLoading) return <Loading />;
  if (error) return <div>Failed to fetch data</div>;

  const stats = adminData?.data || {
    totalIssues: 0,
    pendingIssues: 0,
    inProgressIssues: 0,
    solvedIssues: 0,
    monthlyIssues: [],
  };

  return (
    <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col gap-6 md:gap-8">
      {/* Top Section */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Card */}
        <div className="w-full lg:w-[60%] bg-white shadow border rounded-lg flex flex-col justify-between">
          <div className="grid grid-cols-1 md:grid-cols-2 w-full">
            {/* Text Section */}
            <div className="flex flex-col justify-center gap-3 p-6">
              <h1 className="text-lg md:text-xl">
                Congratulations{" "}
                <span className="text-pink-500 font-medium">{user?.name}</span>{" "}
                🎉
              </h1>
              <p className="text-gray-700 text-sm leading-relaxed">
                You have done 72% more sales today. <br />
                Check your new badge in your profile.
              </p>
              <div className="pt-4">
                <button className="bg-pink-500 text-white px-4 py-2 rounded-md cursor-pointer hover:bg-blue-600 transition">
                  View profile
                </button>
              </div>
            </div>

            {/* Image Section */}
            <div className="flex items-center justify-center md:justify-end p-4">
              <img
                src={adminMan}
                alt="admin"
                className="w-[220px] md:w-[260px] h-auto object-contain"
              />
            </div>
          </div>
        </div>

        {/* Right Stats Grid */}
        <div className="w-full lg:w-[40%] grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 gap-4">
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Total Issues</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 font-bold">
              <NumberTicker value={stats.totalIssues} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Pending Issues</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold">
              <NumberTicker value={stats.pendingIssues} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>In Progress</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold">
              <NumberTicker value={stats.inProgressIssues} />
            </p>
          </div>
          <div className="bg-white shadow border text-center rounded-lg p-4">
            <h2 className="text-base md:text-lg font-semibold mb-1">
              <AuroraText>Solved Issues</AuroraText>
            </h2>
            <p className="text-xl md:text-2xl font-bold">
              <NumberTicker value={stats.solvedIssues} />
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Left Chart */}
        <div className="w-full lg:w-[60%] bg-white shadow border rounded-lg p-4 h-fit sm:h-[400px] md:h-[440px]">
          <Chartar stats={stats} />
        </div>

        {/* Right Chart */}
        <div className="w-full lg:w-[40%] bg-white shadow border rounded-lg p-4 h-[400px] sm:h-[440px]">
          <LineChartPage monthlyData={stats.monthlyIssues} />
        </div>
      </div>
    </motion.div>
  );
};

export default AdminDashboardMain;
