package request

type UpdateNotifRequest struct {
	ArtistNotif   string `validate:"required" json:"artistnotif"`
	FollowerNotif string `validate:"required" json:"followernotif"`
}
