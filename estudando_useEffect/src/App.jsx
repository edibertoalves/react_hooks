import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

// import Basico  from './components/Basico'
// import AlternandoBotoes from './components/Alternando_Botoes'
import UsandoApi from './components/usando_api'

// import BasicoComProps from './components/basico_com_props'


function App() {

  return (
    <>
      <div>
        {/* <Basico /> */}
        {/* <AlternandoBotoes /> */}
        <UsandoApi/>
        {/* <BasicoComProps Nome="Teste" /> */}
      </div>
    </>
  )
}

export default App
