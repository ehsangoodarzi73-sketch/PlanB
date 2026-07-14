# PlanB - Daytona Proxy

HTTP to HTTPS proxy for Daytona sandbox environments.

## Endpoints

| Proxy Path | Target |
|------------|--------|
| `/telegram/*` | api.telegram.org |
| `/openai/*` | api.openai.com |
| `/github/*` | api.github.com |
| `/huggingface/*` | huggingface.co |
| `/health` | Health check |

## Usage from Daytona

```bash
export PROXY_URL=https://planb.up.railway.app
curl $PROXY_URL/telegram/bot<TOKEN>/getMe
```
