// frontend/src/App.jsx
import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [competicoes, setCompeticoes] = useState([])
  const [loading, setLoading] = useState(true)

  // O useEffect roda assim que a tela carrega
  useEffect(() => {
    // Faz a requisição para a nossa API FastAPI
    fetch('http://127.0.0.1:8000/competicoes?limit=10')
      .then(response => response.json())
      .then(data => {
        setCompeticoes(data.dados) // Salva a lista de competições no estado
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
      <p>Dashboard de Competições de Judô</p>
      
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
    </div>
  )
}

export default App