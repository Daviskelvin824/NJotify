package model

type Track struct {
	TrackID     uint   `gorm:"primary_key"`
	AlbumID     uint   `gorm:"not null"`
	TrackTitles string `gorm:"type:text"`
	FilePaths   string `gorm:"type:text"`
}
