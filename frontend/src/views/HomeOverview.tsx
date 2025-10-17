import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HomeOverview() {
  return (
    <div className="flex flex-col gap-4 mt-2">
      <div className="flex-1">
          <h1 className="text-2xl font-bold">Overview</h1>
        </div>
      <div className="flex gap-4 w-full">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Total Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>100</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>At Risk Students</CardTitle>
          </CardHeader>
          <CardContent>
            <p>50</p>
          </CardContent>
        </Card>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Success Predictions</CardTitle>
          </CardHeader>
          <CardContent>
            <p>50</p>
          </CardContent>
        </Card>
      </div>
      <div className="flex flex-col gap-4">
        
      </div>
    </div>
  )
}
