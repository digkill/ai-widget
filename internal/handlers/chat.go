package handlers

import (
	"github.com/gin-gonic/gin"
	"net/http"
)

type chatRequest struct {
	Message string `json:"message"`
}

type chatResponse struct {
	Reply string `json:"reply"`
}

func HandleChat(c *gin.Context) {
	var req chatRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{"error": "invalid payload"})
		return
	}

	// TODO: call OpenAI or other AI here
	answer := "Echo: " + req.Message

	c.JSON(200, chatResponse{Reply: answer})
}
