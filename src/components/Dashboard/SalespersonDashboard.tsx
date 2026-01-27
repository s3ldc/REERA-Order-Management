import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useOrderContext } from "../../context/OrderContext";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Badge } from "../ui/badge";
import { Plus, Package } from "lucide-react";
import { useToast } from "../../hooks/useToast";
import pb from "../../lib/pocketbase";

const SalespersonDashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, createOrder } = useOrderContext();
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    spa_name: "",
    address: "",
    product_name: "",
    quantity: 0,
    distributor_id: "",
  });
  const [distributors, setDistributors] = useState<
    { id: string; name: string; email: string }[]
  >([]);

  const myOrders =
    orders?.filter((order) => order.salesperson_id === user?.id) || [];

  useEffect(() => {
    const fetchDistributors = async () => {
      try {
        const records = await pb.collection("users").getFullList({
          filter: 'role = "Distributor"',
          sort: "name",
        });

        const mapped = records.map((r: any) => ({
          id: r.id,
          name: r.name || r.email,
          email: r.email,
        }));

        setDistributors(mapped);
      } catch (err) {
        console.error("Failed to fetch distributors", err);
      }
    };

    fetchDistributors();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const qty = Number(formData.quantity);

    // 🔹 Correct validation
    if (
      !formData.spa_name.trim() ||
      !formData.address.trim() ||
      !formData.product_name.trim() ||
      !formData.distributor_id ||
      isNaN(qty) ||
      qty <= 0
    ) {
      toast({
        title: "Error",
        description: "Please fill in all fields with valid values",
        variant: "destructive",
      });
      return;
    }

    try {
      await createOrder({
        spa_name: formData.spa_name,
        address: formData.address,
        product_name: formData.product_name,
        quantity: qty,
        status: "Pending",
        payment_status: "Unpaid",
        salesperson_id: user.id,
        distributor_id: formData.distributor_id,
      });

      setFormData({
        spa_name: "",
        address: "",
        product_name: "",
        quantity: 1,
        distributor_id: "",
      });
      setShowForm(false);

      toast({
        title: "Success",
        description: "Order created successfully",
      });
    } catch (err: any) {
      console.error("CREATE ORDER ERROR:", err);

      toast({
        title: "Order Creation Failed",
        description: err?.message || "Backend rejected order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">
            Welcome back, {user?.name || user?.email}
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 self-start md:self-auto"
        >
          <Plus className="w-4 h-4" />
          New Order
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Total Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{myOrders.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Pending
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myOrders.filter((o) => o.status === "Pending").length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Paid
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {myOrders.filter((o) => o.payment_status === "Paid").length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Form */}
      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Order</CardTitle>
            <CardDescription>Fill in the order details</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="spa_name">Spa/Salon Name</Label>
                  <Input
                    id="spa_name"
                    value={formData.spa_name}
                    onChange={(e) =>
                      setFormData({ ...formData, spa_name: e.target.value })
                    }
                    placeholder="Enter spa/salon name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter address"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="product_name">Product Name</Label>
                  <Input
                    id="product_name"
                    value={formData.product_name}
                    onChange={(e) =>
                      setFormData({ ...formData, product_name: e.target.value })
                    }
                    placeholder="Enter product name"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={formData.quantity === 0 ? "" : formData.quantity}
                    onChange={(e) => {
                      const val = e.target.value;

                      // Allow empty while typing
                      if (val === "") {
                        setFormData({ ...formData, quantity: 0 });
                      } else {
                        const num = Number(val);
                        if (!isNaN(num)) {
                          setFormData({ ...formData, quantity: num });
                        }
                      }
                    }}
                    placeholder="Enter quantity"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="distributor">Assign Distributor</Label>
                  <select
                    id="distributor"
                    value={formData.distributor_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        distributor_id: e.target.value,
                      })
                    }
                    className="w-full border rounded-md px-3 py-2"
                    required
                  >
                    <option value="">Select a distributor</option>
                    {distributors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Button type="submit">Create Order</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <Card className="border-2 border-blue-100 shadow-md">
        <CardHeader className="bg-gray-50 rounded-t-lg">
          <CardTitle>My Orders</CardTitle>
          <CardDescription>Orders you have created</CardDescription>
        </CardHeader>
        <CardContent>
          {myOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No orders yet. Create your first order!
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b bg-gray-50 text-left text-sm text-gray-600">
                    <th className="py-2 px-3">Spa</th>
                    <th className="py-2 px-3">Product</th>
                    <th className="py-2 px-3">Qty</th>
                    <th className="py-2 px-3">Status</th>
                    <th className="py-2 px-3">Payment</th>
                    <th className="py-2 px-3">Distributor</th>
                  </tr>
                </thead>
                <tbody>
                  {myOrders.map((order) => (
                    <tr key={order.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-3 font-medium">
                        {order.spa_name}
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-600">
                        {order.product_name}
                      </td>
                      <td className="py-2 px-3">{order.quantity}</td>
                      <td className="py-2 px-3">
                        <Badge
                          variant={
                            order.status === "Pending" ? "secondary" : "default"
                          }
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3">
                        <Badge
                          variant={
                            order.payment_status === "Paid"
                              ? "default"
                              : "secondary"
                          }
                        >
                          {order.payment_status}
                        </Badge>
                      </td>
                      <td className="py-2 px-3 text-sm text-gray-700">
                        {order.expand?.distributor_id?.name ||
                          order.expand?.distributor_id?.email ||
                          "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalespersonDashboard;
