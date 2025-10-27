import { SimulationForm } from "@/components/forms";

export default function Simulations() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm h-full overflow-hidden overflow-y-auto scrollbar-hide auto-scroll">
      <div className="bg-gradient-to-br from-[#2563eb] to-[#1e40af] rounded-xl p-4 relative mb-4">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
        <h1 className="text-2xl font-semibold text-white dark:text-gray-100 mb-1">What-If Scenarios</h1>
        <p className="text-sm text-white dark:text-gray-400">
          Adjust student parameters to see how different factors affect risk predictions
        </p>
      </div>
      <SimulationForm />
    </div>
  );
}
