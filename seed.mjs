import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import {
  users,
  patientProfiles,
  quizzes,
  quizQuestions,
  quizQuestionOptions,
  exerciseTutorials,
  quizScoringConfig,
} from "./drizzle/schema";

import { config } from "dotenv";
config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

async function seed() {
  const connection = await mysql.createConnection(DATABASE_URL);
  const db = drizzle(connection);

  console.log("🌱 Starting seed...");

  try {
    // Create test oncologist
    console.log("Creating oncologist...");
    const oncologistResult = await db.insert(users).values({
      openId: "oncologist-test-001",
      email: "dra.silva@oncoliving.local",
      name: "Dra. Silva",
      role: "ONCOLOGIST",
      loginMethod: "local",
    });
    const oncologistId = oncologistResult[0].insertId;

    // Create test patients
    console.log("Creating patients...");
    const patientIds = [];
    const patientEmails = [
      "joao@oncoliving.local",
      "maria@oncoliving.local",
      "carlos@oncoliving.local",
    ];
    const patientNames = ["João Silva", "Maria Santos", "Carlos Costa"];

    for (let i = 0; i < 3; i++) {
      const result = await db.insert(users).values({
        openId: `patient-test-${String(i + 1).padStart(3, "0")}`,
        email: patientEmails[i],
        name: patientNames[i],
        role: "PATIENT",
        loginMethod: "local",
      });
      patientIds.push(result[0].insertId);
    }

    // Create patient profiles
    console.log("Creating patient profiles...");
    const diagnoses = ["Breast Cancer", "Lung Cancer", "Colorectal Cancer"];
    const stages = ["during-chemo", "post-treatment", "during-chemo"];

    for (let i = 0; i < patientIds.length; i++) {
      await db.insert(patientProfiles).values({
        userId: patientIds[i],
        mainDiagnosis: diagnoses[i],
        treatmentStage: stages[i],
        gender: i === 1 ? "F" : "M",
        observations: `Patient ${i + 1} in treatment`,
      });
    }

    // Create default quiz
    console.log("Creating quiz...");
    const quizResult = await db.insert(quizzes).values({
      name: "Check de Bem-Estar Diário",
      description:
        "Avaliação rápida para saber se é um bom dia para se exercitar e qual atividade fazer",
      isActive: true,
      createdBy: oncologistId,
    });
    const quizId = quizResult[0].insertId;

    // Create quiz questions
    console.log("Creating quiz questions...");

    // Pergunta 1: Energia (Escala 0-10)
    const q1Result = await db.insert(quizQuestions).values({
      quizId,
      text: "Como está seu nível de energia hoje? (0 = Muito baixo, 10 = Muito alto)",
      questionType: "SCALE_0_10",
      weight: "1.5",
      order: 1,
    });
    const q1Id = q1Result[0].insertId;

    // Pergunta 2: Dor (Escala 0-10)
    const q2Result = await db.insert(quizQuestions).values({
      quizId,
      text: "Como está sua dor hoje? (0 = Sem dor, 10 = Dor intensa)",
      questionType: "SCALE_0_10",
      weight: "2.0",
      order: 2,
    });
    const q2Id = q2Result[0].insertId;

    // Pergunta 3: Náusea (Sim/Não)
    const q3Result = await db.insert(quizQuestions).values({
      quizId,
      text: "Você está sentindo náusea hoje?",
      questionType: "YES_NO",
      weight: "1.0",
      order: 3,
    });
    const q3Id = q3Result[0].insertId;

    // Pergunta 4: Sono (Múltipla escolha)
    const q4Result = await db.insert(quizQuestions).values({
      quizId,
      text: "Como foi a qualidade do seu sono na última noite?",
      questionType: "MULTIPLE_CHOICE",
      weight: "1.2",
      order: 4,
    });
    const q4Id = q4Result[0].insertId;

    // Add options for Question 4
    await db.insert(quizQuestionOptions).values([
      { questionId: q4Id, text: "Ruim", scoreValue: "2", order: 1 },
      { questionId: q4Id, text: "Regular", scoreValue: "5", order: 2 },
      { questionId: q4Id, text: "Boa", scoreValue: "8", order: 3 },
      { questionId: q4Id, text: "Excelente", scoreValue: "10", order: 4 },
    ]);

    // Create exercise tutorials
    console.log("Creating exercise tutorials...");
    const exercises = [
      {
        name: "Caminhada leve",
        description:
          "Caminhada confortável por 15-20 minutos para dias de baixa energia.",
        intensityLevel: "LIGHT",
        safetyGuidelines:
          "Hidrate-se. Pare se sentir tontura ou falta de ar.",
        videoLink: "https://example.com/caminhada-leve",
      },
      {
        name: "Alongamentos suaves",
        description:
          "Alongamentos básicos para reduzir rigidez e melhorar mobilidade.",
        intensityLevel: "LIGHT",
        safetyGuidelines:
          "Não force; mantenha cada posição por 20-30 segundos.",
        videoLink: "https://example.com/alongamentos",
      },
      {
        name: "Cardio moderado",
        description:
          "Caminhada acelerada ou pedal leve por 20-30 minutos, mantendo fala confortável.",
        intensityLevel: "MODERATE",
        safetyGuidelines:
          "Mantenha ritmo que permita conversar. Monitore respiração.",
        videoLink: "https://example.com/cardio-moderado",
      },
      {
        name: "Força leve",
        description:
          "Exercícios com peso do próprio corpo ou elásticos para manter tônus muscular.",
        intensityLevel: "MODERATE",
        safetyGuidelines:
          "Priorize técnica. Descanse entre séries e pare se houver dor.",
        videoLink: "https://example.com/forca-leve",
      },
      {
        name: "Descanso ativo",
        description:
          "Movimentos leves como caminhada curta ou tai chi em dias de recuperação.",
        intensityLevel: "LIGHT",
        safetyGuidelines:
          "Foque em relaxamento e ritmo confortável.",
        videoLink: "https://example.com/descanso-ativo",
      },
      {
        name: "Circuito de resistência moderada",
        description:
          "Sequência de exercícios de corpo inteiro com cargas leves a moderadas em 2-3 voltas.",
        intensityLevel: "STRONG",
        safetyGuidelines:
          "Respeite os intervalos e interrompa se houver dor, falta de ar intensa ou tontura.",
        videoLink: "https://example.com/circuito-resistencia",
      },
      {
        name: "Intervalo aeróbico controlado",
        description:
          "Blocos curtos de esforço (1-2 min) com recuperação ativa, ajustando conforme sintomas.",
        intensityLevel: "STRONG",
        safetyGuidelines:
          "Mantenha percepção de esforço moderada; pare se sentir sintomas incomuns.",
        videoLink: "https://example.com/intervalo-aerobico",
      },
    ];

    for (const exercise of exercises) {
      await db.insert(exerciseTutorials).values(exercise);
    }

    // Create scoring configuration
    console.log("Creating scoring configuration...");
    await db.insert(quizScoringConfig).values([
      {
        quizId,
        minScore: "0",
        maxScore: "20",
        isGoodDay: false,
        recommendedExerciseType: "Dia de descanso",
        exerciseDescription:
          "Hoje não é um bom dia para exercícios. Foque em descanso e recuperação.",
      },
      {
        quizId,
        minScore: "20",
        maxScore: "40",
        isGoodDay: true,
        recommendedExerciseType: "Descanso ativo",
        exerciseDescription:
          "Movimentos leves como caminhada devagar ou alongamentos são recomendados.",
      },
      {
        quizId,
        minScore: "40",
        maxScore: "60",
        isGoodDay: true,
        recommendedExerciseType: "Exercício leve",
        exerciseDescription:
          "Caminhada leve ou alongamentos suaves por 15 a 20 minutos.",
      },
      {
        quizId,
        minScore: "60",
        maxScore: "100",
        isGoodDay: true,
        recommendedExerciseType: "Exercício moderado",
        exerciseDescription:
          "Você pode fazer exercícios moderados como caminhada acelerada ou treino de força leve.",
      },
    ]);

    console.log("✅ Seed completed successfully!");
    console.log("\nTest credentials:");
    console.log("Oncologist: dra.silva@oncoliving.local");
    console.log("Patients: joao@oncoliving.local, maria@oncoliving.local, carlos@oncoliving.local");

    await connection.end();
  } catch (error) {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  }
}

seed();
