import { fetchAnalyticsForProject } from "@/actions/analytics.action";
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
  Loader2,
} from "lucide-react";
  
export default async function AnalyticsCards({projectId}: {projectId: string}) {
  const analyticsForCards = await fetchAnalyticsForProject(projectId)

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
            <div className="text-2xl font-bold">{analyticsForCards ? analyticsForCards[0] : <Loader2 className="animate-spin" />}</div>
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
            <div className="text-2xl font-bold">{analyticsForCards ? analyticsForCards[1] : <Loader2 className="animate-spin" />}</div>
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
            <div className="text-2xl font-bold">{analyticsForCards ? analyticsForCards[2] : <Loader2 className="animate-spin" />}</div>
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
            <div className="text-2xl font-bold">{analyticsForCards ? analyticsForCards[3] : <Loader2 className="animate-spin" />}</div>
          </CardContent>
        </Card>
      </>
    );
}
  