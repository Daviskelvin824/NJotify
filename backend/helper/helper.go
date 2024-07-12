package helper

import (
	"crypto/rand"
	"encoding/base64"
	"fmt"
	"unicode"

	"gopkg.in/gomail.v2"
)

func CheckPanic(err error) {
	if err != nil {
		panic(err)
	}
}

func ValidatePassword(password string) bool {
	if len(password) < 8 {
		return false
	}

	hasAlphabet := false
	hasNumber := false
	hasUpperCase := false
	hasSymbol := false

	symbols := "!@#$%^&*()_+-=[]{};:',.<>/?"
	symbolSet := map[rune]bool{}

	for _, char := range symbols {
		symbolSet[char] = true
	}

	for _, char := range password {
		if unicode.IsLetter(char) {
			hasAlphabet = true
			if unicode.IsUpper(char) {
				hasUpperCase = true
			}
		}
		if unicode.IsNumber(char) {
			hasNumber = true
		}
		if symbolSet[char] {
			hasSymbol = true
		}
	}
	return hasAlphabet && hasNumber && hasUpperCase && hasSymbol
}

func GenerateVerificationToken() (string, error) {
	b := make([]byte, 32)
	_, err := rand.Read(b)
	if err != nil {
		return "", err
	}
	return base64.URLEncoding.EncodeToString(b), nil
}

func SendVerificationEmail(token string, email string) error {
	fmt.Println(token)
	verificationLink := fmt.Sprintf("http://localhost:5173/activateaccount?token=%s", token)
	m := gomail.NewMessage()
	m.SetHeader("From", "njotytpaweb@gmail.com")
	m.SetHeader("To", email)
	m.SetHeader("Subject", "Account Verification")
	m.SetBody("text/html", fmt.Sprintf("Click the link to verify your account: <a href='%s'>Verify Account</a>", verificationLink))
	d := gomail.NewDialer("smtp.gmail.com", 587, "njotytpaweb@gmail.com", "wyizvfefqyrjmgtq")

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send verification email: %v", err)
	}

	return nil
}

func SendForgotPasswordEmail(email string) error {
	fmt.Println(email)
	verificationLink := fmt.Sprintf("http://localhost:8888/forgotpassword?email=%s", email)
	m := gomail.NewMessage()
	m.SetHeader("From", "njotytpaweb@gmail.com")
	m.SetHeader("To", email)
	m.SetHeader("Subject", "Reset Password")
	m.SetBody("text/html", fmt.Sprintf("Click the link to reset your password: <a href='%s'>Reset Password</a>", verificationLink))
	d := gomail.NewDialer("smtp.gmail.com", 587, "njotytpaweb@gmail.com", "wyizvfefqyrjmgtq")

	// Send the email
	if err := d.DialAndSend(m); err != nil {
		return fmt.Errorf("failed to send reset email: %v", err)
	}

	return nil
}
