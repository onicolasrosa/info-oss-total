import pytest
import pandas as pd
from unittest.mock import patch, AsyncMock, MagicMock
from scripts.fetch_initial_data import fetch_sample

@pytest.mark.asyncio
async def test_fetch_sample(mocker):
    # 1. MOCK: Criamos objetos falsos simulando a resposta da API
    mock_comp = MagicMock()
    mock_comp.model_dump.return_value = {"id_competition": 123, "name": "Mundial Teste", "has_results": True}
    # Importante: dizemos que a competição tem resultados para o if do código funcionar
    mock_comp.has_results = True 
    
    # 2. MOCK: Simulamos a classe JudoBase inteira
    mock_api_instance = AsyncMock()
    
    # A MÁGICA ACONTECE AQUI: O 'async with' chama o __aenter__. 
    # Precisamos dizer que o retorno dele é a própria instância mockada.
    mock_api_instance.__aenter__.return_value = mock_api_instance
    
    mock_api_instance.all_competition.return_value = [mock_comp]
    mock_api_instance.contests_by_competition_id.return_value = []
    
    # Dizemos ao mocker para substituir a JudoBase real pela nossa falsa
    mocker.patch("scripts.fetch_initial_data.JudoBase", return_value=mock_api_instance)
    
    # Dizemos ao mocker para não salvar o arquivo parquet de verdade
    mock_to_parquet = mocker.patch("pandas.DataFrame.to_parquet")

    # 3. AÇÃO: Rodamos a nossa função
    await fetch_sample()

    # 4. VERIFICAÇÃO (Asserts): O que esperamos que aconteça?
    mock_api_instance.all_competition.assert_called_once()
    mock_api_instance.contests_by_competition_id.assert_called_once_with(123)
    assert mock_to_parquet.call_count == 1