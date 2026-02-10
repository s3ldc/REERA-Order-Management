import PocketBase from "pocketbase";

const pb = new PocketBase(import.meta.env.VITE_PB_URL);

console.log("PB URL:", import.meta.env.VITE_PB_URL);

export default pb;