import couchbase from "couchbase";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import YAML from "yaml";
// === Setup __dirname in ESM ===
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// === Load config.yml from project root ===
const configPath = path.resolve(__dirname, "../../config.yml");
const file = fs.readFileSync(configPath, "utf8");
const config = YAML.parse(file);
// === Connect to Couchbase ===
const cluster = await couchbase.connect(config.database.connectionString, {
    username: config.database.username,
    password: config.database.password,
    configProfile: "wanDevelopment",
    timeouts: {
        kvTimeout: 10 * 1000,
        queryTimeout: 20 * 1000,
    },
});
const bucket = cluster.bucket(config.database.bucket);
const collection = bucket.defaultCollection();
/**
 * Insert or update a tempban
 */
export async function addTempban(userId, guildId, unbanAt, reason) {
    const docId = `tempban::${guildId}::${userId}`;
    await collection.upsert(docId, {
        type: "tempban",
        userId,
        guildId,
        unbanAt,
        reason: reason ?? null,
    });
    return docId;
}
/**
 * Insert a new warning
 */
export async function addWarning(userId, guildId, moderator, reason) {
    const docId = `warning::${guildId}::${userId}::${Date.now()}`;
    await collection.insert(docId, {
        type: "warning",
        userId,
        guildId,
        moderator,
        reason,
        timestamp: new Date().toISOString(),
    });
    return docId;
}
/**
 * Get all warnings for a user
 */
export async function getWarning(userId, guildId) {
    const query = `
    SELECT META().id, \`${config.database.bucket}\`.*
    FROM \`${config.database.bucket}\`
    WHERE type = "warning"
      AND userId = $userId
      AND guildId = $guildId
    ORDER BY timestamp DESC
  `;
    const result = await cluster.query(query, {
        parameters: { userId, guildId },
    });
    return result.rows;
}
/**
 * Get all tempbans in a guild
 */
export async function getTempban(guildId) {
    const query = `
    SELECT META().id, \`${config.database.bucket}\`.*
    FROM \`${config.database.bucket}\`
    WHERE type = "tempban"
      AND guildId = $guildId
    ORDER BY unbanAt ASC
  `;
    const result = await cluster.query(query, {
        parameters: { guildId },
    });
    return result.rows;
}
/**
 * clear warning
 */
export async function clearWarnings(userId, guildId) {
    const query = `
    SELECT META().id
    FROM \`${config.database.bucket}\`
    WHERE type = "warning"
      AND userId = $userId
      AND guildId = $guildId
  `;
    const result = await cluster.query(query, {
        parameters: { userId, guildId },
    });
    for (const row of result.rows) {
        await collection.remove(row.id);
    }
    return result.rows.length; // number of docs removed
}
/**
 * remove tempban
 */
export async function removeTempban(userId, guildId) {
    const docId = `tempban::${guildId}::${userId}`;
    try {
        await collection.remove(docId);
        return true;
    }
    catch (err) {
        if (err instanceof couchbase.DocumentNotFoundError) {
            return false;
        }
        throw err;
    }
}
