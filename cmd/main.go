// 📦 main.go — Go backend с поддержкой OpenAI и env
package main

import (
	"bytes"
	"encoding/json"
	"io"
	"net/http"
	"os"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

type ChatRequest struct {
	Messages []struct {
		Role    string `json:"role"`
		Content string `json:"content"`
	} `json:"messages"`
}

func main() {
	godotenv.Load()
	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	r.POST("/api/chat", func(c *gin.Context) {
		var req ChatRequest
		if err := c.ShouldBindJSON(&req); err != nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
			return
		}

		payload := map[string]interface{}{
			"model":    "gpt-3.5-turbo",
			"messages": req.Messages,
		}
		body, _ := json.Marshal(payload)

		reqOpenAI, _ := http.NewRequest("POST", "https://api.openai.com/v1/chat/completions", bytes.NewBuffer(body))
		reqOpenAI.Header.Set("Content-Type", "application/json")
		reqOpenAI.Header.Set("Authorization", "Bearer "+os.Getenv("OPENAI_API_KEY"))

		client := &http.Client{}
		resp, err := client.Do(reqOpenAI)
		if err != nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "OpenAI error"})
			return
		}
		defer resp.Body.Close()

		respBody, _ := io.ReadAll(resp.Body)
		var openaiResp struct {
			Choices []struct {
				Message struct {
					Content string `json:"content"`
				} `json:"message"`
			} `json:"choices"`
		}
		_ = json.Unmarshal(respBody, &openaiResp)

		reply := ""
		if len(openaiResp.Choices) > 0 {
			reply = openaiResp.Choices[0].Message.Content
		}

		c.JSON(http.StatusOK, gin.H{"reply": reply})
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

	r.Run(":8085")
}
