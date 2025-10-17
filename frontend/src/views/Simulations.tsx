import { SimulationForm } from "@/components/forms";

export default function Simulations() {
  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">What-If Scenarios</h1>
        <p className="text-muted-foreground">
          Adjust student parameters to see how different factors affect risk predictions
        </p>
      </div>
      <SimulationForm />
    </div>
  );
}
