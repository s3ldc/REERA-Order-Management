import React, { useEffect, useState } from "react";
import pb from "../lib/pocketbase";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Alert, AlertDescription } from "./ui/alert";
import { Trash2, Plus, X, Copy, Check } from "lucide-react";
import { useToast } from "../hooks/useToast";
import { generatePassword } from "../utils/password";

interface UserManagementModalProps {
  onClose: () => void;
}

interface PBUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "salesperson" | "distributor";
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({
  onClose,
}) => {
  const { toast } = useToast();

  const [users, setUsers] = useState<PBUser[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    role: "salesperson" as "salesperson" | "distributor",
  });

  const [generatedPassword, setGeneratedPassword] = useState("");
  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [copied, setCopied] = useState(false);
  const [createdEmail, setCreatedEmail] = useState("");

  // -------------------------------
  // Fetch all users from PocketBase
  // -------------------------------
  const fetchUsers = async () => {
    try {
      const records = await pb.collection("users").getFullList({
        sort: "created",
        filter: "role != 'Admin'"
      });

      const mapped: PBUser[] = records.map((r: any) => ({
        id: r.id,
        email: r.email,
        name: r.name,
        role: r.role,
      }));

      setUsers(mapped);
    } catch (err) {
      console.error("Failed to fetch users", err);
      toast({
        title: "Error",
        description: "Failed to load users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // -------------------------------
  // Admin creates a new user
  // -------------------------------
  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const password = generatePassword(10);

      await pb.collection("users").create({
        email: newUser.email,
        password: password,
        passwordConfirm: password,
        name: newUser.name,
        role: newUser.role,
      });

      setGeneratedPassword(password);
      setCreatedEmail(newUser.email);
      setShowPasswordAlert(true);
      setCopied(false);
      setShowAddForm(false);

      toast({
        title: "User Created",
        description: `${newUser.name} has been created successfully.`,
      });

      setNewUser({ name: "", email: "", role: "salesperson" });

      await fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: err.message || "Failed to create user",
        variant: "destructive",
      });
    }
  };

  // -------------------------------
  // Delete user
  // -------------------------------
  const handleDeleteUser = async (userId: string) => {
    try {
      await pb.collection("users").delete(userId);

      toast({
        title: "Success",
        description: "User deleted successfully",
      });

      await fetchUsers();
    } catch (err: any) {
      console.error(err);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);

    toast({
      title: "Copied",
      description: "Password copied to clipboard",
    });
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-purple-100 text-purple-800",
      salesperson: "bg-blue-100 text-blue-800",
      distributor: "bg-green-100 text-green-800",
    };
    return (
      <Badge className={variants[role as keyof typeof variants]}>{role}</Badge>
    );
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-center">
            <div>
              <DialogTitle>User Management</DialogTitle>
              <DialogDescription>
                Manage system users and their roles
              </DialogDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">
              All Users ({users.length})
            </h3>
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add User
            </Button>
          </div>

          {/* Password Alert */}
          {showPasswordAlert && (
            <Alert className="bg-blue-50 border-blue-200">
              <AlertDescription className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-blue-900">
                      New User Credentials
                    </p>
                    <p className="text-sm text-blue-800">
                      <strong>Email:</strong> {createdEmail}
                      <br />
                      <strong>Password:</strong>{" "}
                      <span className="font-mono bg-blue-100 px-2 py-1 rounded">
                        {generatedPassword}
                      </span>
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      Please save these credentials securely. This will not be
                      shown again.
                    </p>
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={copyToClipboard}
                    className="flex items-center gap-2"
                  >
                    {copied ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {showAddForm && (
            <div className="bg-slate-50 p-4 rounded-lg space-y-4">
              <h4 className="font-medium">Add New User</h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input
                    value={newUser.name}
                    onChange={(e) =>
                      setNewUser({ ...newUser, name: e.target.value })
                    }
                    placeholder="Enter name"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newUser.email}
                    onChange={(e) =>
                      setNewUser({ ...newUser, email: e.target.value })
                    }
                    placeholder="Enter email"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Role</Label>
                  <select
                    value={newUser.role}
                    onChange={(e) =>
                      setNewUser({ ...newUser, role: e.target.value as any })
                    }
                    className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md bg-white"
                  >
                    <option value="salesperson">Salesperson</option>
                    <option value="distributor">Distributor</option>
                  </select>
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-md">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> A secure password will be automatically
                  generated and shown once.
                </p>
              </div>

              <div className="flex gap-2">
                <Button onClick={handleAddUser}>Add User</Button>
                <Button variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Users List */}
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {getRoleBadge(user.role)}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserManagementModal;
