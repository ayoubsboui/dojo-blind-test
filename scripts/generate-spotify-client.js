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

function getGeneratedType(typeSchema, imports, depth = 0) {
  if (typeSchema.allOf) {
    const types = typeSchema.allOf.map(subSchema => getGeneratedType(subSchema, imports, depth + 1));
    const filtered = types.filter(t => t && t !== "unknown" && t !== "{}");
    return filtered.join(' & ');
  }

  if (typeSchema.oneOf) {
    const types = typeSchema.oneOf.map(subSchema => getGeneratedType(subSchema, imports, depth + 1));
    const uniqueTypes = Array.from(new Set(types.filter(Boolean)));
    return uniqueTypes.length > 1 ? `(${uniqueTypes.join(' | ')})` : uniqueTypes[0] || "unknown";
  }

  if (typeSchema.$ref) {
    const refType = typeSchema.$ref.split("/").pop();
    imports.add(refType);
    return refType;
  }

  const schemaType = typeSchema.type;

  switch (schemaType) {
    case "number":
    case "integer":
      return "number";
    case "string":
      if (Array.isArray(typeSchema.enum) && typeSchema.enum.length === 1) {
        return `"${typeSchema.enum[0]}"`;
      }
      return "string";
    case "boolean":
      return "boolean";
    case "array": {
      if (!typeSchema.items) return "unknown[]";
      if (typeSchema.items.oneOf) {
        const types = typeSchema.items.oneOf.map(subSchema => getGeneratedType(subSchema, imports, depth + 1));
        const uniqueTypes = Array.from(new Set(types.filter(Boolean)));
        const unionType = uniqueTypes.length > 1 ? `(${uniqueTypes.join(' | ')})` : uniqueTypes[0] || "unknown";
        return `${unionType}[]`;
      }
      const itemType = getGeneratedType(typeSchema.items, imports, depth + 1);
      return `${itemType}[]`;
    }
    case "object": {
      if (!typeSchema.properties) return "Record<string, unknown>";

      const requiredFields = typeSchema.required ?? [];

      const properties = Object.entries(typeSchema.properties)
        .map(([propertyName, propertySchema]) => {
          const propertyType = getGeneratedType(propertySchema, imports, depth + 1);
          const isRequired = requiredFields.includes(propertyName);
          const optionalMark = isRequired ? "" : "?";
          return `  ${propertyName}${optionalMark}: ${propertyType};`;
        })
        .join("\n");
      return `{\n${properties}\n}`;
    }
    default:
      return "unknown";
  }
}

generateSpotifyClient();