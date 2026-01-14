import { mkdir, writeFile } from "fs/promises";
import { readFileSync } from "fs";

const targetDirectory = "src/lib/spotify/model";

async function generateSpotifyClient() {
  console.log("\nLaunched generate-spotify-client script");
  console.log('Generating Spotify client from OpenApi spec file...\n')
  await mkdir(targetDirectory, { recursive: true }); // Generate target directory

  const openapi = JSON.parse(readFileSync("./openapi.json", "utf8"));
  const schemas = openapi.components.schemas;
  const typesToGenerate = Object.keys(schemas);

  for (const typeName of typesToGenerate) {
    const typeSchema = schemas[typeName];
    generateType(typeName, typeSchema);
  }
}

function generateType(typeName, typeSchema) {  
  console.log(`Generating type ${typeName}...`);

  const generatedCode = getGeneratedCode(typeName, typeSchema);

  writeFile(`${targetDirectory}/${typeName}.ts`, generatedCode);
}

function getGeneratedCode(typeName, typeSchema) {
  const generatedType = getGeneratedType(typeSchema);

  return `export type ${typeName} = ${generatedType};`;
}

function getGeneratedType(typeSchema) {
  const schemaType = typeSchema.type;

  switch (schemaType) {
    case "number":
    case "integer":
      return "number";
    case "string":
      return "string";
    case "boolean":
      return "boolean";
    case "array":
      if (typeSchema.items) {
        const itemType = getGeneratedType(typeSchema.items);
        return `${itemType}[]`;
      }
      return "any[]";
    case "object":
      if (typeSchema.properties) {
        const props = Object.entries(typeSchema.properties)
          .map(([propName, propSchema]) => {
            const tsType = getGeneratedType(propSchema);
            return `  ${propName}: ${tsType};`;
          })
          .join('\n');
        return `{\n${props}\n}`;
      }
      return "{}";
    default:
      return "";
  }
}

generateSpotifyClient();