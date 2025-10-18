import { SimulationForm } from "@/components/forms";

export default function Simulations() {
  return (
    <div className="bg-white dark:bg-gray-900 rounded-xl p-6 shadow-sm h-full overflow-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-1">What-If Scenarios</h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Adjust student parameters to see how different factors affect risk predictions
        </p>
      </div>
      <SimulationForm />
    </div>
  );
}
