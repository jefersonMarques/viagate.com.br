package server

import (
	"log/slog"
	"net"
	"net/http"
	"strings"
)

type clientIPResolver struct {
	trustedNetworks []*net.IPNet
}

func newClientIPResolver(cidrs []string, logger *slog.Logger) *clientIPResolver {
	resolver := &clientIPResolver{
		trustedNetworks: make([]*net.IPNet, 0, len(cidrs)),
	}

	for _, cidr := range cidrs {
		_, network, err := net.ParseCIDR(strings.TrimSpace(cidr))
		if err != nil {
			logger.Warn("invalid trusted proxy CIDR", "cidr", cidr)
			continue
		}
		resolver.trustedNetworks = append(resolver.trustedNetworks, network)
	}

	return resolver
}

func (resolver *clientIPResolver) resolve(request *http.Request) string {
	peerIP := parseRemoteIP(request.RemoteAddr)
	if peerIP == nil {
		return request.RemoteAddr
	}
	if !resolver.isTrusted(peerIP) {
		return peerIP.String()
	}

	forwardedFor := strings.Split(request.Header.Get("X-Forwarded-For"), ",")
	firstValidIP := ""
	for index := len(forwardedFor) - 1; index >= 0; index-- {
		forwardedIP := net.ParseIP(strings.TrimSpace(forwardedFor[index]))
		if forwardedIP == nil {
			continue
		}
		firstValidIP = forwardedIP.String()
		if !resolver.isTrusted(forwardedIP) {
			return forwardedIP.String()
		}
	}

	if firstValidIP != "" {
		return firstValidIP
	}

	realIP := net.ParseIP(strings.TrimSpace(request.Header.Get("X-Real-IP")))
	if realIP != nil {
		return realIP.String()
	}

	return peerIP.String()
}

func (resolver *clientIPResolver) isTrusted(ip net.IP) bool {
	for _, network := range resolver.trustedNetworks {
		if network.Contains(ip) {
			return true
		}
	}
	return false
}

func parseRemoteIP(remoteAddress string) net.IP {
	host, _, err := net.SplitHostPort(remoteAddress)
	if err == nil {
		return net.ParseIP(host)
	}
	return net.ParseIP(strings.TrimSpace(remoteAddress))
}
