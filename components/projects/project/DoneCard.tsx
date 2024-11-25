import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
  
export default function DoneCard() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Elvégzett feladatok száma</CardTitle>
          <CardDescription>Elvégzett feladatok leírása</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end pt-12">
          <p className="text-2xl font-bold">3</p>
        </CardFooter>
      </Card>
    );
}
  