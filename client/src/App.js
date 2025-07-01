// import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
// import { useContext } from "react";
// import AuthProvider, { AuthContext } from "./components/MockTest/context/AuthContext";
// import SignIn from "./components/MockTest/page/SignIn";
// import SignUp from "./components/MockTest/page/SignUp";
// import AdminDashboard from "./components/MockTest/page/AdminDashboard";
// import ProtectedRoute from "./components/MockTest/protectedroutes/ProtectedRoute";
// import MockTestPage from "./components/MockTest/page/MockTestPage";
// import CreateMockTest from "./components/MockTest/page/CreateMockTest";
// import Exam from "./components/MockTest/page/Exam";
// import ProfilePage from "./components/MockTest/page/ProfilePage";
// import AddUserForm from "./components/MockTest/page/AddUserForm";
// import TeacherDashboard from "./components/MockTest/page/TeacherDashboard";
// import StudentDashboard from "./components/MockTest/page/StudentDashboard";
// import Account from "./components/MockTest/page/Accounts";
// import ForgotPassword from "./components/MockTest/page/ForgotPassword";
// import ResetPassword from "./components/MockTest/page/ResetPassword";
// import SolutionPage from './components/MockTest/page/SolutionPage';
// import TestOverview from "./components/MockTest/page/TestOverview";
// import { ToastContainer } from "react-toastify";
// import FullReportPage from "./components/MockTest/page/FullReportPage";
// import QuestionReportPage from "./components/MockTest/page/QuestionReportPage";
// import ScoreTimeReportPage from "./components/MockTest/page/ScoreTimeReportPage";
// import DifficultlyAnalysisReport from "./components/MockTest/page/DifficultyAnalysisReport";
// import HomePage from './components/MockTest/page/HomePage';
// import CreateAdmin from "./components/MockTest/page/CreateAdmin";
// import SuperAdminDashboard from "./components/MockTest/page/SuperAdminDashboard"; // ✅ MISSING
// import AllAdmins from "./components/MockTest/page/AllAdmins"; // ✅ MISSING
// import PaymentButton from './components/PaymentButton';
// import WeakTopicsSection from "./components/MockTest/page/WeakTopicsSection";

// function App() {
//     return (
//         <Router>
//             <AuthProvider>
//                 <AppRoutes />
//                 <ToastContainer position="top-center" />
//             </AuthProvider>
//         </Router>
//     );
// }

// const AppRoutes = () => {
//     const { user } = useContext(AuthContext);

//     return (
//         <Routes>
//             {/* 🔹 Public Routes */}
//             <Route path="/signin" element={<SignIn />} />
//             <Route path="/signup" element={<SignUp />} />
//             <Route path="/add-user" element={<AddUserForm />} />
//             <Route path="/users" element={<Account />} />

//             {/* 🔹 Admin & SuperAdmin Protected Routes */}
//             <Route
//                 path="/admin-dashboard"
//                 element={
//                     <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
//                         <AdminDashboard />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/student-dashboard"
//                 element={
//                     <ProtectedRoute allowedRoles={["Student", "Admin", "SuperAdmin"]}>
//                         <StudentDashboard />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/teacher-dashboard"
//                 element={
//                     <ProtectedRoute allowedRoles={["Teacher", "Admin", "SuperAdmin"]}>
//                         <TeacherDashboard />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* 🔹 Public Mock Test Routes */}
//             <Route path="/mock-tests" element={<MockTestPage />} />

//             {/* 🔹 Create Mock Test Route (Allow Admin + Teacher + SuperAdmin) */}
//             <Route
//                 path="/create-mock-test"
//                 element={
//                     user && ["admin", "teacher", "superadmin"].includes(user.role?.toLowerCase()) ? (
//                         <CreateMockTest />
//                     ) : (
//                         <Navigate to="/unauthorized" />
//                     )
//                 }
//             />

