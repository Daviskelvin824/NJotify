package request

import "time"

type EditProfileRequest struct {
	Email   string    `validate:"required" json:"email"`
	Gender  string    `validate:"required" json:"gender"`
	DOB     time.Time `validate:"required" json:"dob"`
	Country string    `validate:"required" json:"country"`
}
