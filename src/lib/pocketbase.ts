import PocketBase from "pocketbase";

const pb = new PocketBase("http://127.0.0.1:8090");

// 🔐 SUPERUSER LOGIN ON APP START (TEMP FOR MVP)
pb.admins
  .authWithPassword("admin@example.com", "12345678")
  .then(() => {
    console.log("Superuser authenticated");
  })
  .catch((err) => {
    console.error("Superuser auth failed", err);
  });

export default pb;
