package request

type AddProfileImageRequest struct {
	Email        string `validate:"required" json:"email"`
	ProfileImage string `validate:"required" json:"profileimg"`
}