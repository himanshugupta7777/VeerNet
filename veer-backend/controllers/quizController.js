import { getSheetData } from "../config/googleSheet.js";

// Helper to clean strings safely
const clean = (str) => str?.replace(/\s+/g, " ").trim().toLowerCase();

export const getQuizBySubject = async (req, res) => {
  try {
    const { subject } = req.params;
    const weekMode = req.query.week || "current";

    console.log("🔍 Requested subject:", subject);
    console.log("🔄 Week mode:", weekMode);

    // Fetch current week data
    let data = await getSheetData("current");
    const requestedSubject = clean(subject);

    const availableSubjects = [...new Set(data.map((q) => clean(q.subject)))];
    console.log("📋 Available subjects (cleaned):", availableSubjects);

    let filtered = data.filter((q) => clean(q.subject) === requestedSubject);
    console.log(`✅ Filtered questions count for '${requestedSubject}': ${filtered.length}`);
    console.log("📝 Sample filtered data:", filtered.slice(0, 2));

    // 🔁 Fallback to Week 1 if current week has no data
    if (filtered.length === 0 && weekMode === "current") {
      console.warn(`❌ No questions found for subject '${requestedSubject}' in current week. Falling back to Week 1.`);
      const fallbackData = await getSheetData("fallback");
      filtered = fallbackData.filter((q) => q.week === 1 && clean(q.subject) === requestedSubject);
      console.log(`🔁 Week 1 fallback questions found: ${filtered.length}`);
    }

    if (filtered.length === 0) {
      console.warn(`❌ No questions found for subject: '${requestedSubject}'`);
      return res.status(404).json({
        error: "No questions available for this subject",
        details: {
          requestedSubject,
          availableSubjects,
          weekMode,
          totalQuestions: data.length
        }
      });
    }

    // Shuffle and return
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    console.log("🔄 Shuffled questions count:", shuffled.length);
    console.log("📝 Sample shuffled data:", shuffled.slice(0, 2));

    res.json(shuffled);

  } catch (err) {
    console.error("💥 Error fetching quiz:", err);
    if (err.message.includes("Unable to parse range")) {
      return res.status(500).json({
        error: "Quiz data is not properly configured. Please contact the administrator.",
        details: err.message
      });
    }
    res.status(500).json({
      error: "Failed to load quiz questions",
      details: err.message
    });
  }
};
