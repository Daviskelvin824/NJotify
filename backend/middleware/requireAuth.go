package middleware

import (
	"fmt"
	"net/http"
	"os"
	"time"

	"github.com/Daviskelvin824/TPA-Website/data/response"
	"github.com/Daviskelvin824/TPA-Website/service"
	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
)

func Validate(c *gin.Context, userService service.UserService) {

	user, err := GetUserFromJWT(c, userService)
	if err != nil {
		fmt.Println("Error retrieving user from JWT:", err)
		c.AbortWithStatus(http.StatusUnauthorized)
		return
	}
	c.Set("user", *user)
	c.Next()
}

func CreateAuthMiddleware(userService service.UserService) gin.HandlerFunc {
	return func(c *gin.Context) {
		Validate(c, userService)
	}
}

func GetUserFromJWT(c *gin.Context, userService service.UserService) (*response.UserResponse, error) {
	tokenString, err := c.Cookie("Auth")
	if err != nil {
		return nil, fmt.Errorf("error retrieving authorization cookie: %w", err)
	}
	fmt.Println("Token from cookie:", tokenString)

	// Decode/validate it
	result, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
		if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
			return nil, fmt.Errorf("unexpected signing method: %v", token.Header["alg"])
		}
		return []byte(os.Getenv("SECRET")), nil
	})
	if err != nil || !result.Valid {
		return nil, fmt.Errorf("invalid token: %w", err)
	}

	if claims, ok := result.Claims.(jwt.MapClaims); ok && result.Valid {
		// Check the exp
		if float64(time.Now().Unix()) > claims["expire"].(float64) {
			return nil, fmt.Errorf("token expired")
		}

		// Find the user with token sub
		resUser, err := userService.FindByEmail(claims["subject"].(string))

		if err != nil {
			return nil, fmt.Errorf("invalid token: %w", err)
		}

		return &resUser, nil
	}

	return nil, fmt.Errorf("invalid token claims")
}