//             {/* 🔹 Exam Route (Restricted to All Auth Roles) */}
//             <Route
//                 path="/exam/:testId"
//                 element={
//                     <ProtectedRoute allowedRoles={["Student", "Admin", "Teacher", "Management", "SuperAdmin"]}>
//                         <Exam />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* 🔹 Profile Route */}
//             <Route
//                 path="/profile"
//                 element={
//                     <ProtectedRoute allowedRoles={["Admin", "Teacher", "Student", "SuperAdmin"]}>
//                         <ProfilePage />
//                     </ProtectedRoute>
//                 }
//             />

//             {/* 🔹 SuperAdmin Routes */}
//             <Route
//                 path="/superadmin-dashboard"
//                 element={
//                     <ProtectedRoute allowedRoles={["superAdmin"]}>
//                         <SuperAdminDashboard />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/create-admin"
//                 element={
//                     <ProtectedRoute allowedRoles={["superAdmin"]}>
//                         <CreateAdmin />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/all-admins"
//                 element={
//                     <ProtectedRoute allowedRoles={["superAdmin"]}>
//                         <AllAdmins />
//                     </ProtectedRoute>
//                 }
//             />

//             <Route
//   path="/weak-topic-report"
//   element={
//     <ProtectedRoute allowedRoles={["Student", "Admin", "SuperAdmin"]}>
//       <WeakTopicsSection />
//     </ProtectedRoute>
//   }
// />

//             {/* 🔹 Reports & Solution */}
//             <Route path="/solution/:resultId" element={<SolutionPage />} />
//             <Route path="/test-overview/:testId" element={<TestOverview />} />
//             <Route path="/full-report/:resultId" element={<FullReportPage />} />
//             <Route path="/report/:resultId" element={<QuestionReportPage />} />
//             <Route path="/report/:resultId/score-time" element={<ScoreTimeReportPage />} />
//             <Route path="/report/:resultId/difficulty-analysis" element={<DifficultlyAnalysisReport />} />

//             <Route path="/" element={<HomePage />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password/:token" element={<ResetPassword />} />
//              <Route path="/buy-test" element={<PaymentButton />} />
//             {/* 🔹 Catch-all */}
//             <Route path="*" element={<SignIn />} />
//         </Routes>
//     );
// };

// export default App;






import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthProvider, { AuthContext } from "./components/MockTest/context/AuthContext";
import SignIn from "./components/MockTest/page/SignIn";
import SignUp from "./components/MockTest/page/SignUp";
import AdminDashboard from "./components/MockTest/page/AdminDashboard";
import ProtectedRoute from "./components/MockTest/protectedroutes/ProtectedRoute";
import MockTestPage from "./components/MockTest/page/MockTestPage";
import CreateMockTest from "./components/MockTest/page/CreateMockTest";
import Exam from "./components/MockTest/page/Exam";
import ProfilePage from "./components/MockTest/page/ProfilePage";
import AddUserForm from "./components/MockTest/page/AddUserForm";
import TeacherDashboard from "./components/MockTest/page/TeacherDashboard";
import StudentDashboard from "./components/MockTest/page/StudentDashboard";
import Account from "./components/MockTest/page/Accounts";
import ForgotPassword from "./components/MockTest/page/ForgotPassword";
import ResetPassword from "./components/MockTest/page/ResetPassword";
import SolutionPage from './components/MockTest/page/SolutionPage';
import TestOverview from "./components/MockTest/page/TestOverview";
import { ToastContainer } from "react-toastify";
import FullReportPage from "./components/MockTest/page/FullReportPage";
import QuestionReportPage from "./components/MockTest/page/QuestionReportPage";
import ScoreTimeReportPage from "./components/MockTest/page/ScoreTimeReportPage";
import DifficultlyAnalysisReport from "./components/MockTest/page/DifficultyAnalysisReport";
import HomePage from './components/MockTest/page/HomePage';
import CreateAdmin from "./components/MockTest/page/CreateAdmin";
import SuperAdminDashboard from "./components/MockTest/page/SuperAdminDashboard";
import AllAdmins from "./components/MockTest/page/AllAdmins";
import PaymentButton from './components/PaymentButton';
import UserTopBar from "./components/MockTest/page/UserTopBar";
import SuperAdminAccounts from "./components/MockTest/page/SuperAdminAccount";
 
 
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
        <ToastContainer position="top-center" />
      </AuthProvider>
    </Router>
  );
}
 
