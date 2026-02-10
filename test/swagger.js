import swaggerJsdoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API Documentation",
      version: "1.0.0",
      description: "Documentation de mon API",
    },
    servers: [
      {
        url: "http://localhost:5001",
        description: "Serveur local",
      },
    ],
  },
  apis: ["./backend/routes*.js"], // chemins vers mes routes api
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
