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
				</Routes>
			</Router>
		</AuthProvider>
	);
}

export default App;
