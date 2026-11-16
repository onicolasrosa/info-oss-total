from fastapi import FastAPI, HTTPException
import pandas as pd
from pathlib import Path
import json 


app = FastAPI(
    title="Info Oss Total API",
    description="API com dados de Judô e Jiu-Jitsu.",
    version="0.1.0"
)

# Define o caminho onde estão os dados salvos pelo nosso script de ETL
BASE_DIR = Path(__file__).resolve().parent.parent.parent
DATA_PATH = BASE_DIR / "data" / "raw" / "competitions_sample.parquet"
LUTAS_DATA_PATH = BASE_DIR / "data" / "raw" / "contests_sample.parquet"


@app.get("/")
def read_root():
    return {"status": "ok", "message": "Bem-vindo à API do Info Oss Total! 🥋"}

@app.get("/competicoes")
def get_competicoes():
    """Retorna a lista de competições disponíveis na base."""
    # Verifica se o arquivo existe
    if not DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Arquivo de competições não encontrado. Rode o script de ETL.")

    try:
        # Lê o arquivo Parquet usando o Pandas
        df = pd.read_parquet(DATA_PATH)
        
        # Converte a tabela para uma lista de dicionários (JSON)
        # FastAPI transforma isso automaticamente em um JSON.
        competicoes = json.loads(df.to_json(orient="records"))
        
        # Retorna o total e os dados
        return {
            "total": len(competicoes),
            "dados": competicoes
        }
    except Exception as e:
        # Se der erro, a API vai nos dizer qual foi o erro!
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/lutas")
def get_lutas(weight: str = None):
    """
    Retorna a lista de lutas. 
    Permite filtrar opcionalmente pela categoria de peso (ex: /lutas?weight=-73).
    """
    if not LUTAS_DATA_PATH.exists():
        raise HTTPException(status_code=404, detail="Arquivo de lutas não encontrado. Rode o script de ETL.")
    
    try:
        df = pd.read_parquet(LUTAS_DATA_PATH)
        
        # Se o usuário passar o parâmetro weight na URL, nós filtramos a tabela
        if weight:
            df = df[df['weight'] == weight]
            
        lutas = json.loads(df.to_json(orient="records"))
        
        return {
            "total": len(lutas),
            "filtro_aplicado": weight if weight else "Nenhum",
            "dados": lutas
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
