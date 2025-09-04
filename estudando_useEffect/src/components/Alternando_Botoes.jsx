import { useState, useEffect } from 'react';
export default function AlternandoBotoes() {

    const [mensagem, setMensagem] = useState('');

    useEffect(() => {
        console.log(`Você clicou no botão ${mensagem}`);
    }, [mensagem]);

    return (
        <div>
            <h1>useEffect Alternando Botões</h1>
            <p>Abra o console do navegador para ver a mensagem do useEffect.</p>
            <button onClick={() => setMensagem('posts')} >Posts</button>
            <button onClick={() => setMensagem('todos')}>todos</button>
        </div>
    );
}