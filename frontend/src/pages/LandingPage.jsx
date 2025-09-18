import { Link, useNavigate } from "react-router-dom";

const LandingPage = () => {
  let navigate = useNavigate();
  if (localStorage.getItem("sihtoken")) { navigate("/dashboard") }
  
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-indigo-600">Smart Classroom Scheduler</h1>
            <div className="flex gap-4">
              <Link 
                to="/login" 
                className="px-4 py-2 text-slate-700 hover:text-indigo-600 font-medium transition-colors"
              >
                Login
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium transition-colors shadow-sm"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-20 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-100 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100 rounded-full translate-y-1/2 -translate-x-1/2 opacity-60"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl md:text-6xl font-bold text-slate-900 mb-6">
            Smarter Timetables, 
            <span className="text-indigo-600 block">Zero Clashes</span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            Revolutionize your college scheduling with AI-powered timetable generation that eliminates conflicts and optimizes resource utilization
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/signup"
              className="inline-flex px-8 py-4 bg-indigo-600 text-white text-lg font-semibold rounded-lg hover:bg-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Get Started Free
            </Link>
            <button className="inline-flex px-8 py-4 border-2 border-indigo-600 text-indigo-600 text-lg font-semibold rounded-lg hover:bg-indigo-50 transition-all duration-200">
              Watch Demo
            </button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center p-6 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="text-3xl font-bold text-emerald-600 mb-2">99%</div>
              <div className="text-slate-600 font-medium">Conflict Reduction</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-xl border border-blue-100">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-slate-600 font-medium">Colleges Trust Us</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-xl border border-purple-100">
              <div className="text-3xl font-bold text-purple-600 mb-2">2hrs</div>
              <div className="text-slate-600 font-medium">Setup Time</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
              Everything You Need for 
              <span className="text-indigo-600"> Perfect Scheduling</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              From automated conflict detection to resource optimization, we've got your scheduling covered
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Zero Conflicts</h3>
              <p className="text-slate-600 leading-relaxed">Advanced algorithm ensures no scheduling conflicts for rooms, teachers, or students</p>
            </div>
            
            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Lightning Fast</h3>
              <p className="text-slate-600 leading-relaxed">Generate complete timetables in seconds, not hours of manual planning</p>
            </div>
            
            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.57 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.57 4 8 4s8-1.79 8-4M4 7c0-2.21 3.57-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Smart Resource Management</h3>
              <p className="text-slate-600 leading-relaxed">Optimize classroom utilization and teacher assignments automatically</p>
            </div>
            
            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Mobile Access</h3>
              <p className="text-slate-600 leading-relaxed">Access and modify schedules from anywhere with our responsive design</p>
            </div>
            
            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Analytics & Reports</h3>
              <p className="text-slate-600 leading-relaxed">Get insights into resource utilization and scheduling efficiency</p>
            </div>
            
            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow duration-200">
              <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-3">Multi-User Support</h3>
              <p className="text-slate-600 leading-relaxed">Collaborate with your team with role-based access and permissions</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-indigo-600 py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500 rounded-full -translate-y-1/2 -translate-x-1/2 opacity-20"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 rounded-full translate-y-1/2 translate-x-1/2 opacity-20"></div>
        </div>
        
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Scheduling?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of educators who have already streamlined their timetable management
          </p>
          <Link 
            to="/signup"
            className="inline-flex px-8 py-4 bg-white text-indigo-600 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="text-2xl font-bold text-indigo-600 mb-4">Smart Classroom Scheduler</div>
            <div className="flex justify-center space-x-8 mb-6">
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">About</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Features</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Pricing</a>
              <a href="#" className="text-slate-600 hover:text-indigo-600 font-medium transition-colors">Support</a>
            </div>
            <p className="text-slate-500">
              © 2025 Smart Classroom Scheduler. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;