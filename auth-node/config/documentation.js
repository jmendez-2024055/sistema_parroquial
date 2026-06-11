import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const BASE_PATH = '/SistemaParroquial/v1';

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Sistema Parroquial API",
      version: "1.0.0",
      description: "Documentación de la API del sistema parroquial",
    },
    servers: [
      {
        url: `http://localhost:3000${BASE_PATH}`,
        description: "Servidor local",
      },
    ],
    tags: [
      { name: "Evento", description: "Gestión de eventos parroquiales" },
      { name: "Categoria", description: "Gestión de categorías" },
      { name: "Aviso", description: "Gestión de avisos" },
      { name: "Misa", description: "Gestión de horarios de misa" },
    ],
  },
  apis: [
    "./src/event/event.routes.js",
    "./src/category/category.routes.js",
    "./src/notice/notice.routes.js",
    "./src/massShedule/massSchedule.routes.js",
  ],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get("/api-docs.json", (req, res) => res.json(swaggerSpec));
  console.log(`Swagger docs disponibles en http://localhost:3000/api-docs`);
};