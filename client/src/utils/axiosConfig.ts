import axios from "axios";

const refreshToken = async () => {
	const refreshToken = localStorage.getItem("refreshToken");

	if (refreshToken) {
		axios
			.post("http://localhost:3000/refreshToken", {
				refreshToken,
			})
			.then((res) => {
				if (res.status === 200) {
					const token = res.data.token;
					const refreshToken = res.data.refreshToken;
					localStorage.setItem("token", token);
					localStorage.setItem("refreshToken", refreshToken);
				}
			});
	} else {
		localStorage.clear();
	}
};

const authAxios = axios.create();

authAxios.interceptors.request.use(
	(config) => {
		const token = localStorage.getItem("token");
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error) => {
		return Promise.reject(error);
	},
);

authAxios.interceptors.response.use(
	(response) => {
		return response;
	},
	(error) => {
		const {
			config,
			response: { status },
		} = error;
		const originalRequest = config;

		if (status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;
			try {
				const token = refreshToken();
				originalRequest.headers.Authorization = "Bearer " + token;
				return axios(originalRequest);
			} catch (error) {
				window.location.href = "/signin";
				return Promise.reject(error);
			}
		}
		return Promise.reject(error);
	},
);

export default authAxios;
