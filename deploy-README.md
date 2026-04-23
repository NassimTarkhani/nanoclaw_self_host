Quick notes to expose the web UI at bot.kapturo.fr

1) DNS
- Create an A record for `bot.kapturo.fr` pointing to your VPS public IP.

2) Build webui and start services
```bash
# from repo root
cd webui
npm ci
npm run build
cd ..
# rebuild images and start gateway + api + caddy
docker compose up -d --build nanobot-gateway nanobot-api caddy
```

3) Ensure gateway binds externally
- Edit your `~/.nanobot/config.json` (or use the web UI Config editor) and set:

```json
{
  "gateway": { "host": "0.0.0.0", "port": 18790 }
}
```

4) Open ports 80 and 443 on your VPS firewall.

Security notes
- Protect admin endpoints with `token_issue_secret` and strong tokens.
- Consider firewalling `/webui/bootstrap` to localhost if you expose the gateway publicly.
