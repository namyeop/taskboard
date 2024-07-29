module.exports = {
	preset: "ts-jest",
	testEnvironment: "node",
	testMatch: ["**/?(*.)+(spec|test).[jt]s?(x)"],
	moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageReporters: ["json", "lcov", "text", "clover"],
};
