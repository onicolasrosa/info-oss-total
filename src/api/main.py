from fastapi import FastAPI, HTTPException
import pandas as pd
from pathlib import Path
import json
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="Info Oss Total API",
    description="API com dados de Judô e Jiu-Jitsu.",
    version="0.1.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent.parent.parent
COMPETICOES_DATA_PATH = BASE_DIR / "data" / "raw" / "competitions_sample.parquet"
LUTAS_DATA_PATH = BASE_DIR / "data" / "raw" / "contests_sample.parquet"

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Bem-vindo à API do Info Oss Total! 🥋"}

@app.get("/competicoes")
def get_competicoes(skip: int = 0, limit: int = 10):
    """Retorna a lista de competições com paginação."""
    if not COMPETICOES_DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Arquivo de competições não encontrado.")
    
    try:
        df = pd.read_parquet(COMPETICOES_DATA_PATH)
        total_registros = len(df)
        
        # (Slicing do Pandas)
        df_paginado = df.iloc[skip : skip + limit]
        
        competicoes = json.loads(df_paginado.to_json(orient="records"))
        
        return {
            "total_de_registros": total_registros,
            "skip": skip,
            "limit": limit,
            "dados": competicoes
        }
    except Exception as e:
        # Se der erro, a API vai nos dizer qual foi o erro!
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/lutas")
def get_lutas(weight: str = None, skip: int = 0, limit: int = 10):
    """Retorna a lista de lutas com filtro e paginação."""
    if not LUTAS_DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Arquivo de lutas não encontrado.")
    
    try:
        df = pd.read_parquet(LUTAS_DATA_PATH)
        
        # Aplica o filtro de peso, se existir
        if weight:
            df = df[df['weight'] == weight]
            
        total_registros = len(df)
        
        # Aplica a paginação
        df_paginado = df.iloc[skip : skip + limit]
        
        lutas = json.loads(df_paginado.to_json(orient="records"))
        
        return {
            "total_de_registros": total_registros,
            "filtro_aplicado": weight if weight else "Nenhum",
            "skip": skip,
            "limit": limit,
            "dados": lutas
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
