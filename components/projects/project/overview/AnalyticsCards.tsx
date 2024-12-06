import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { 
  CircleDashed,
  Users,
  Loader,
  CircleCheckBig,
} from "lucide-react";
  
export default function AnalyticsCards({analyticsForCards}: {analyticsForCards: number[]}) {
    return (
      <>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Tagok száma
            </CardTitle>
            <Users className="text-muted-foreground" width={16} height={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsForCards[0]}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Elvégzendő feladatok
            </CardTitle>
            <CircleDashed className="text-muted-foreground" width={16} height={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsForCards[1]}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Folyamatban lévő feladatok
            </CardTitle>
            <Loader className="text-muted-foreground" width={16} height={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsForCards[2]}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium">
              Elvégzett feladatok
            </CardTitle>
            <CircleCheckBig className="text-muted-foreground" width={16} height={16} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analyticsForCards[3]}</div>
          </CardContent>
        </Card>
      </>
    );
}
  