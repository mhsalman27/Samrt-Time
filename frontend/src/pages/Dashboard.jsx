import React, { useEffect, useState } from "react";
import {
  RefreshCw,
  Users,
  BookOpen,
  Building2,
  Calendar,
  CalendarDays,
  Sparkles,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Info,
  XCircle,
  ChevronRight,
  Activity,
  Zap
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  let navigate=useNavigate();
  const [stats, setStats] = useState({
    teachers: 4,
    subjects: 6,
    rooms: 6,
    schedules: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [error, setError] = useState(null);

  // Simulate API fetch
  const fetchDashboardData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setStats({
        teachers: 4,
        subjects: 6,
        rooms: 6,
        schedules: 0,
      });

      // Generate activities based on simulated data
      const activities = [
        {
          type: 'success',
          message: '4 teachers registered',
          time: '2 hours ago',
          icon: Users,
        },
        {
          type: 'info',
          message: '6 subjects available',
          time: '4 hours ago',
          icon: BookOpen,
        },
        {
          type: 'warning',
          message: '6 rooms configured',
          time: '6 hours ago',
          icon: Building2,
        },
        {
          type: 'success',
          message: 'System backup completed successfully',
          time: '1 day ago',
          icon: CheckCircle2,
        },
      ];
      
      setRecentActivities(activities);
    } catch (err) {
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = () => {
    fetchDashboardData();
  };

  const handleNavigate = (path) => {
   navigate(path)
    // In your actual app, replace with: navigate(path);
  };

  const statCards = [
    {
      title: "Teachers",
      value: stats.teachers,
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      link: "/teachers",
      growth: "+5%",
      borderColor: "border-blue-200"
    },
    {
      title: "Subjects",
      value: stats.subjects,
      icon: BookOpen,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
      iconColor: "text-emerald-600",
      link: "/subjects",
      growth: "+12%",
      borderColor: "border-emerald-200"
    },
    {
      title: "Rooms",
      value: stats.rooms,
      icon: Building2,
      color: "from-rose-500 to-rose-600",
      bgColor: "bg-rose-50",
      iconColor: "text-rose-600",
      link: "/rooms",
      growth: "+3%",
      borderColor: "border-rose-200"
    },
    {
      title: "Active Schedules",
      value: stats.schedules,
      icon: Calendar,
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      link: "/schedules",
      growth: "0%",
      borderColor: "border-purple-200"
    },
  ];

  const getActivityIcon = (type, IconComponent) => {
    const iconProps = "w-5 h-5";
    switch (type) {
      case 'success':
        return <IconComponent className={`${iconProps} text-green-500`} />;
      case 'warning':
        return <IconComponent className={`${iconProps} text-amber-500`} />;
      case 'error':
        return <IconComponent className={`${iconProps} text-red-500`} />;
      case 'info':
        return <IconComponent className={`${iconProps} text-blue-500`} />;
      default:
        return <IconComponent className={`${iconProps} text-gray-500`} />;
    }
  };

  const SkeletonCard = () => (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="h-3 bg-gray-200 rounded w-20 mb-4"></div>
          <div className="h-8 bg-gray-200 rounded w-12 mb-3"></div>
          <div className="h-3 bg-gray-200 rounded w-32"></div>
        </div>
        <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
      </div>
    </div>
  );

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
        <div className="max-w-2xl mx-auto pt-20">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6 shadow-sm">
            <div className="flex items-center gap-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-red-900 mb-1">Error Loading Dashboard</h3>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/30 p-4 md:p-8">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 mb-8 shadow-xl shadow-black/5">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              🎓 Smart Timetable Dashboard
            </h1>
            <p className="text-lg text-slate-600 font-medium">
              Welcome to your intelligent classroom scheduling system
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavigate('/timetables')}
              className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
            >
              <CalendarDays className="w-4 h-4" />
              View Timetables
            </button>
            <button
              onClick={() => handleNavigate('/generate-timetable')}
              className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Sparkles className="w-4 h-4" />
              Generate Timetable
            </button>
            <button
              onClick={handleRefresh}
              className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div key={index} className="group">
              {loading ? (
                <SkeletonCard />
              ) : (
                <div
                  onClick={() => handleNavigate(card.link)}
                  className={`bg-white rounded-2xl border ${card.borderColor} p-6 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl shadow-sm relative overflow-hidden group-hover:scale-[1.02]`}
                >
                  {/* Gradient border top */}
                  <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${card.color}`}></div>
                  
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">
                        {card.title}
                      </p>
                      <p className="text-3xl font-bold text-slate-900 mb-3">
                        {card.value}
                      </p>
                      <div className="flex items-center gap-1.5 text-sm">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="font-semibold text-green-600">{card.growth}</span>
                        <span className="text-slate-500">from last month</span>
                      </div>
                    </div>
                    
                    <div className={`w-14 h-14 ${card.bgColor} rounded-xl flex items-center justify-center shadow-sm`}>
                      <IconComponent className={`w-7 h-7 ${card.iconColor}`} />
                    </div>
                  </div>
                  
                  <ChevronRight className="absolute bottom-4 right-4 w-5 h-5 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-slate-600" />
                  <h2 className="text-xl font-bold text-slate-900">Recent System Activity</h2>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  Live
                </div>
              </div>
            </div>

            <div className="divide-y divide-slate-100">
              {loading ? (
                <div className="p-6 space-y-4">
                  {[1, 2, 3, 4].map((item) => (
                    <div key={item} className="flex items-center gap-4 animate-pulse">
                      <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-2/3 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                recentActivities.map((activity, index) => {
                  const IconComponent = activity.icon;
                  return (
                    <div key={index} className="p-6 hover:bg-slate-50 transition-colors group">
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          activity.type === 'success' ? 'bg-green-100' :
                          activity.type === 'warning' ? 'bg-amber-100' :
                          activity.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
                        }`}>
                          {getActivityIcon(activity.type, IconComponent)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-slate-900 group-hover:text-slate-700">
                            {activity.message}
                          </p>
                          <p className="text-sm text-slate-500 mt-1">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6">
            <div className="flex items-center gap-3 mb-6">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900">Quick Actions</h2>
            </div>

            <div className="space-y-3 mb-6">
              <button
                onClick={() => handleNavigate('/generate-timetable')}
                className="w-full flex items-center gap-3 px-4 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl font-medium hover:from-blue-700 hover:to-blue-800 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Sparkles className="w-5 h-5" />
                Generate Smart Timetable
              </button>
              
              <button
                onClick={() => handleNavigate('/teachers')}
                className="w-full flex items-center gap-3 px-4 py-4 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                <Users className="w-5 h-5" />
                Manage Teachers
              </button>
              
              <button
                onClick={() => handleNavigate('/subjects')}
                className="w-full flex items-center gap-3 px-4 py-4 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                <BookOpen className="w-5 h-5" />
                Manage Subjects
              </button>
              
              <button
                onClick={() => handleNavigate('/rooms')}
                className="w-full flex items-center gap-3 px-4 py-4 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
              >
                <Building2 className="w-5 h-5" />
                Manage Rooms
              </button>
            </div>

            {/* Pro Tip */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-amber-600 font-bold text-sm">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-amber-900 text-sm mb-1">Pro Tip</h3>
                  <p className="text-amber-800 text-sm leading-relaxed">
                    Use the AI-powered timetable generator for optimal scheduling with conflict resolution.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;