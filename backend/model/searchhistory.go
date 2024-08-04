package model

type SearchHistory struct {
	SearchHistoryId uint   `gorm:"primary_key"`
	UserId          uint   `gorm:"not null"`
	ResultId        uint   `gorm:"not null"`
	ResultType      string `gorm:"not null"`
}