import { google } from "googleapis";

const auth = new google.auth.GoogleAuth({
  keyFile: "cds-service-account.json",
  scopes: [
    "https://www.googleapis.com/auth/spreadsheets.readonly",
    "https://www.googleapis.com/auth/drive.readonly",
  ],
});

function getCurrentWeekNumber() {
  const today = new Date();
  const oneJan = new Date(today.getFullYear(), 0, 1);
  const numberOfDays = Math.floor((today - oneJan) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((today.getDay() + 1 + numberOfDays) / 7);
  return weekNumber;
}

export const getSheetData = async (weekMode = "current") => {
  try {
    console.log("=== Google Sheet Debug ===");
    console.log("Week mode:", weekMode);

    const currentWeek = getCurrentWeekNumber();
    console.log("Current week number:", currentWeek);

    const client = await auth.getClient();
    const sheets = google.sheets({ version: "v4", auth: client });

    const sheetId = process.env.SHEET_ID;
    if (!sheetId) throw new Error("SHEET_ID is not defined in environment variables");

    const metadata = await sheets.spreadsheets.get({ spreadsheetId: sheetId });
    const availableTabs = metadata.data.sheets.map((s) => s.properties.title);
    console.log("🗂 Available sheet tabs:", availableTabs);

    // Parse week numbers from available sheet tabs
    const weekTabs = availableTabs
      .map((title) => {
        const match = title.match(/CDS_Weekly_Quiz_Week(\d+)/);
        return match ? { title, week: parseInt(match[1], 10) } : null;
      })
      .filter(Boolean)
      .sort((a, b) => a.week - b.week);

    if (weekTabs.length === 0) {
      throw new Error("No valid weekly tabs found in the sheet.");
    }

    let selectedTabs = [];

    if (weekMode === "all") {
      selectedTabs = weekTabs;
    } else if (weekMode === "current") {
      const currentTab = weekTabs.find((tab) => tab.week === currentWeek);
      if (currentTab) {
        selectedTabs = [currentTab];
      } else {
        const fallbackTab = weekTabs[weekTabs.length - 1];
        console.warn(`⚠ No tab found for Week ${currentWeek}. Falling back to Week ${fallbackTab.week}`);
        selectedTabs = [fallbackTab];
      }
    } else {
      console.warn(`⚠ Unknown week mode '${weekMode}', defaulting to all`);
      selectedTabs = weekTabs;
    }

    const allData = [];

    for (const { title: sheetName, week: weekNumber } of selectedTabs) {
      console.log(`📖 Reading sheet: ${sheetName}`);
      const res = await sheets.spreadsheets.values.get({
        spreadsheetId: sheetId,
        range: `${sheetName}!A1:H`,
      });

      const rows = res.data.values || [];
      if (rows.length <= 1) continue;

      const dataRows = rows.slice(1);
      const parsedRows = dataRows
        .filter((row) => row[0] && row[2])
        .map((row) => ({
          subject: row[0]?.trim() || "",
          week: weekNumber,
          question: row[2]?.trim() || "",
          optionA: row[3]?.trim() || "",
          optionB: row[4]?.trim() || "",
          optionC: row[5]?.trim() || "",
          optionD: row[6]?.trim() || "",
          correct: row[7]?.trim() || "",
        }));

      allData.push(...parsedRows);
    }

    console.log(`📦 Total questions loaded: ${allData.length}`);
    console.log("🧪 Sample loaded data:", allData.slice(0, 3));

    return allData;
  } catch (err) {
    console.error("❌ Google Sheet Error:", err);
    throw new Error(`Failed to read quiz data: ${err.message}`);
  }
};
