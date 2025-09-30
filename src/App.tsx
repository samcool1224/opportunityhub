import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import React, { useEffect, useState, ReactNode } from "react";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import About from "./pages/About";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Opportunities from "./pages/Opportunities";
import PostOpportunity from "./pages/PostOpportunity";
import StudentRegistration from "./pages/StudentRegistration";
import ProfessorRegistration from "./pages/ProfessorRegistration";
import OrganizationRegistration from "./pages/OrganizationRegistration";
import StudentDashboard from "./pages/StudentDashboard";
import ProfessorDashboard from "./pages/ProfessorDashboard";
import ProfessorApplications from "./pages/ProfessorApplications";
import ReviewApplications from "./pages/ReviewApplications";
import StudentApplications from "./pages/StudentApplications";
import NotFound from "./pages/NotFound";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import UpdatePassword from "./pages/UpdatePassword";
import Applications from "./pages/Applications";

const queryClient = new QueryClient();

// Error Boundary Component
class ErrorBoundary extends React.Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    
    // If it's an authentication error, redirect to home
    if (error.message.includes('auth') || error.message.includes('authentication')) {
      console.warn('Authentication error detected, redirecting to home');
      window.location.href = '/';
    }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-subtle flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 bg-destructive rounded-full"></div>
            </div>
            <h2 className="text-xl font-semibold mb-2">Something went wrong</h2>
            <p className="text-muted-foreground mb-4">We're experiencing some technical difficulties.</p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
            >
              Go to Home
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Scroll to top component
const ScrollToTop = () => {
  const location = useLocation();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null;
};

const App = () => (
  <ErrorBoundary>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/applications" element={<Applications />} />
              <Route path="/opportunities" element={<Opportunities />} />
              <Route path="/opportunities/post" element={<PostOpportunity />} />
              <Route path="/register/student" element={<StudentRegistration />} />
              <Route path="/register/organization" element={<OrganizationRegistration />} />
              <Route path="/register/professor" element={<OrganizationRegistration />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/applications" element={<StudentApplications />} />
              <Route path="/professor/dashboard" element={<ProfessorDashboard />} />
              <Route path="/professor/applications" element={<ProfessorApplications />} />
              <Route path="/professor/review-applications" element={<ReviewApplications />} />
              <Route path="/professor/review-applications/:opportunityId" element={<ReviewApplications />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  </ErrorBoundary>
);

export default App;
