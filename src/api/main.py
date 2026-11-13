from fastapi import FastAPI

app = FastAPI(
    title="Info Oss Total API",
    description="API com dados de Judô e Jiu-Jitsu.",
    version="0.1.0"
)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Bem-vindo à API do Info Oss Total! 🥋"}