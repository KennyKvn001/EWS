import React from 'react';
import { 
  GraduationCap, 
  BarChart2, 
  Brain, 
  Shield, 
  TrendingUp,
  Activity,
  Calculator,
  Users
} from 'lucide-react';
import { ModeToggle } from '@/components/myui/ThemeToggle';

interface LandingPageProps {
  children: React.ReactNode;
}

export default function LandingPage({ children }: LandingPageProps) {
  return (
    <div className="min-h-screen w-full flex overflow-hidden bg-background text-foreground transition-colors duration-300">
      
      {/* Left Side - System Information & Visuals */}
      <div className="hidden lg:flex lg:w-[55%] relative bg-gradient-to-br from-[#2563eb] to-[#1e40af] overflow-hidden flex-col justify-between p-12 text-white">
        
        {/* Background Elements */}
        <div className="absolute inset-0 z-0">
           <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl"></div>
           <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/5 rounded-full -ml-10 -mb-10 blur-2xl"></div>
           <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 mix-blend-overlay"></div>
        </div>

        {/* Brand Header */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm shadow-inner border border-white/10">
            <GraduationCap className="size-7 text-white" />
          </div>
          <div>
             <h1 className="text-2xl font-bold tracking-tight text-white">
              EWS ProjectML
            </h1>
            <p className="text-sm text-blue-100 font-medium">
              Early Warning System
            </p>
          </div>
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-xl space-y-10 my-auto">
          
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm font-medium backdrop-blur-md">
              <Activity className="size-4" />
              <span>Student Risk Management</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold leading-tight tracking-tight text-white">
              Data-Driven Student Success
            </h2>
            <p className="text-lg text-blue-100 leading-relaxed">
              Leverage advanced machine learning to predict academic outcomes. Monitor risk indicators, run what-if simulations, and intervene early to ensure student success.
            </p>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
             <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors">
                <div className="p-2 rounded-lg bg-white/20">
                  <Brain className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Risk Prediction</h3>
                  <p className="text-xs text-blue-100 mt-1">ML-powered forecasting for individual and batch student data.</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors">
                <div className="p-2 rounded-lg bg-white/20">
                  <Calculator className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">What-If Scenarios</h3>
                  <p className="text-xs text-blue-100 mt-1">Simulate parameter changes to see impact on risk levels.</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors">
                <div className="p-2 rounded-lg bg-white/20">
                  <Users className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Student Management</h3>
                  <p className="text-xs text-blue-100 mt-1">Comprehensive records with tuition, scholarship, and grade tracking.</p>
                </div>
             </div>

             <div className="flex items-start gap-4 p-4 rounded-xl bg-white/10 border border-white/10 backdrop-blur-sm hover:bg-white/15 transition-colors">
                <div className="p-2 rounded-lg bg-white/20">
                  <BarChart2 className="size-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white">Performance Trends</h3>
                  <p className="text-xs text-blue-100 mt-1">Visualize academic progress and risk distribution over time.</p>
                </div>
             </div>
          </div>
        </div>

        {/* Footer Text */}
        <div className="relative z-10">
          <p className="text-xs text-blue-200/80">
             © {new Date().getFullYear()} EWS ProjectML. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right Side - Authentication Form Container */}
      <div className="w-full lg:w-[45%] flex flex-col relative overflow-y-auto bg-background">
        
        {/* Theme Toggle - Top Right */}
        <div className="absolute top-6 right-6 z-20">
          <ModeToggle />
        </div>

        {/* Content Area */}
        <div className="flex-1 flex items-center justify-center p-4 md:p-8 lg:p-12">
           {children}
        </div>
      </div>

    </div>
  );
}
