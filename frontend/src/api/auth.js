import api from "./index";
/**
 * Simulate a login request.
* @param {string} email
 * @param {string} password 
 * @returns {Promise<{ user: object }>}
 */
export async function loginUser(email, password) {
  try {
    const res = await api.post("/user/login", {
      email, password
    });
    return res.data;
  } catch (error) {
    // 🔥 Extract backend message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }

    throw new Error("Login failed");
  }
}

/**
 * Simulate a signup request.
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {Promise<{ user: object }>}
 */
export async function signupUser(name, email, password) {
  try {
    const res = await api.post("/user/signup", {
      // method: "POST",
      // headers: {
      //   "Content-Type": "application/json"
      // },
      // credentials: "include", // 🔥 important for cookies
      // body: JSON.stringify({ name, email, password })
      name, email, password
    });

    //   const data = await res.json();

    //   if (!res.ok) {
    //     throw new Error(data.message || "Signup failed");
    // }
    return res.data;

  } catch (error) {
    // 🔥 Extract backend message
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message);
    }

    throw new Error("SignUp failed");
  }

}

export const checkAuthStatus = async () => {
  const res = await api.get("/user/auth-status");
  // const data = await res.data;
  return res.data;
};
