import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { useToast } from '../hooks/useToast';
import { Settings, User, Building } from 'lucide-react';

const AccountSettings: React.FC = () => {
  const { user, users, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    distributorId: user?.distributorId?.toString() || '',
  });

  const distributors = users?.filter(u => u.role === 'Distributor') || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;

    const updates: any = {
      name: formData.name,
      email: formData.email,
    };

    if (user.role === 'Salesperson' && formData.distributorId) {
      updates.distributorId = parseInt(formData.distributorId);
    }

    updateUser(user.id, updates);

    toast({
      title: 'Success',
      description: 'Account settings updated successfully',
    });
  };

  const getDistributorName = (distributorId: number) => {
    const distributor = distributors.find(d => d.id === distributorId);
    return distributor?.name || 'Not Assigned';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-6 h-6 text-slate-600" />
        <h2 className="text-2xl font-bold text-slate-900">Account Settings</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Profile Information
            </CardTitle>
            <CardDescription>
              Update your personal information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your full name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter your email"
                />
              </div>

              <Button type="submit" className="w-full">
                Update Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {user?.role === 'Salesperson' && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="w-5 h-5" />
                Distributor Assignment
              </CardTitle>
              <CardDescription>
                Manage your distributor assignment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <Label>Current Distributor</Label>
                  <div className="mt-1 p-3 bg-slate-50 rounded-md">
                    <p className="font-medium text-slate-900">
                      {user.distributorId ? getDistributorName(user.distributorId) : 'Not Assigned'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="distributor">Change Distributor</Label>
                  <Select
                    value={formData.distributorId}
                    onValueChange={(value) => setFormData({ ...formData, distributorId: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select a distributor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">No Distributor</SelectItem>
                      {distributors.map((distributor) => (
                        <SelectItem key={distributor.id} value={distributor.id.toString()}>
                          {distributor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button 
                  onClick={handleSubmit}
                  className="w-full"
                  variant="outline"
                >
                  Update Distributor
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription>
              Your account information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <Label className="text-sm font-medium text-slate-600">Role</Label>
                <p className="mt-1 text-slate-900 capitalize">{user?.role}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-slate-600">User ID</Label>
                <p className="mt-1 text-slate-900 font-mono">#{user?.id}</p>
              </div>
              {user?.role === 'Salesperson' && (
                <div>
                  <Label className="text-sm font-medium text-slate-600">Distributor ID</Label>
                  <p className="mt-1 text-slate-900 font-mono">
                    {user.distributorId ? `#${user.distributorId}` : 'Not Assigned'}
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AccountSettings;