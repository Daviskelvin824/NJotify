package request

type CreateTrackRequest struct {
	AlbumID     uint     `validate:"required" json:"albumid"`
	TrackTitles []string `validate:"required" json:"tracktitles"`
	FilePaths   []string `validate:"required" json:"filepaths"`
}

type CreateQueueRequest struct {
	TrackIDs []uint `json:"trackIds"`
}
