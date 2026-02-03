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
import {
  Plus,
  Package,
  Search,
  ShoppingBag,
  Clock,
  CheckCircle2,
  MapPin,
  User,
  X,
} from "lucide-react";
import { useToast } from "../../hooks/useToast";
import pb from "../../lib/pocketbase";
import OrdersByStatusChart from "@/components/charts/salesperson/OrdersByStatusChart";
import PaymentStatusChart from "../charts/salesperson/PaymentStatusChart";

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
      toast({
        title: "Order Creation Failed",
        description: err?.message || "Backend rejected order",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 bg-[#FAFBFC] min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-gray-100">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900">
            Analytics Overview
          </h1>
          <p className="text-slate-500 font-medium mt-2 flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            Welcome back,{" "}
            <span className="text-slate-900">{user?.name || user?.email}</span>
          </p>
        </div>

        <Button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200/50 transition-all hover:scale-[1.02] active:scale-[0.98] h-11 px-6 rounded-xl flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Create New Order
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-blue-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Total Orders
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {myOrders.length}
                </h3>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl group-hover:bg-blue-100 transition-colors">
                <ShoppingBag className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Pending Fulfillment
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {myOrders.filter((o) => o.status === "Pending").length}
                </h3>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl group-hover:bg-amber-100 transition-colors">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden relative group">
          <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                  Payments Received
                </p>
                <h3 className="text-3xl font-bold text-slate-900 mt-1">
                  {myOrders.filter((o) => o.payment_status === "Paid").length}
                </h3>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl group-hover:bg-emerald-100 transition-colors">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
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

      {/* Modern Form Overlay */}
      {showForm && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-2xl shadow-2xl border-none rounded-3xl animate-in zoom-in-95 duration-200">
            <CardHeader className="flex flex-row items-center justify-between border-b border-slate-100 pb-6 px-8">
              <div>
                <CardTitle className="text-2xl font-bold text-slate-900">
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
                <X className="w-5 h-5 text-slate-400" />
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
                      Spa/Salon Name
                    </Label>
                    <Input
                      id="spa_name"
                      value={formData.spa_name}
                      onChange={(e) =>
                        setFormData({ ...formData, spa_name: e.target.value })
                      }
                      placeholder="e.g. Zen Retreat"
                      className="rounded-xl border-slate-200 h-11 focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
                      Address
                    </Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      placeholder="Street, City, Zip"
                      className="rounded-xl border-slate-200 h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
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
                      className="rounded-xl border-slate-200 h-11"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-700 font-semibold">
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
                      className="rounded-xl border-slate-200 h-11"
                      required
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-700 font-semibold">
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
                      className="w-full border border-slate-200 rounded-xl px-4 h-11 bg-white text-sm focus:ring-2 focus:ring-blue-500 outline-none appearance-none"
                      required
                    >
                      <option value="">Choose a distributor</option>
                      {distributors.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-4">
                  <Button
                    type="submit"
                    className="flex-1 bg-blue-600 h-12 rounded-xl text-lg font-bold shadow-lg shadow-blue-200"
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
      <Card className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white rounded-2xl overflow-hidden">
        <CardHeader className="bg-white border-b border-slate-100 p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-slate-900">
                Recent Activity
              </CardTitle>
              <CardDescription className="text-slate-400 font-medium">
                Tracking your most recent order submissions
              </CardDescription>
            </div>
            <div className="relative group">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
              <Input
                placeholder="Filter orders..."
                className="pl-10 h-10 w-full md:w-64 rounded-lg bg-slate-50 border-none focus:bg-white transition-all ring-0 focus-visible:ring-1 focus-visible:ring-blue-200"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {myOrders.length === 0 ? (
            <div className="text-center py-24">
              <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-900 font-bold text-lg">
                No orders found
              </p>
              <p className="text-slate-400">
                Start by creating a new order above.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 uppercase text-[11px] font-bold tracking-widest">
                    <th className="py-5 px-8">Client & Location</th>
                    <th className="py-5 px-4">Product Specs</th>
                    <th className="py-5 px-4 text-center">Qty</th>
                    <th className="py-5 px-4">Status</th>
                    <th className="py-5 px-4">Payment</th>
                    <th className="py-5 px-4 text-right pr-8">Date Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {myOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="group hover:bg-slate-50/80 transition-all duration-200"
                    >
                      <td className="py-6 px-8">
                        <div className="font-bold text-slate-900">
                          {order.spa_name}
                        </div>
                        <div className="text-xs text-slate-400 mt-1 flex items-center gap-1 font-medium italic">
                          <MapPin className="w-3 h-3" /> {order.address}
                        </div>
                      </td>
                      <td className="py-6 px-4">
                        <div className="text-sm font-semibold text-slate-700 bg-slate-100 rounded-md px-2 py-1 inline-block">
                          {order.product_name}
                        </div>
                      </td>
                      <td className="py-6 px-4 text-center font-bold text-slate-900">
                        {order.quantity}
                      </td>
                      <td className="py-6 px-4">
                        <Badge
                          variant="outline"
                          className={`rounded-full px-3 py-1 font-bold border-none ${
                            order.status === "Pending"
                              ? "bg-amber-100 text-amber-600"
                              : "bg-blue-100 text-blue-600"
                          }`}
                        >
                          {order.status}
                        </Badge>
                      </td>
                      <td className="py-6 px-4">
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2 h-2 rounded-full ${order.payment_status === "Paid" ? "bg-emerald-500" : "bg-slate-300"}`}
                          />
                          <span
                            className={`text-xs font-bold uppercase ${order.payment_status === "Paid" ? "text-emerald-600" : "text-slate-400"}`}
                          >
                            {order.payment_status}
                          </span>
                        </div>
                      </td>
                      <td className="py-6 px-4 text-right pr-8">
                        <div className="text-sm font-bold text-slate-700">
                          {new Date(order.created).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                        <div className="text-[10px] font-medium text-slate-400 uppercase mt-1">
                          ID: #{order.id.slice(-4)}
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
    </div>
  );
};

export default SalespersonDashboard;
