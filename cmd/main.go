package main

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

func main() {
	r := gin.Default()

	// ✅ CORS: разрешаем запросы к API отовсюду
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}
		c.Next()
	})

	// ✅ API эндпоинт
	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.POST("/api/chat", func(c *gin.Context) {
		var req struct {
			Message string `json:"message"`
		}
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid input"})
			return
		}
		c.JSON(http.StatusOK, gin.H{
			"reply": "You said: " + req.Message,
		})
	})

	// ✅ Статика: подключаем собранный фронт
	r.Static("/dist", "./frontend/dist")                   // JS-модули
	r.Static("/assets", "./frontend/assets")               // изображения и прочее
	r.StaticFile("/favicon.ico", "./frontend/favicon.ico") // иконка, если есть
	r.StaticFile("/index.html", "./frontend/index.html")   // явная подгрузка

	// ✅ SPA fallback: всё остальное — index.html
	r.NoRoute(func(c *gin.Context) {
		c.File("./frontend/index.html")
	})

	// 🚀 Запускаем сервер
	r.Run(":8085") // http://localhost:8085
}
