package request

type SignInUserRequest struct {
	Email    string `validate:"required" json:"email"`
	Password string `validate:"required" json:"password"`
}
