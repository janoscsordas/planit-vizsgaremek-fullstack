import {
    Card,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
  
export default function InprogressCard() {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Folyamatban lévő feladatok száma</CardTitle>
          <CardDescription>Folyamatban lévő feladatok leírása</CardDescription>
        </CardHeader>
        <CardFooter className="flex justify-end pt-12">
          <p className="text-2xl font-bold">3</p>
        </CardFooter>
      </Card>
    );
}
  