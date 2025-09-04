import { useEffect } from 'react';

export default function Basico() {

    useEffect(() => {
        console.log('useEffect executado!');
     },[]);

     return (
        <div>
            <h1>useEffect Básico</h1>
            <p>Abra o console do navegador para ver a mensagem do useEffect.</p>
        </div>
     )
}

