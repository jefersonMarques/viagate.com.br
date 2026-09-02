package components

import "testing"

func TestGoogleTagConfigurationPrefersTagManager(t *testing.T) {
	t.Setenv("GOOGLE_TAG_MANAGER_ID", "GTM-TEST123")
	t.Setenv("GOOGLE_ANALYTICS_ID", "G-TEST123")
	t.Setenv("GOOGLE_SITE_VERIFICATION", "verification-token")

	if googleTagManagerID() != "GTM-TEST123" {
		t.Fatalf("unexpected GTM id: %q", googleTagManagerID())
	}
	if googleAnalyticsID() != "G-TEST123" {
		t.Fatalf("unexpected GA4 id: %q", googleAnalyticsID())
	}
	if googleSiteVerification() != "verification-token" {
		t.Fatalf("unexpected Search Console token: %q", googleSiteVerification())
	}
	if googleAnalyticsDirectEnabled() {
		t.Fatal("direct GA4 must be disabled when GTM is configured")
	}
}

func TestGoogleAnalyticsDirectFallback(t *testing.T) {
	t.Setenv("GOOGLE_TAG_MANAGER_ID", "")
	t.Setenv("GOOGLE_ANALYTICS_ID", " G-TEST123 ")

	if !googleAnalyticsDirectEnabled() {
		t.Fatal("direct GA4 must be enabled when GTM is absent")
	}
	if googleAnalyticsID() != "G-TEST123" {
		t.Fatalf("GA4 id should be trimmed, got %q", googleAnalyticsID())
	}
}
