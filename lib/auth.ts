import Cookies from "js-cookie";

export const setToken = (token: string) => {
  Cookies.set("token", token, { expires: 7, path: "/", secure: true });
};

export const getToken = (): string | undefined => {
  return Cookies.get("token");
};

export const removeToken = () => {
  Cookies.remove("token", { path: "/" });
};

export const setRole = (role: string) => {
  Cookies.set("role", role, { expires: 7, path: "/", secure: true });
};

export const getRole = (): string | undefined => {
  return Cookies.get("role");
};

export const removeRole = () => {
  Cookies.remove("role", { path: "/" });
};

export const setProfile = (profile: any) => {
  const profileString = JSON.stringify(profile);
  Cookies.set("profile", profileString, {
    expires: 7,
    path: "/",
    secure: true,
  });
};

export const getProfile = (): any | null => {
  const profileString = Cookies.get("profile");
  if (!profileString) {
    return null;
  }
  try {
    return JSON.parse(profileString);
  } catch (error) {
    console.error("Gagal parse profile dari cookie:", error);
    return null;
  }
};

export const removeProfile = () => {
  Cookies.remove("profile", { path: "/" });
};
