import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const BASE_PATH = '/Parroquia/Admin/v1';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Parish Management API",
      version: "1.0.0",
      description: "Documentación de la API del sistema parroquial",
    },
    servers: [
      {
        url: `http://localhost:3020${BASE_PATH}`,
        description: "Servidor local",
      },
    ],
    tags: [
      { name: "Feligres",  description: "Gestión de feligreses" },
      { name: "Sacerdote", description: "Gestión de sacerdotes" },
      { name: "Sacramento", description: "Gestión de sacramentos (bautizos, matrimonios, etc.)" },
      { name: "Misa", description: "Gestión de misas y horarios" },
    ],
  },
  apis: [
    "./src/Feligres/feligres.routes.js",
    "./src/Sacerdote/sacerdote.routes.js",
    "./src/Sacramento/sacramento.routes.js",
    "./src/Misa/misa.routes.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
  console.log(" Swagger docs disponibles en http://localhost:3020/api-docs");
};