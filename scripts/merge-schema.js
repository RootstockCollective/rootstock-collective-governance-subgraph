import fs from "fs";
import path from "path";

const typesDir = "schema/types";
const outputPath = "schema/schema.graphql";

const schemaFiles = fs
.readdirSync(typesDir)
.filter((file) => file.endsWith(".graphql"))
.map((file) => path.join(typesDir, file));

const merged = schemaFiles
.map((file) => {
  const content = fs.readFileSync(file, "utf8").trim();
  return content.endsWith("\n") ? content : content + "\n";
})
.join("\n");

fs.writeFileSync(outputPath, merged);
