import axios from "axios";

const isRefreshing = false;
const refreshSubscribers: ((token: string) => void)[] = [];

const onRrefreshed = (token: string) => {
	refreshSubscribers.map((callback) => callback(token));
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
	refreshSubscribers.push(callback);
};

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

axios.interceptors.request.use(
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

// Response interceptor
axios.interceptors.response.use(
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
			if (!isRefreshing) {
				isRefreshing = true;
				refreshToken().then((newToken) => {
					isRefreshing = false;
					onRrefreshed(newToken);
					refreshSubscribers = [];
				});
			}

			const retryOriginalRequest = new Promise((resolve) => {
				addRefreshSubscriber((token: string) => {
					originalRequest.headers.Authorization = "Bearer " + token;
					resolve(axios(originalRequest));
				});
			});
			return retryOriginalRequest;
		}
		return Promise.reject(error);
	},
);

export default axios;
