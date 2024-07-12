package model

import (
	"database/sql/driver"
	"strings"
)

type StringArray []string

func (a StringArray) Value() (driver.Value, error) {
	return "{" + strings.Join(a, ",") + "}", nil
}

func (a *StringArray) Scan(value interface{}) error {
	strVal, _ := value.(string)
	strVal = strings.TrimLeft(strVal, "{")
	strVal = strings.TrimRight(strVal, "}")
	*a = strings.Split(strVal, ",")
	return nil
}
