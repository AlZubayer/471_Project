import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
	user: User | null;
	isLoading: boolean;
	login: (userData: User) => void;
	logout: () => void;
}

interface User {
	id: string;
	name: string;
	email: string;
	userType: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [user, setUser] = useState<User | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const storedUser = localStorage.getItem("authUser");
		if (storedUser) {
			setUser(JSON.parse(storedUser));
		}
		setIsLoading(false);
	}, []);

	const login = (userData: User) => {
		setUser(userData);
		localStorage.setItem("authUser", JSON.stringify(userData));
	};

	const logout = () => {
		setUser(null);
		localStorage.removeItem("authUser");
	};

	return (
		<AuthContext.Provider value={{ user, isLoading, login, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = (): AuthContextType => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error("useAuth must be used within an AuthProvider");
	}
	return context;
};
