import { useState, useEffect } from 'react';
import api from '../services/api';
import { Package, MessageSquare, Grid, TrendingUp, Activity, ArrowRight, BarChart3 } from 'lucide-react';

const Dashboard = () => {
  const [stats, setStats] = useState([
    { label: 'Total Products', value: '0', trend: '0%', isPositive: true, icon: Package, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
    { label: 'Active Inquiries', value: '0', trend: '0%', isPositive: true, icon: MessageSquare, color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/30' },
    { label: 'Categories', value: '0', trend: '0%', isPositive: true, icon: Grid, color: 'from-purple-500 to-fuchsia-600', shadow: 'shadow-purple-500/30' },
    { label: 'Total Sales', value: '0', trend: '0%', isPositive: true, icon: TrendingUp, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/30' },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/stats');
        if (response.data.success) {
          const { totalProducts, totalCategories, totalInquiries } = response.data.data;
          setStats([
            { label: 'Total Products', value: totalProducts.toString(), trend: '+12%', isPositive: true, icon: Package, color: 'from-blue-500 to-indigo-600', shadow: 'shadow-blue-500/30' },
            { label: 'Active Inquiries', value: totalInquiries.toString(), trend: '+5%', isPositive: true, icon: MessageSquare, color: 'from-amber-400 to-orange-500', shadow: 'shadow-orange-500/30' },
            { label: 'Categories', value: totalCategories.toString(), trend: '+2%', isPositive: true, icon: Grid, color: 'from-purple-500 to-fuchsia-600', shadow: 'shadow-purple-500/30' },
            { label: 'Total Sales', value: '₹0', trend: '0%', isPositive: true, icon: TrendingUp, color: 'from-emerald-400 to-teal-500', shadow: 'shadow-emerald-500/30' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="space-y-8 max-w-7xl mx-auto p-2">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Dashboard Overview</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your store today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className={`bg-gradient-to-br ${stat.color} rounded-3xl p-6 text-white shadow-xl ${stat.shadow} relative overflow-hidden group hover:-translate-y-1 transition-all duration-300`}>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500">
              <stat.icon className="w-24 h-24 absolute -top-4 -right-4" />
            </div>
            
            <div className="relative z-10">
              <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-medium text-white/80 mb-1">{stat.label}</h3>
              <div className="flex items-end justify-between">
                <span className="text-3xl font-extrabold tracking-tight">{stat.value}</span>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 bg-white/20 backdrop-blur-sm`}>
                  {stat.isPositive ? '↑' : '↓'} {stat.trend}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Area */}
        <div className="lg:col-span-2 bg-white border border-gray-100 rounded-3xl p-8 shadow-lg shadow-gray-200/40 flex flex-col min-h-[400px]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900">Traffic & Engagement</h3>
              <p className="text-sm text-gray-500 mt-1">Visitor activity over the last 7 days</p>
            </div>
            <select className="bg-gray-50 border border-gray-200 text-sm rounded-xl px-4 py-2 font-medium text-gray-700 outline-none focus:border-bcr-blue focus:ring-2 focus:ring-bcr-blue/20 transition-all cursor-pointer">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          
          <div className="flex-1 flex flex-col justify-end gap-2 px-4 pb-4 border-b border-l border-gray-100 relative h-full">
            {/* Dummy Bar Chart */}
            <div className="flex items-end justify-between h-48 mt-auto w-full gap-2 sm:gap-4">
              {[40, 70, 45, 90, 65, 85, 100].map((height, i) => (
                <div key={i} className="w-full flex flex-col items-center gap-2 group">
                  <div className="w-full bg-blue-100 rounded-t-lg relative overflow-hidden group-hover:bg-blue-200 transition-colors" style={{ height: `${height}%` }}>
                    <div className="absolute bottom-0 left-0 right-0 bg-bcr-blue rounded-t-lg transition-all duration-500 ease-out" style={{ height: '0%', animation: `growUp 1s ease-out forwards ${i * 0.1}s` }} />
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i]}
                  </span>
                </div>
              ))}
            </div>
            {/* Inline keyframes for the bar chart animation */}
            <style>{`
              @keyframes growUp {
                from { height: 0%; }
                to { height: 100%; }
              }
            `}</style>
          </div>
        </div>
        
        {/* Side Widget */}
        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-lg shadow-gray-200/40 flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-bcr-blue" /> Recent Activity
            </h3>
          </div>
          <div className="space-y-6 flex-1">
            {[
              { text: 'New inquiry received', time: '1 hour ago', type: 'inquiry' },
              { text: 'Product updated', time: '3 hours ago', type: 'product' },
              { text: 'Category added', time: '5 hours ago', type: 'category' },
              { text: 'System backup completed', time: '1 day ago', type: 'system' },
            ].map((activity, i) => (
              <div key={i} className="flex gap-4 relative">
                {i !== 3 && <div className="absolute left-5 top-10 bottom-[-24px] w-0.5 bg-gray-100"></div>}
                <div className="relative z-10 shrink-0">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md
                    ${activity.type === 'inquiry' ? 'bg-orange-500' : 
                      activity.type === 'product' ? 'bg-blue-500' : 
                      activity.type === 'category' ? 'bg-purple-500' : 'bg-gray-400'}`}>
                    {activity.type === 'inquiry' && <MessageSquare className="w-5 h-5" />}
                    {activity.type === 'product' && <Package className="w-5 h-5" />}
                    {activity.type === 'category' && <Grid className="w-5 h-5" />}
                    {activity.type === 'system' && <Activity className="w-5 h-5" />}
                  </div>
                </div>
                <div className="pt-2">
                  <p className="text-sm font-bold text-gray-900">{activity.text}</p>
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3.5 text-sm font-bold text-bcr-blue bg-blue-50 hover:bg-bcr-blue hover:text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
            View All Activity <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
