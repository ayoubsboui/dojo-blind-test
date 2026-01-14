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
  const imports = new Set();
  const generatedCode = getGeneratedCode(typeName, typeSchema, imports);

  const importBlock = Array.from(imports)
    .map(dep => `import { ${dep} } from "./${dep}";`)
    .join('\n');

  const fileContent = (importBlock ? importBlock + '\n\n' : '') + generatedCode;

  writeFile(`${targetDirectory}/${typeName}.ts`, fileContent);
}

function getGeneratedCode(typeName, typeSchema, imports) {
  const generatedType = getGeneratedType(typeSchema, imports);
  return `export type ${typeName} = ${generatedType};`;
}

function getGeneratedType(typeSchema, imports) {
  if (typeSchema.$ref) {
    const refType = typeSchema.$ref.split('/').pop();
    if (refType) {
      imports.add(refType);
      return refType;
    }
    return "any";
  }

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
        const itemType = getGeneratedType(typeSchema.items, imports);
        return `${itemType}[]`;
      }
      return "any[]";
    case "object":
      if (typeSchema.properties) {
        const required = typeSchema.required || [];
        const props = Object.entries(typeSchema.properties)
          .map(([propName, propSchema]) => {
            const tsType = getGeneratedType(propSchema, imports);
            const isRequired = required.includes(propName);
            return `  ${propName}${isRequired ? '' : '?'}: ${tsType};`;
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