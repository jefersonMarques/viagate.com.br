package static

import "embed"

// Files reúne assets públicos que precisam acompanhar o binário.
//
//go:embed assets public public/.well-known/security.txt
var Files embed.FS
