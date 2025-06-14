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
// import CreateAdmin from "./components/MockTest/page/CreateAdmin"; // ✅ Add this


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
//             <Route path="/accounts" element={<Account />} />

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

//             <Route path="/solution/:resultId" element={<SolutionPage />} />
//             <Route path="/test-overview/:testId" element={<TestOverview />} />
//             <Route path="/full-report/:resultId" element={<FullReportPage />} />
//             <Route path="/report/:resultId" element={<QuestionReportPage />} />
//             <Route path="/report/:resultId/score-time" element={<ScoreTimeReportPage />} />
//             <Route path="/report/:resultId/difficulty-analysis" element={<DifficultlyAnalysisReport />} />
//             <Route path="/" element={<HomePage />} /> {/* Homepage */}

//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password/:token" element={<ResetPassword />} />

//             <Route
//   path="/create-admin"
//   element={
//     <ProtectedRoute allowedRoles={["superAdmin"]}>
//       <CreateAdmin />
//     </ProtectedRoute>
//   }
// />


//             {/* 🔹 Redirect to SignIn for Unknown Routes */}
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
import SuperAdminDashboard from "./components/MockTest/page/SuperAdminDashboard"; // ✅ MISSING
import AllAdmins from "./components/MockTest/page/AllAdmins"; // ✅ MISSING
import PaymentButton from './components/PaymentButton';

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

const AppRoutes = () => {
    const { user } = useContext(AuthContext);

    return (
        <Routes>
            {/* 🔹 Public Routes */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/add-user" element={<AddUserForm />} />
            <Route path="/accounts" element={<Account />} />

            {/* 🔹 Admin & SuperAdmin Protected Routes */}
            <Route
                path="/admin-dashboard"
                element={
                    <ProtectedRoute allowedRoles={["Admin", "SuperAdmin"]}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/student-dashboard"
                element={
                    <ProtectedRoute allowedRoles={["Student", "Admin", "SuperAdmin"]}>
                        <StudentDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/teacher-dashboard"
                element={
                    <ProtectedRoute allowedRoles={["Teacher", "Admin", "SuperAdmin"]}>
                        <TeacherDashboard />
                    </ProtectedRoute>
                }
            />

            {/* 🔹 Public Mock Test Routes */}
            <Route path="/mock-tests" element={<MockTestPage />} />

            {/* 🔹 Create Mock Test Route (Allow Admin + Teacher + SuperAdmin) */}
            <Route
                path="/create-mock-test"
                element={
                    user && ["admin", "teacher", "superadmin"].includes(user.role?.toLowerCase()) ? (
                        <CreateMockTest />
                    ) : (
                        <Navigate to="/unauthorized" />
                    )
                }
            />

            {/* 🔹 Exam Route (Restricted to All Auth Roles) */}
            <Route
                path="/exam/:testId"
                element={
                    <ProtectedRoute allowedRoles={["Student", "Admin", "Teacher", "Management", "SuperAdmin"]}>
                        <Exam />
                    </ProtectedRoute>
                }
            />

            {/* 🔹 Profile Route */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={["Admin", "Teacher", "Student", "SuperAdmin"]}>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />

            {/* 🔹 SuperAdmin Routes */}
            <Route
                path="/superadmin-dashboard"
                element={
                    <ProtectedRoute allowedRoles={["superAdmin"]}>
                        <SuperAdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/create-admin"
                element={
                    <ProtectedRoute allowedRoles={["superAdmin"]}>
                        <CreateAdmin />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/all-admins"
                element={
                    <ProtectedRoute allowedRoles={["superAdmin"]}>
                        <AllAdmins />
                    </ProtectedRoute>
                }
            />

            {/* 🔹 Reports & Solution */}
            <Route path="/solution/:resultId" element={<SolutionPage />} />
            <Route path="/test-overview/:testId" element={<TestOverview />} />
            <Route path="/full-report/:resultId" element={<FullReportPage />} />
            <Route path="/report/:resultId" element={<QuestionReportPage />} />
            <Route path="/report/:resultId/score-time" element={<ScoreTimeReportPage />} />
            <Route path="/report/:resultId/difficulty-analysis" element={<DifficultlyAnalysisReport />} />

            <Route path="/" element={<HomePage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
             <Route path="/buy-test" element={<PaymentButton />} />
            {/* 🔹 Catch-all */}
            <Route path="*" element={<SignIn />} />
        </Routes>
    );
};

export default App;
