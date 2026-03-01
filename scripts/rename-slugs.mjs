import fs from "fs";
import path from "path";

const quizzesDir = path.join(process.cwd(), "app/data/quizzes");
const files = fs.readdirSync(quizzesDir);

for (const file of files) {
  if (!file.endsWith(".json")) continue;
  
  const filePath = path.join(quizzesDir, file);
  const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
  
  // Generate clean slug from title
  let newSlug = content.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  // Handle duplicates
  let finalSlug = newSlug;
  let counter = 2;
  while (
    fs.existsSync(path.join(quizzesDir, `${finalSlug}.json`)) &&
    `${finalSlug}.json` !== file
  ) {
    finalSlug = `${newSlug}-${counter}`;
    counter++;
  }

  const newFile = `${finalSlug}.json`;
  
  if (file !== newFile) {
    content.slug = finalSlug;
    fs.writeFileSync(path.join(quizzesDir, newFile), JSON.stringify(content, null, 2));
    fs.unlinkSync(filePath);
    console.log(`✅ Renamed: ${file} → ${newFile}`);
  } else {
    console.log(`⏭️  Already clean: ${file}`);
  }
}

console.log("Done!");