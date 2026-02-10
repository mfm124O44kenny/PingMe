// importation de modules
import fs from "fs";
import dgram from "dgram";

export function detectActiveIP() {
  return new Promise((resolve) => {
    const socket = dgram.createSocket("udp4");

    // adresse publique (pas besoin qu'elle réponde)
    socket.connect(53, "8.8.8.8", () => {
      const address = socket.address();
      socket.close();

      if (address && address.address) {
        if(address.address == "0.0.0.0") {
        resolve("127.0.0.1");
        } else {resolve(address.address);}
      } else {
        resolve("127.0.0.1");
      }
    });

    socket.on("error", () => {
      resolve("127.0.0.1");
    });
  });
}

export async function writeEnvFile({ host, port }) {
    const content = `HOST="${host}"\nPORT="${port}"\nJWT_SECRET="${process.env.JWT_SECRET}"\nMONGODB_URI="${process.env.MONGODB_URI}"`;
    fs.writeFileSync(".env", content, { flag: "w" });
    console.log(`✅ Fichier .env mis à jour [HOST=${host}, PORT=${port}]`);
  }
