// src/components/DivisionIssues.tsx
import { AuroraText } from "@/components/ui/aurora-text";
import { useNavigate } from "react-router-dom";

interface DivisionIssuesProps {
  name: string;
  value: string;
}

const Divisions: DivisionIssuesProps[] = [
  { name: "Dhaka", value: "DHAKA" },
  { name: "Chattogram", value: "CHATTOGRAM" },
  { name: "Rajshahi", value: "RAJSHAHI" },
  { name: "Khulna", value: "KHULNA" },
  { name: "Barishal", value: "BARISHAL" },
  { name: "Sylhet", value: "SYLHET" },
  { name: "Rangpur", value: "RANGPUR" },
  { name: "Mymensingh", value: "MYMENSINGH" },
];

const DivisionIssues = () => {
  const navigate = useNavigate();

  const handleDivisionClick = (divisionValue: string) => {
    navigate(`/location/${divisionValue}`);
  };

  return (
    <section>
      <h1 className="font-bold text-3xl md:text-4xl text-center mb-10">
        <AuroraText>Division Issues</AuroraText>
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 cursor-pointer gap-6 max-w-7xl mx-auto">
        {Divisions.map((division: DivisionIssuesProps, index) => (
          <div
            key={index}
            onClick={() => handleDivisionClick(division.value)}
            className="bg-white hover:bg-gray-200 shadow-md rounded-2xl p-6 text-center border border-gray-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <h2 className="text-xl font-semibold text-gray-800">
              {division.name}
            </h2>
            <p className="text-gray-500 text-sm mt-2">
              View issues reported from {division.name}.
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default DivisionIssues;
