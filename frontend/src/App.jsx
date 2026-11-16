import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [competicoes, setCompeticoes] = useState([])
  const [lutas, setLutas] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('competicoes')

  useEffect(() => {
    fetch('http://127.0.0.1:8000/competicoes?limit=10')
      .then(response => response.json())
      .then(data => setCompeticoes(data.dados))

    fetch('http://127.0.0.1:8000/lutas?limit=10')
      .then(response => response.json())
      .then(data => {
        setLutas(data.dados)
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
      
      {activeTab === 'competicoes' && (
        <>
          {loading ? (
            <p>Carregando dados...</p>
          ) : (
            <div className="table-wrapper">
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
            </div>
          )}
        </>
      )}

      {activeTab === 'lutas' && (
        <>
          {loading ? (
            <p>Carregando dados...</p>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Campeonato</th>
                    <th>Data</th>
                    <th>Categoria</th>
                    <th>Atleta Branco</th>
                    <th>Atleta Azul</th>
                    <th>Vencedor</th>
                    <th>Duração</th>
                  </tr>
                </thead>
                <tbody>
                  {lutas.map(luta => {
                    const nomeVencedor = luta.id_winner === luta.id_person_white 
                      ? luta.person_white 
                      : luta.person_blue;

                    return (
                      <tr key={luta.id_fight}>
                        <td>{luta.competition_name}</td>
                        <td>{luta.competition_date}</td>
                        <td>{luta.weight}</td>
                        <td>{luta.person_white}</td>
                        <td>{luta.person_blue}</td>
                        <td style={{ fontWeight: 'bold', color: '#007bff' }}>{nomeVencedor}</td>
                        <td>{luta.duration}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default App