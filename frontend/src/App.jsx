import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [competicoes, setCompeticoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('competicoes') // Estado da aba atual

  useEffect(() => {
    fetch('http://127.0.0.1:8000/competicoes?limit=10')
      .then(response => response.json())
      .then(data => {
        setCompeticoes(data.dados)
        setLoading(false)
      })
      .catch(error => {
        console.error("Erro ao buscar dados:", error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="container">
      <h1>Info Oss Total 🥋</h1>
      <p>Dashboard de Dados de Judô</p>

      {/* Navegação das Abas */}
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'competicoes' ? 'active' : ''}`}
          onClick={() => setActiveTab('competicoes')}
        >
          Competições
        </button>
        <button 
          className={`tab-btn ${activeTab === 'lutas' ? 'active' : ''}`}
          onClick={() => setActiveTab('lutas')}
        >
          Lutas
        </button>
      </div>
      
      {/* Conteúdo baseado na aba ativa */}
      {activeTab === 'competicoes' && (
        <>
          {loading ? (
            <p>Carregando dados da API...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome do Campeonato</th>
                  <th>Cidade</th>
                  <th>País</th>
                </tr>
              </thead>
              <tbody>
                {competicoes.map(comp => (
                  <tr key={comp.id_competition}>
                    <td>{comp.id_competition}</td>
                    <td>{comp.name}</td>
                    <td>{comp.city}</td>
                    <td>{comp.country}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {activeTab === 'lutas' && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          <h3>Tabela de Lutas em construção... 🚧</h3>
          <p>Na próxima etapa, vamos puxar os dados da API aqui!</p>
        </div>
      )}
    </div>
  )
}

export default App