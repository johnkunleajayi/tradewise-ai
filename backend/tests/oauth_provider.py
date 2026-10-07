"""Fake Google HTTP endpoints; the real Authlib verifier still runs."""

import time
from base64 import urlsafe_b64encode
from hashlib import sha256
from urllib.parse import parse_qs

import httpx
from authlib.integrations.starlette_client import OAuth
from joserfc import jwt
from joserfc.jwk import RSAKey


class GoogleProvider:
    def __init__(self):
        self.key = RSAKey.generate_key(2048)
        self.claims = {
            "iss": "https://accounts.google.com",
            "aud": "test-client",
            "sub": "google-user-1",
            "email": "Trader@Example.com",
            "email_verified": True,
            "name": "Demo Trader",
            "picture": "https://example.com/avatar.png",
        }
        self.nonce = ""
        self.challenge = ""
        self.exchanges = 0
        self.omit_id_token = False
        self.bad_signature = False
        self.unavailable = False
        self.client = OAuth().register(
            name="google",
            client_id="test-client",
            client_secret="test-only-secret",
            server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
            client_kwargs={
                "scope": "openid email profile",
                "code_challenge_method": "S256",
                "transport": httpx.MockTransport(self.handle),
            },
        )

    def handle(self, request):
        if self.unavailable:
            raise httpx.ConnectError("private-provider-error", request=request)
        if request.url.path.endswith("openid-configuration"):
            return httpx.Response(
                200,
                json={
                    "issuer": "https://accounts.google.com",
                    "authorization_endpoint": "https://accounts.google.com/o/oauth2/v2/auth",
                    "token_endpoint": "https://oauth2.googleapis.com/token",
                    "jwks_uri": "https://www.googleapis.com/oauth2/v3/certs",
                    "id_token_signing_alg_values_supported": ["RS256"],
                },
            )
        if request.url.path.endswith("/certs"):
            return httpx.Response(200, json={"keys": [self.key.as_dict(private=False)]})
        assert request.url.path == "/token"
        params = parse_qs(request.content.decode())
        verifier = params["code_verifier"][0]
        assert (
            urlsafe_b64encode(sha256(verifier.encode()).digest()).rstrip(b"=").decode()
            == self.challenge
        )
        assert params["redirect_uri"] == ["http://localhost:8000/api/auth/google/callback"]
        self.exchanges += 1
        claims = {
            "iat": int(time.time()),
            "exp": int(time.time()) + 3600,
            "nonce": self.nonce,
            **self.claims,
        }
        token = {"access_token": "private-access-token", "token_type": "Bearer"}
        if self.omit_id_token:
            token["userinfo"] = claims
        else:
            key = RSAKey.generate_key(2048) if self.bad_signature else self.key
            token["id_token"] = jwt.encode({"alg": "RS256"}, claims, key)
        return httpx.Response(200, json=token)
