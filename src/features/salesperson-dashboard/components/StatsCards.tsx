import { Card, CardContent } from "../../../components/ui/card";
import { ShoppingBag, Clock, CheckCircle2 } from "lucide-react";

const StatsCards = ({ orders }: any) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <h3 className="text-3xl font-bold">{orders.length}</h3>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Pending</p>
          <h3 className="text-3xl font-bold">
            {orders.filter((o:any)=>o.status==="Pending").length}
          </h3>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <p className="text-sm text-muted-foreground">Payments Received</p>
          <h3 className="text-3xl font-bold">
            {orders.filter((o:any)=>o.payment_status==="Paid").length}
          </h3>
        </CardContent>
      </Card>

    </div>
  );
};

export default StatsCards;