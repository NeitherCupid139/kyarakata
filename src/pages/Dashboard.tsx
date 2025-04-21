import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import Card from '../components/ui/Card';
import { Users, Package, ShoppingBag, DollarSign } from 'lucide-react';
import { formatCurrency } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}

function StatCard({ title, value, description, icon, trend, trendValue }: StatCardProps) {
  return (
    <Card className="flex flex-col">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
            {title}
          </p>
          <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">
            {value}
          </p>
        </div>
        <div className="p-3 rounded-md bg-gray-100 dark:bg-gray-700 self-start">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        {trend && trendValue && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
            trend === 'up' 
              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
              : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
          }`}>
            {trend === 'up' ? '↑' : '↓'} {trendValue}
          </span>
        )}
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      </div>
    </Card>
  );
}

interface RecentActivity {
  id: string;
  action: string;
  user: string;
  time: string;
}

function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([
    { id: '1', action: 'New user registered', user: 'john.doe@example.com', time: '5 minutes ago' },
    { id: '2', action: 'Product added', user: 'admin@example.com', time: '2 hours ago' },
    { id: '3', action: 'Product updated', user: 'jane.smith@example.com', time: '4 hours ago' },
    { id: '4', action: 'User role changed', user: 'admin@example.com', time: '1 day ago' },
  ]);
  
  useEffect(() => {
    // Fetch stats from Supabase - this is a placeholder
    // In a real application, you would aggregate data from your tables
    const fetchStats = async () => {
      try {
        // Fetch users count
        const { count: usersCount } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true });
        
        // Fetch products count
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        // Set the stats
        setStats({
          totalUsers: usersCount || 0,
          totalProducts: productsCount || 0,
          totalSales: 156, // Placeholder
          totalRevenue: 24500, // Placeholder
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      }
    };
    
    // Comment out for now to avoid errors without actual tables
    // fetchStats();
    
    // For demo purposes, set some placeholder stats
    setStats({
      totalUsers: 254,
      totalProducts: 86,
      totalSales: 156,
      totalRevenue: 24500,
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview of your system's performance and statistics
        </p>
      </div>
      
      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          description="Users registered in the system"
          icon={<Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
          trend="up"
          trendValue="12%"
        />
        
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          description="Products in inventory"
          icon={<Package className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
          trend="up"
          trendValue="8%"
        />
        
        <StatCard
          title="Total Sales"
          value={stats.totalSales}
          description="Completed transactions"
          icon={<ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />}
          trend="down"
          trendValue="5%"
        />
        
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          description="Revenue from all sales"
          icon={<DollarSign className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />}
          trend="up"
          trendValue="18%"
        />
      </div>
      
      {/* Recent Activity */}
      <Card title="Recent Activity">
        <div className="flow-root">
          <ul className="-my-5 divide-y divide-gray-200 dark:divide-gray-700">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="py-4">
                <div className="flex items-center space-x-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                      {activity.action}
                    </p>
                    <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                      {activity.user}
                    </p>
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    {activity.time}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </div>
  );
}

export default Dashboard;