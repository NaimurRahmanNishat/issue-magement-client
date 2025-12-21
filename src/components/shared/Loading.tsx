// src/components/shared/Loading.tsx
const Loading = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <span className="relative inline-block w-12 h-12 rounded-full border-t-4 border-r-4 border-white border-r-transparent animate-spin">
        <span className="absolute inset-0 w-12 h-12 rounded-full border-l-4 border-b-4 border-red-500 border-b-transparent animate-[spin_0.90s_linear_infinite]"></span>
      </span>
    </div>
  );
};

export default Loading;