// ✅ Wrapper to show UserTopBar only for logged-in pages
const WithUserTopBar = ({ children }) => {
  const { user } = useContext(AuthContext);
  return (
    <>
      {user && <UserTopBar user={user} />}
      {children}
    </>
  );
};
 
const AppRoutes = () => {
  const { user } = useContext(AuthContext);
 
  return (
    <Routes>
      {/* 🔹 Public Routes */}
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
 
      {/* 🔹 Routes with UserTopBar */}
      <Route path="/add-user" element={<WithUserTopBar><AddUserForm /></WithUserTopBar>} />
      <Route path="/users" element={<WithUserTopBar><Account /></WithUserTopBar>} />
 
      <Route
        path="/admin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
            <WithUserTopBar><AdminDashboard /></WithUserTopBar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/student-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Student", "Admin", "SuperAdmin"]}>
            <WithUserTopBar><StudentDashboard /></WithUserTopBar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/teacher-dashboard"
        element={
          <ProtectedRoute allowedRoles={["Teacher", "Admin", "SuperAdmin"]}>
            <WithUserTopBar><TeacherDashboard /></WithUserTopBar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/superadmin-dashboard"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <WithUserTopBar><SuperAdminDashboard /></WithUserTopBar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/create-admin"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <WithUserTopBar><CreateAdmin /></WithUserTopBar>
          </ProtectedRoute>
        }
      />
      <Route
        path="/all-admins"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <WithUserTopBar><AllAdmins /></WithUserTopBar>
          </ProtectedRoute>
        }
      />

        <Route
        path="/superadmin/accounts"
        element={
          <ProtectedRoute allowedRoles={["superAdmin"]}>
            <SuperAdminAccounts />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["Admin", "Teacher", "Student", "SuperAdmin"]}>
            <WithUserTopBar><ProfilePage /></WithUserTopBar>
          </ProtectedRoute>
        }
      />
      <Route path="/mock-tests" element={<WithUserTopBar><MockTestPage /></WithUserTopBar>} />
      <Route path="/buy-test" element={<WithUserTopBar><PaymentButton /></WithUserTopBar>} />
 
      <Route
        path="/create-mock-test"
        element={
          user && ["admin", "teacher", "superadmin"].includes(user.role?.toLowerCase()) ? (
            <WithUserTopBar><CreateMockTest /></WithUserTopBar>
          ) : (
            <Navigate to="/unauthorized" />
          )
        }
      />
      <Route
        path="/exam/:testId"
        element={
          <ProtectedRoute allowedRoles={["Student", "Admin", "Teacher", "Management", "SuperAdmin"]}>
            <WithUserTopBar><Exam /></WithUserTopBar>
          </ProtectedRoute>
        }
      />
 
      {/* 🔹 Reports & Solution */}
      <Route path="/solution/:resultId" element={<WithUserTopBar><SolutionPage /></WithUserTopBar>} />
      <Route path="/test-overview/:testId" element={<WithUserTopBar><TestOverview /></WithUserTopBar>} />
      <Route path="/full-report/:resultId" element={<WithUserTopBar><FullReportPage /></WithUserTopBar>} />
      <Route path="/report/:resultId" element={<WithUserTopBar><QuestionReportPage /></WithUserTopBar>} />
      <Route path="/report/:resultId/score-time" element={<WithUserTopBar><ScoreTimeReportPage /></WithUserTopBar>} />
      <Route path="/report/:resultId/difficulty-analysis" element={<WithUserTopBar><DifficultlyAnalysisReport /></WithUserTopBar>} />
 
      {/* 🔹 Home Page */}
      <Route path="/" element={<HomePage />} />
 
      {/* 🔹 Catch-all */}
      <Route path="*" element={<Navigate to="/signin" />} />
    </Routes>
  );
};
 
export default App;