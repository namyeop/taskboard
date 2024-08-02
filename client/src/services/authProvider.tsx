import React, { createContext, useState, ReactNode, useEffect } from "react";

export interface AuthContextType {
	isLoggedIn: boolean;
	setIsLoggedIn: (isLoggedIn: boolean) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
	undefined,
);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
	children,
}) => {
	const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
		return sessionStorage.getItem("isLoggedIn") === "true";
	});

	useEffect(() => {
		sessionStorage.setItem("isLoggedIn", String(isLoggedIn));
	}, [isLoggedIn]);

	return (
		<AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
			{children}
		</AuthContext.Provider>
	);
};
