#!/usr/bin/env bash
set -euo pipefail

CERT_DIR="$(dirname "$0")/../docker/certs"
mkdir -p "$CERT_DIR"

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$CERT_DIR/nginx-selfsigned.key" \
  -out "$CERT_DIR/nginx-selfsigned.crt" \
  -subj "/C=US/ST=State/L=City/O=MiniFin/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "Certificates generated in $CERT_DIR"
