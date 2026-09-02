package components

import (
	"os"
	"strings"
)

func googleTagManagerID() string {
	return strings.TrimSpace(os.Getenv("GOOGLE_TAG_MANAGER_ID"))
}

func googleAnalyticsID() string {
	return strings.TrimSpace(os.Getenv("GOOGLE_ANALYTICS_ID"))
}

func googleSiteVerification() string {
	return strings.TrimSpace(os.Getenv("GOOGLE_SITE_VERIFICATION"))
}

func googleAnalyticsDirectEnabled() bool {
	return googleTagManagerID() == "" && googleAnalyticsID() != ""
}
