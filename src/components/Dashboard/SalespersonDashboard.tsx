import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
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
import {
  Plus,
  Package,
  ShoppingBag,
  Clock,
  CheckCircle2,
  MapPin,
  User,
  X,
  Calendar,
  Truck,
  CheckCircle,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import OrdersByStatusChart from "@/components/charts/salesperson/OrdersByStatusChart";
import PaymentStatusChart from "../charts/salesperson/PaymentStatusChart";
import OrdersOverTimeChart from "@/components/charts/salesperson/OrdersOverTimeChart";
import SalespersonOrderTimelineDrawer from "../orders/SalespersonOrderTimelineDrawer";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";

const SalespersonDashboard: React.FC = () => {
  const { user } = useAuth();
  const createOrder = useMutation(api.orders.createOrder);
  const distributors = useQuery(api.users.getDistributors) || [];

  const myOrders =
    useQuery(
      api.orders.getOrdersBySalesperson,
      user ? { salesperson_id: user._id as any } : "skip",
    ) || [];
  const { toast } = useToast();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    spa_name: "",
    address: "",
    product_name: "",
    quantity: 0,
    distributor_id: "",
  });

  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Pending":
        return <Clock className="w-5 h-5 text-amber-600" />;
      case "Dispatched":
        return <Truck className="w-5 h-5 text-blue-600" />;
      case "Delivered":
        return <CheckCircle className="w-5 h-5 text-emerald-600" />;
      default:
        return <Package className="w-5 h-5 text-slate-500" />;
    }
  };

  // const myOrders =
  //   orders?.filter((order) => order.salesperson_id === user?.id) || [];

  // useEffect(() => {
  //   const fetchDistributors = async () => {
  //     try {
  //       const records = await pb.collection("users").getFullList({
  //         filter: 'role = "Distributor"',
  //         sort: "name",
  //       });

  //       const mapped = records.map((r: any) => ({
  //         id: r.id,
  //         name: r.name || r.email,
  //         email: r.email,
  //       }));

  //       setDistributors(mapped);
  //     } catch (err) {
  //       console.error("Failed to fetch distributors", err);
  //     }
  //   };

  //   fetchDistributors();
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const qty = Number(formData.quantity);

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
        salesperson_id: user._id, // ✅ MUST be _id
        distributor_id: formData.distributor_id as any,
        actor_id: user._id, // ✅ REQUIRED
        actor_role: user.role, // ✅ REQUIRED
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
      toast({
        title: "Order Creation Failed",
        description: err?.message || "Backend rejected order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 min-h-screen text-foreground">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-border">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-foreground">
            Analytics Overview
          </h1>
          <p className="text-muted-foreground font-medium mt-2 flex items-center gap-2">
            <User className="w-4 h-4 text-primary" />
            Welcome back,{" "}
            <span className="text-foreground font-bold">
              {user?.name || user?.email}
            </span>
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="bg-primary text-primary-foreground 
           hover:opacity-90 
           shadow-lg shadow-[0_0_20px_hsl(var(--primary)/0.4)] 
           transition-all hover:scale-[1.02] active:scale-[0.98] 
           h-11 px-6 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-card border border-border rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Total Orders
                </p>
                <h3 className="text-3xl font-bold text-foreground mt-1">
                  {myOrders.length}
                </h3>
              </div>
              <div className="p-3 bg-primary/10 rounded-xl group-hover:bg-primary/20 transition-colors">
                <ShoppingBag className="w-6 h-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Pending Fulfillment
                </p>
                <h3 className="text-3xl font-bold text-foreground mt-1">
                  {myOrders.filter((o) => o.status === "Pending").length}
                </h3>
              </div>
              <div className="p-3 bg-amber-500/10 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                <Clock className="w-6 h-6 text-amber-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border border-border rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
                  Payments Received
                </p>
                <h3 className="text-3xl font-bold text-foreground mt-1">
                  {myOrders.filter((o) => o.payment_status === "Paid").length}
                </h3>
              </div>
              <div className="p-3 bg-emerald-500/10 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <OrdersByStatusChart />
        <PaymentStatusChart />
      </div>

      <div className="mt-6">
        <OrdersOverTimeChart />
      </div>

      {/* Modern Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl bg-card text-card-foreground border border-border shadow-2xl rounded-3xl ...">
            <CardHeader className="flex flex-row items-center justify-between border-b border-border pb-6 px-8">
              <div>
                <CardTitle className="text-2xl font-bold text-foreground">
                  New Order Entry
                </CardTitle>
                <CardDescription>
                  Fill in the client and product requirements
                </CardDescription>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowForm(false)}
                className="rounded-full"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold">
                      Spa/Salon Name
                    </Label>
                    <Input
                      id="spa_name"
                      value={formData.spa_name}
                      onChange={(e) =>
                        setFormData({ ...formData, spa_name: e.target.value })
                      }
                      placeholder="e.g. Zen Retreat"
                      className="rounded-xl h-11 border-border bg-background focus:ring-ring focus:border-ring"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Street, City, Zip"
                      className="rounded-xl h-11 border-border bg-background focus:ring-ring focus:border-ring"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold">
                      Product
                    </Label>
                    <Input
                      id="product_name"
                      value={formData.product_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          product_name: e.target.value,
                        })
                      }
                      placeholder="Search products..."
                      className="rounded-xl h-11 border-border bg-background focus:ring-ring focus:border-ring"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-foreground font-semibold">
                      Quantity
                    </Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      value={formData.quantity === 0 ? "" : formData.quantity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          quantity: Number(e.target.value),
                        })
                      }
                      className="rounded-xl h-11 border-border bg-background focus:ring-ring focus:border-ring"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-foreground font-semibold">
                      Assign Distributor
                    </Label>
                    <select
                      id="distributor"
                      value={formData.distributor_id}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          distributor_id: e.target.value,
                        })
                      }
                      className="w-full border border-border rounded-xl px-4 h-11 bg-background text-sm focus:ring-2 focus:ring-ring outline-none"
                      required
                    >
                      <option value="">Choose a distributor</option>
                      {distributors.map((d) => (
                        <option key={d._id} value={d._id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-primary text-primary-foreground 
h-12 rounded-xl text-lg font-bold
shadow-lg shadow-[0_0_25px_hsl(var(--primary)/0.4)]
hover:opacity-90 transition-all"
                  >
                    Confirm Order
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Orders Table Section */}
      <Card className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
        <CardHeader className="bg-card border-b border-border p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-foreground">
                Recent Activity
              </CardTitle>
              <CardDescription className="text-muted-foreground font-medium">
                Tracking your most recent order submissions
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {myOrders.length === 0 ? (
            <div className="text-center py-24">
              <div className="bg-muted w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-muted-foreground/40" />
              </div>
              No orders found
              <p className="text-foreground font-bold text-lg">
                No orders found
              </p>
              <p className="text-muted-foreground">
                Start by creating a new order above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-muted/40 text-muted-foreground uppercase text-[11px] font-bold tracking-widest">
                    <th className="py-5 px-8">Client & Location</th>
                    <th className="py-5 px-4">Product Specs</th>
                    <th className="py-5 px-4 text-center">Qty</th>
                    <th className="py-5 px-4">Status</th>
                    <th className="py-5 px-4">Payment</th>
                    <th className="py-5 px-4 text-right pr-8">Date Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {myOrders.map((order) => (
                    <tr
                      key={order._id}
                      className="group hover:bg-muted/40 transition-all duration-200"
                    >
                      <td className="py-6 px-8">
                        <div className="font-bold text-foreground">
                          {order.spa_name}
                        </div>
                        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1 font-medium italic">
                          <MapPin className="w-3 h-3" /> {order.address}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="text-sm font-semibold text-foreground bg-muted rounded-md px-2.5 py-1 inline-flex items-center gap-2">
                          <Package className="w-3.5 h-3.5" />{" "}
                          {order.product_name}
                        </div>
                      </td>
                      <td className="py-6 px-4 text-center font-bold text-foreground">
                        {order.quantity}
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2">
                          {getStatusIcon(order.status)}
                          <span className="text-sm font-bold text-foreground">
                            {order.status}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${order.payment_status === "Paid" ? "bg-emerald-500" : "bg-muted-foreground/40"}`}
                          />
                          <span
                            className={`text-xs font-bold uppercase ${order.payment_status === "Paid" ? "text-emerald-500" : "text-muted-foreground"}`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-4 pr-8">
                        <div className="flex items-center justify-end gap-3">
                          {/* Timeline calendar icon */}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setSelectedOrder(order)}
                            className="group flex items-center gap-2 
           text-foreground/80 
           hover:text-foreground 
           hover:bg-muted/60 
           rounded-lg px-3"
                          >
                            <Calendar className="w-4 h-4" />
                            <span className="hidden group-hover:inline text-xs font-medium">
                              Timeline
                            </span>
                          </Button>

                          {/* Creation date */}
                          <div className="text-sm font-bold text-foreground whitespace-nowrap">
                            {new Date(order._creationTime).toLocaleDateString(
                              "en-US",
                              {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              },
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedOrder && (
        <SalespersonOrderTimelineDrawer
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
        />
      )}
    </div>
  );
};

export default SalespersonDashboard;