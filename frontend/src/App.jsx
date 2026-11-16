import { useState, useEffect, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
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

    fetch('http://127.0.0.1:8000/lutas?limit=100')
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

  const dadosGrafico = useMemo(() => {
    const contagem = {}
    lutas.forEach(luta => {
      const peso = luta.weight || "Desconhecido" // Proteção contra nulos
      contagem[peso] = (contagem[peso] || 0) + 1
    })
    
    return Object.keys(contagem).map(peso => ({
      categoria: peso,
      quantidade: contagem[peso]
    })).sort((a, b) => {
      // Transforma em String para garantir que não quebre
      const numA = Math.abs(parseFloat(String(a.categoria).replace('+', ''))) + (String(a.categoria).startsWith('+') ? 0.1 : 0)
      const numB = Math.abs(parseFloat(String(b.categoria).replace('+', ''))) + (String(b.categoria).startsWith('+') ? 0.1 : 0)
      return numA - numB
    })
  }, [lutas])

  return (
    <div className="container">
      <h1>Info Oss Total 🥋</h1>
      <p>Dashboard de Dados de Judô</p>

      <div className="tabs">
        <button className={`tab-btn ${activeTab === 'competicoes' ? 'active' : ''}`} onClick={() => setActiveTab('competicoes')}>Competições</button>
        <button className={`tab-btn ${activeTab === 'lutas' ? 'active' : ''}`} onClick={() => setActiveTab('lutas')}>Lutas</button>
        <button className={`tab-btn ${activeTab === 'estatisticas' ? 'active' : ''}`} onClick={() => setActiveTab('estatisticas')}>Estatísticas 📊</button>
      </div>
      
      {activeTab === 'competicoes' && (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>ID</th><th>Nome do Campeonato</th><th>Cidade</th><th>País</th></tr></thead>
            <tbody>
              {competicoes.map(comp => (
                <tr key={comp.id_competition}><td>{comp.id_competition}</td><td>{comp.name}</td><td>{comp.city}</td><td>{comp.country}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'lutas' && (
        <div className="table-wrapper">
          <table>
            <thead><tr><th>Campeonato</th><th>Data</th><th>Categoria</th><th>Atleta Branco</th><th>Atleta Azul</th><th>Vencedor</th><th>Duração</th></tr></thead>
            <tbody>
              {lutas.slice(0, 10).map(luta => {
                const nomeVencedor = luta.id_winner === luta.id_person_white ? luta.person_white : luta.person_blue;
                return (
                  <tr key={luta.id_fight}>
                    <td>{luta.competition_name}</td><td>{luta.competition_date}</td><td>{luta.weight}</td>
                    <td>{luta.person_white}</td><td>{luta.person_blue}</td>
                    <td style={{ fontWeight: 'bold', color: '#007bff' }}>{nomeVencedor}</td><td>{luta.duration}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'estatisticas' && !loading && (
        <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
          <h3>Distribuição de Lutas por Categoria de Peso</h3>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <XAxis dataKey="categoria" />
              <YAxis allowDecimals={false} />
              <Tooltip cursor={{ fill: '#f1f1f1' }} />
              <Bar dataKey="quantidade" fill="#007bff" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  )
}

export default App