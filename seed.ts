import { db } from "./index";
import { topics, dailyFacts, quizzes } from "./schema";
import { TOPICS_DATA, QUIZZES_DATA, FACTS_DATA } from "./seedData";

export async function seedDatabaseIfNeeded() {
  try {
    let seededAny = false;

    // 1. Check topics
    const existingTopics = await db.select().from(topics).limit(1);
    if (existingTopics.length === 0) {
      console.log("Seeding topics in database...");
      // Insert in chunks of 5 to avoid any query parameter limits, though Postgres supports many
      for (let i = 0; i < TOPICS_DATA.length; i += 5) {
        const chunk = TOPICS_DATA.slice(i, i + 5);
        await db.insert(topics).values(chunk);
      }
      console.log(`Seeded ${TOPICS_DATA.length} topics.`);
      seededAny = true;
    }

    // 2. Check facts
    const existingFacts = await db.select().from(dailyFacts).limit(1);
    if (existingFacts.length === 0) {
      console.log("Seeding daily facts in database...");
      for (let i = 0; i < FACTS_DATA.length; i += 10) {
        const chunk = FACTS_DATA.slice(i, i + 10);
        await db.insert(dailyFacts).values(chunk);
      }
      console.log(`Seeded ${FACTS_DATA.length} daily facts.`);
      seededAny = true;
    }

    // 3. Check quizzes
    const existingQuizzes = await db.select().from(quizzes).limit(1);
    if (existingQuizzes.length === 0) {
      console.log("Seeding quizzes in database...");
      for (let i = 0; i < QUIZZES_DATA.length; i += 10) {
        const chunk = QUIZZES_DATA.slice(i, i + 10);
        await db.insert(quizzes).values(chunk);
      }
      console.log(`Seeded ${QUIZZES_DATA.length} quizzes.`);
      seededAny = true;
    }

    return { 
      success: true, 
      message: seededAny ? "Database seeded successfully!" : "Database already had content." 
    };
  } catch (error: any) {
    console.error("Error in seedDatabaseIfNeeded:", error);
    return { success: false, error: error?.message || String(error) };
  }
}
