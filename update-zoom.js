const fs = require("fs");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const envPath = "./.env";

rl.question("👉 Nouveau numéro de Zoom Room : ", (zoomId) => {
  const newRoomLink = `ROOM_REAL=https://zoom.us/j/${zoomId}`;

  let envContent = fs.readFileSync(envPath, "utf8");

  envContent = envContent.replace(
    /^ROOM_REAL=.*$/m,
    newRoomLink
  );

  fs.writeFileSync(envPath, envContent);
  console.log(`✅ ROOM_REAL mis à jour : ${newRoomLink}`);
  rl.close();
});