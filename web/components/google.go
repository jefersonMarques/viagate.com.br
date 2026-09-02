package components

import (
	"os"
	"strings"
)

func googleAnalyticsID() string {
	return strings.TrimSpace(os.Getenv("GOOGLE_ANALYTICS_ID"))
}

func googleSiteVerification() string {
	return strings.TrimSpace(os.Getenv("GOOGLE_SITE_VERIFICATION"))
}
