import { auth } from "../../paths";

export default async function getUser() {
    try {
        const res = await fetch(auth.me, {
            method: 'GET',
            credentials: 'include'
        });
        if (!res.ok) {
            throw new Error("Something went wrong fetching user...");
        }
        const { user } = await res.json();
        return user;
    } catch {
        return null;
    }
}