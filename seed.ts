import "dotenv/config";
import { pbkdf2Sync, randomBytes, timingSafeEqual } from "crypto";
import { getAllExercises, getActiveQuiz, getUserByEmail, createUser } from "./server/db";

const ADMIN_EMAIL = "admin@oncoliving.com.br";
const ADMIN_PASSWORD = "senha123";

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(stored: string | null | undefined, password: string) {
  if (!stored) return false;
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const testHash = pbkdf2Sync(password, salt, 100_000, 64, "sha512").toString("hex");
  return timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(testHash, "hex"));
}

async function seed() {
  console.log("🌱 Seeding MongoDB...");

  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI não está definido no .env");
    process.exit(1);
  }

  // Ensure admin exists (same default as server auth bootstrap)
  const existingAdmin = await getUserByEmail(ADMIN_EMAIL);
  if (!existingAdmin) {
    await createUser({
      openId: ADMIN_EMAIL,
      email: ADMIN_EMAIL,
      name: "Admin OncoLiving",
      passwordHash: hashPassword(ADMIN_PASSWORD),
      role: "ONCOLOGIST",
      loginMethod: "password",
      hasActivePlan: true,
      hasCompletedAnamnesis: true,
    });
    console.log(`✅ Admin criado: ${ADMIN_EMAIL}`);
  } else {
    const ok = verifyPassword(existingAdmin.passwordHash ?? null, ADMIN_PASSWORD);
    console.log(`ℹ️ Admin já existe: ${ADMIN_EMAIL}${ok ? " (senha padrão OK)" : ""}`);
  }

  const quiz = await getActiveQuiz();
  if (quiz) console.log(`✅ Quiz ativo: #${quiz.id} (${quiz.name})`);

  const exercises = await getAllExercises();
  console.log(`✅ Exercícios: ${exercises.length}`);

  console.log("✅ Seed finalizado.");
}

seed().catch((err) => {
  console.error("❌ Seed falhou:", err);
  process.exit(1);
});

