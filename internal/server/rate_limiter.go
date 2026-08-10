package server

import (
	"net"
	"net/http"
	"sync"
	"time"
)

type visitor struct {
	count     int
	expiresAt time.Time
}

type rateLimiter struct {
	limit       int
	window      time.Duration
	mu          sync.Mutex
	visitors    map[string]visitor
	lastCleanup time.Time
}

func newRateLimiter(limit int, window time.Duration) *rateLimiter {
	return &rateLimiter{limit: limit, window: window, visitors: make(map[string]visitor), lastCleanup: time.Now()}
}

func (limiter *rateLimiter) allow(request *http.Request) bool {
	host, _, err := net.SplitHostPort(request.RemoteAddr)
	if err != nil {
		host = request.RemoteAddr
	}
	now := time.Now()
	limiter.mu.Lock()
	defer limiter.mu.Unlock()
	if now.Sub(limiter.lastCleanup) >= limiter.window {
		for address, record := range limiter.visitors {
			if now.After(record.expiresAt) {
				delete(limiter.visitors, address)
			}
		}
		limiter.lastCleanup = now
	}

	current, found := limiter.visitors[host]
	if !found || now.After(current.expiresAt) {
		limiter.visitors[host] = visitor{count: 1, expiresAt: now.Add(limiter.window)}
		return true
	}
	if current.count >= limiter.limit {
		return false
	}
	current.count++
	limiter.visitors[host] = current
	return true
}
