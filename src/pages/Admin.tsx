
import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Users, Briefcase, Settings } from "lucide-react";

const Admin = () => {
  const { isAdmin, user } = useAuth();

  // Redirect if not an admin
  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen pt-20 pb-10 px-4 bg-gray-50">
      <div className="container max-w-7xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <Shield className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 mb-8">
          <h2 className="text-xl font-semibold mb-4">Welcome, Admin</h2>
          <p className="text-gray-600 mb-4">
            From here you can manage users, job listings, and site settings.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button>View Recent Activity</Button>
            <Button variant="outline">System Status</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="h-5 w-5 mr-2 text-primary" />
                User Management
              </CardTitle>
              <CardDescription>
                Manage user accounts and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Total Users: <span className="font-semibold">128</span>
              </p>
              <p className="text-sm text-gray-600">
                New Today: <span className="font-semibold">5</span>
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Manage Users
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="h-5 w-5 mr-2 text-primary" />
                Job Listings
              </CardTitle>
              <CardDescription>
                Manage and moderate job listings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Active Listings: <span className="font-semibold">42</span>
              </p>
              <p className="text-sm text-gray-600">
                Pending Review: <span className="font-semibold">7</span>
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                Manage Listings
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Settings className="h-5 w-5 mr-2 text-primary" />
                System Settings
              </CardTitle>
              <CardDescription>
                Configure system and site settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                Last Update: <span className="font-semibold">Today</span>
              </p>
              <p className="text-sm text-gray-600">
                System Status: <span className="font-semibold text-green-600">Online</span>
              </p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" className="w-full">
                System Settings
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Admin;
