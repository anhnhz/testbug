const { createClient } = require("redis");

async function connectBull(url) {
    const client = createClient({ url });
    client.on("error", (e) => console.error("[bull-redis] error", e));
    await client.connect();
    return client;
}

module.exports = { connectBull };
