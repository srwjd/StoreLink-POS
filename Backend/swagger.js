import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "StoreLink POS API",
            version: "1.0.0",
            description: "📘 เอกสาร API ของระบบ StoreLink POS",
        },
        servers: [
            { url: "http://localhost:3000", description: "Local Server" },
        ],
    },
    apis: ["./routes/*.js"], // 🔹 ชี้ไปยังไฟล์ routes ของพลอย
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app) => {
    app.use(
        "/api-docs",
        swaggerUi.serve,
        swaggerUi.setup(swaggerSpec, {
            customCss: '.swagger-ui .topbar { display: none }',
            customSiteTitle: "StoreLink POS API",
            customfavIcon: "/favicon.ico",
            customJs: [
                // inject JS เพื่อแสดงจำนวน endpoint
                `
      document.addEventListener("DOMContentLoaded", () => {
        const total = ${Object.values(swaggerSpec.paths).length};
        const title = document.querySelector('.title');
        if (title) {
          const count = document.createElement('div');
          count.textContent = "🧾 จำนวน API ทั้งหมด: " + total;
          count.style.marginTop = "10px";
          count.style.fontWeight = "bold";
          title.appendChild(count);
        }
      });
      `,
            ],
        })
    );

};
