"""
Script inicial de ingestão: baixa uma amostra de competições e lutas
da API pública da IJF via wrapper judobase e salva em data/raw/.
"""
import asyncio
from pathlib import Path

import pandas as pd
from judobase import JudoBase

# Descobre o caminho da pasta raiz do projeto e aponta para data/raw
RAW_DIR = Path(__file__).resolve().parent.parent / "data" / "raw"
RAW_DIR.mkdir(parents=True, exist_ok=True)

async def fetch_sample() -> None:
    print("Conectando à API da IJF...")
    async with JudoBase() as api:
        # 1. Competições
        print("Buscando competições...")
        competitions = await api.all_competition()
        
        comp_data = [c.model_dump() for c in competitions[:20]]
        comp_df = pd.DataFrame(comp_data)
        
        comp_path = RAW_DIR / "competitions_sample.parquet"
        comp_df.to_parquet(comp_path, index=False)
        print(f"✅ Competições salvas: {comp_path} ({len(comp_df)} linhas)")
        
        # 2. Lutas (Contests) - Buscando um campeonato que JÁ TENHA resultados
        print("\nProcurando uma competição com resultados...")
        
        target_comp = None
        for c in competitions:
            # Verifica se a competição tem resultados
            if getattr(c, "has_results", False):
                target_comp = c
                break
        
        if target_comp:
            first_comp_dict = target_comp.model_dump()
            comp_id = first_comp_dict.get("id_competition")
            comp_name = first_comp_dict.get("name")
            comp_year = first_comp_dict.get("comp_year")
            
            print(f"Competição encontrada: {comp_name} ({comp_year}) - ID: {comp_id}")
            print("Buscando as primeiras 50 lutas...")
            
            contests = await api.contests_by_competition_id(comp_id)
            
            contest_data = [c.model_dump() for c in contests[:50]]
            
            if contest_data:
                contests_df = pd.DataFrame(contest_data)
                contests_path = RAW_DIR / "contests_sample.parquet"
                contests_df.to_parquet(contests_path, index=False)
                print(f"✅ Lutas salvas: {contests_path} ({len(contests_df)} linhas)")
                print(f"   Colunas encontradas: {list(contests_df.columns)}")
            else:
                print("⚠️ A API não retornou lutas para esta competição.")
        else:
            print("⚠️ Nenhuma competição recente com resultados foi encontrada na amostra.")

if __name__ == "__main__":
    asyncio.run(fetch_sample())
