package server

import (
	"net/http"
	"sync"
	"time"
)

type visitor struct {
	count     int
	expiresAt time.Time
}

type rateLimiter struct {
	limit            int
	window           time.Duration
	clientIPResolver *clientIPResolver
	mu               sync.Mutex
	visitors         map[string]visitor
	lastCleanup      time.Time
}

func newRateLimiter(limit int, window time.Duration, clientIPResolver *clientIPResolver) *rateLimiter {
	return &rateLimiter{
		limit:            limit,
		window:           window,
		clientIPResolver: clientIPResolver,
		visitors:         make(map[string]visitor),
		lastCleanup:      time.Now(),
	}
}

func (limiter *rateLimiter) allow(request *http.Request) bool {
	clientIP := limiter.clientIPResolver.resolve(request)
	now := time.Now()

	limiter.mu.Lock()
	defer limiter.mu.Unlock()

	if now.Sub(limiter.lastCleanup) >= limiter.window {
		limiter.cleanup(now)
	}

	current, found := limiter.visitors[clientIP]
	if !found || now.After(current.expiresAt) {
		limiter.visitors[clientIP] = visitor{count: 1, expiresAt: now.Add(limiter.window)}
		return true
	}
	if current.count >= limiter.limit {
		return false
	}

	current.count++
	limiter.visitors[clientIP] = current
	return true
}

func (limiter *rateLimiter) cleanup(now time.Time) {
	for address, record := range limiter.visitors {
		if now.After(record.expiresAt) {
			delete(limiter.visitors, address)
		}
	}
	limiter.lastCleanup = now
}
