const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			currentUserEmail: null,
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try {
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				} catch (error) {
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},

			getCurrentUserEmail: async () => {
				const response = await fetch("https://3001-4geeksacade-reactflaskh-1gboru965s5.ws-eu111.gitpod.io/api/user", {
					headers: {
						"Authorization": "Bearer" + localStorage.getItem("token")
					}
				});
				const data = await response.json();
				if (response.ok) setStore({ currentUserEmail: data.email });

			}
		}
	};
};

export default getState;
