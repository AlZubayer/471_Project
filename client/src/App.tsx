import { Toaster } from "react-hot-toast";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import { AuthProvider } from "./Context/AuthContext";
import Navbar from "./components/Navbar/Navbar";
import Login from "./components/Login/Login";
import Signup from "./components/Signup/Signup";
import Admin from "./components/Admin/Admin";
import ManageUsers from "./components/Admin/ManageUsers/ManageUsers";
import ManageGroups from "./components/Admin/ManageGroups/ManageGroups";
import NewPost from "./components/NewPost/NewPost";
import NewReport from "./components/Report/NewReport";
import ManageReport from "./components/Admin/ManageReports/ManageReports";
import ManageAnalytics from "./components/Admin/ManageAnalytics/ManageAnalytics";

function App() {
	return (
		<AuthProvider>
			<Router>
				<Toaster />
				<Navbar />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/login" element={<Login />} />
					<Route path="/signup" element={<Signup />} />
					<Route path="/admin" element={<Admin />} />
					<Route
						path="/admin/manage-users"
						element={<ManageUsers />}
					/>
					<Route
						path="/admin/manage-groups"
						element={<ManageGroups />}
					/>
					<Route path="/new-post" element={<NewPost />} />
					<Route path="/report/:id" element={<NewReport />} />
					<Route
						path="/admin/manage-reports"
						element={<ManageReport />}
					/>
					<Route
						path="/admin/analytics"
						element={<ManageAnalytics />}
					/>
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
