import { useState, useRef, useEffect } from "react";
import axios from "axios";

export default function UsandoApi() {
  const inputRef = useRef();
  const [cidadeUF, setCidadeUF] = useState("");
  const [previsao, setPrevisao] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // lista de cidade se houver mais de uma. Usuário digita Mogi das Cruzes e o sistema retorna Mogi das Cruzes - SP e Mogi Guaçu - SP e Mogi Mirim - SP
  const [listaCidades, setListaCidades] = useState([]);

  const fetchTudo = async (municipio) => {
    setLoading(true);
    setError(null);
    setPrevisao([]);
    setCidadeUF("");

    try {
      // se houver acentuação no parâmetro do município, remova
      municipio = municipio.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

      const idResponse = await axios.get(
        `http://servicos.cptec.inpe.br/XML/listaCidades?city=${municipio}`
      );
      const parser = new DOMParser();
      const xmlDocId = parser.parseFromString(idResponse.data, "text/xml");

      var nodes = xmlDocId.getElementsByTagName("cidade");
      if (nodes.length > 1) {
        const cidadesAchadas = Array.from(nodes).map((n) => ({
          cidade: n.getElementsByTagName("nome")[0].textContent,
          uf: n.getElementsByTagName("uf")[0].textContent,
          id: n.getElementsByTagName("id")[0].textContent,
        }));
        setListaCidades(cidadesAchadas);
      } else {
        setListaCidades([]);
      }

      const cidadeNodeId = xmlDocId.getElementsByTagName("id")[0];
      const id = cidadeNodeId?.textContent;
      if (!id) throw new Error("Cidade não encontrada.");

      const previsaoResponse = await axios.get(
        `http://servicos.cptec.inpe.br/XML/cidade/${id}/previsao.xml`
      );
      const xmlDoc = parser.parseFromString(previsaoResponse.data, "text/xml");

      const cidadeNode = xmlDoc.getElementsByTagName("nome")[0];
      const ufNode = xmlDoc.getElementsByTagName("uf")[0];
      setCidadeUF(cidadeNode.textContent + " - " + ufNode.textContent);

      const previsaoData = Array.from(
        xmlDoc.getElementsByTagName("previsao")
      ).map((p) => {
        const code = p.getElementsByTagName("tempo")[0].textContent;
        const mapa = {
          pn: "Parcialmente Nublado 🌤️",
          n: "Nublado ☁",
          c: "Chuvoso 🌧️",
          e: "Ensolarado ☀️",
          i: "Instável 🌩️",
          t: "Tempestuoso ⛈️",
          v: "Vento 💨",
        };
        return {
          dia: p.getElementsByTagName("dia")[0].textContent,
          tempo: mapa[code] || code,
          maxima: p.getElementsByTagName("maxima")[0].textContent,
          minima: p.getElementsByTagName("minima")[0].textContent,
        };
      });

      setPrevisao(previsaoData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (inputRef.current && inputRef.current.value.trim() === "") {
      inputRef.current.focus();
      return;
    }

    const cidade = inputRef.current.value.trim();
    if (cidade.length > 0) {
      fetchTudo(cidade);
    }
  };

  useEffect(() => {
    listaCidades.forEach((element) => {
      console.log(element);
    });
  }, [listaCidades]);

  return (
    <div>
      <h1>Consulta de Previsão do Tempo</h1>
      <form onSubmit={handleSubmit}>
        <input
          ref={inputRef}
          type="text"
          placeholder="Digite o nome da cidade"
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Carregando...</p>}
      {error && <p>Erro: {error}</p>}

      {cidadeUF && (
        <>
          <h2>Previsão do Tempo para o Município de {cidadeUF}</h2>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>Dia</th>
                <th>Tempo</th>
                <th>Máxima</th>
                <th>Mínima</th>
              </tr>
            </thead>
            <tbody>
              {previsao.map((p) => (
                <tr key={p.dia}>
                  <td>{p.dia}</td>
                  <td>{p.tempo}</td>
                  <td>{p.maxima}</td>
                  <td>{p.minima}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p></p>

          {listaCidades.length > 1 && (
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "20px",
                borderStyle: "solid",
                borderWidth: "1px",
              }}
            >
              <thead>
                <tr style={{ borderStyle: "solid", borderWidth: "1px" }}>
                  <th>Cidades Encontradas</th>
                  <th>UF</th>
                </tr>
              </thead>
              <tbody>
                {listaCidades.map((cidade, index) => (
                  <tr
                    key={listaCidades.id}
                    onMouseDown={() => console.log(cidade.cidade)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "#f0f0f0";
                      e.currentTarget.style.color = "black";
                      e.currentTarget.style.cursor = "pointer";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.cursor = "default";
                    }}
                    style={{ borderStyle: "solid", borderWidth: "1px" }}
                  >
                    <td>{cidade.cidade}</td>
                    <td>{cidade.uf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
}
