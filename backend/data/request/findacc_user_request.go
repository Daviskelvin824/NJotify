package request

type CreateFindAccountRequest struct{
	Email         string    `validate:"required" json:"email"`
}