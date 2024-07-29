export const jwtConfig = {
	jwtSecret: process.env.JWT_SECRET || "secret",
	jwtRefreshSecret: process.env.JWT_REFRESH || "refresh",
};
