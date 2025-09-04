import { useEffect, useState, useRef } from "react";

export default function BasicoComProps({ Nome }) {
  const [nome, setNome] = useState(Nome);

  useEffect(() => {
    if (nome.length > 10) {
      alert("Nome muito grande");
    }
  }, [nome]);



  const handleSubmit = () => {
    if (nome.length === 0 || nome === "") {
      console.warn("Nome vazio");
    } else if (nome.length < 3) {
      console.warn("Nome muito curto");
    } else {
      console.info("Nome válido");
    }
  };

  return (
    <div>
      <h1>Digite um nome</h1>
      <input
        style={{ fontSize: "18px" }}
        type="text"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
      />
      <button onClick={handleSubmit}>Enviar</button>

    </div>
  );
}
