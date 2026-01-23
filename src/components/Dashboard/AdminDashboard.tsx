import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useOrderContext } from '../../context/OrderContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Package, Truck, CheckCircle, DollarSign, Users, Calendar } from 'lucide-react';
import UserManagementModal from '../UserManagementModal';
import { useToast } from '../../hooks/useToast';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();
  const { orders, updateOrderStatus, updatePaymentStatus } = useOrderContext();
  const { toast } = useToast();
  const [showUserModal, setShowUserModal] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    dateFrom: '',
    dateTo: '',
  });

  const filteredOrders = orders?.filter(order => {
    if (filters.status !== 'all' && order.status !== filters.status) return false;
    if (filters.dateFrom && new Date(order.created_at) < new Date(filters.dateFrom)) return false;
    if (filters.dateTo && new Date(order.created_at) > new Date(filters.dateTo)) return false;
    return true;
  }) || [];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Package className="w-4 h-4" />;
      case 'Dispatched':
        return <Truck className="w-4 h-4" />;
      case 'Delivered':
        return <CheckCircle className="w-4 h-4" />;
      default:
        return <Package className="w-4 h-4" />;
    }
  };

  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'Pending':
        return 'Dispatched';
      case 'Dispatched':
        return 'Delivered';
      default:
        return currentStatus;
    }
  };

  const handleStatusUpdate = async (orderId: string, currentStatus: string) => {
    const nextStatus = getNextStatus(currentStatus);
    if (nextStatus !== currentStatus) {
      await updateOrderStatus(orderId, nextStatus as any);
      toast({
        title: 'Success',
        description: `Order status updated to ${nextStatus}`,
      });
    }
  };

  const handlePaymentToggle = async (orderId: string, currentStatus: string) => {
    const newStatus = currentStatus === 'Paid' ? 'Unpaid' : 'Paid';
    await updatePaymentStatus(orderId, newStatus as any);
    toast({
      title: 'Success',
      description: `Payment status updated to ${newStatus}`,
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage all orders and users</p>
        </div>
        <Button onClick={() => setShowUserModal(true)} className="flex items-center gap-2">
          <Users className="w-4 h-4" />
          Manage Users
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders?.filter(o => o.status === 'Pending').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Paid Orders</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders?.filter(o => o.payment_status === 'Paid').length || 0}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Delivered</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orders?.filter(o => o.status === 'Delivered').length || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
              >
                <option value="all">All</option>
                <option value="Pending">Pending</option>
                <option value="Dispatched">Dispatched</option>
                <option value="Delivered">Delivered</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateFrom">From Date</Label>
              <Input
                id="dateFrom"
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateTo">To Date</Label>
              <Input
                id="dateTo"
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>All Orders</CardTitle>
          <CardDescription>Manage all system orders</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getStatusIcon(order.status)}
                      <p className="font-medium">{order.spa_name}</p>
                    </div>
                    <p className="text-sm text-gray-600">{order.product_name} - {order.quantity} units</p>
                    <p className="text-xs text-gray-500">{order.address}</p>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={order.status === 'Pending' ? 'secondary' : 'default'}>
                      {order.status}
                    </Badge>
                    <Badge variant={order.payment_status === 'Paid' ? 'default' : 'secondary'}>
                      {order.payment_status}
                    </Badge>
                    {order.status !== 'Delivered' && (
                      <Button
                        size="sm"
                        onClick={() => handleStatusUpdate(order.id, order.status)}
                      >
                        Mark {getNextStatus(order.status)}
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePaymentToggle(order.id, order.payment_status)}
                    >
                      {order.payment_status === 'Paid' ? 'Mark Unpaid' : 'Mark Paid'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* User Management Modal */}
      {showUserModal && (
        <UserManagementModal onClose={() => setShowUserModal(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;