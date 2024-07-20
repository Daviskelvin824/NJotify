package model

type Playlist struct {
	PlaylistID          uint   `gorm:"primary_key"`
	CreatorID           uint   `gorm:"not null"`
	PlaylistTitle       string `gorm:"type:text"`
	PlaylistDescription string `gorm:"type:text"`
	PlaylistImage       string `gorm:"type:text"`
}