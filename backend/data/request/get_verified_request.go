package request

type GetVerifiedRequest struct {
	Email       string `validate:"required" json:"email"`
	BannerImage string `validate:"required"  json:"bannerimage"`
	AboutMe     string `validate:"required"  json:"aboutme"`
}
