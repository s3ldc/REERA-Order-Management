import React, { useState } from "react";
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
  });

  const myOrders =
    orders?.filter((order) => order.salesperson_id === user?.id) || [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const qty = Number(formData.quantity);

    // 🔹 Correct validation
    if (
      !formData.spa_name.trim() ||
      !formData.address.trim() ||
      !formData.product_name.trim() ||
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
      });

      setFormData({ spa_name: "", address: "", product_name: "", quantity: 1 });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sales Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage your orders</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Order
        </Button>
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
      <Card>
        <CardHeader>
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
            <div className="space-y-4">
              {myOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{order.spa_name}</p>
                    <p className="text-sm text-gray-600">
                      {order.product_name} - {order.quantity} units
                    </p>
                    <p className="text-xs text-gray-500">{order.address}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        order.status === "Pending" ? "secondary" : "default"
                      }
                    >
                      {order.status}
                    </Badge>
                    <Badge
                      variant={
                        order.payment_status === "Paid"
                          ? "default"
                          : "secondary"
                      }
                    >
                      {order.payment_status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalespersonDashboard;
