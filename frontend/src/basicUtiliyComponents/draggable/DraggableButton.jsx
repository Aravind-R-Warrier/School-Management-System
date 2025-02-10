import { Button } from '@mui/material'
import React, { useContext } from 'react'
import Draggable from 'react-draggable'
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { AuthContext } from '../../context/AuthContext';

function DraggableButton() {
    const { dark,modeChange } = useContext(AuthContext)

  return (
    <div>
      <Draggable disabled={true}>
<Button style={{zIndex:'999',position:'absolute',top:'22px',right:'215px',color:'white',height:'30px'}} onClick={modeChange}>
{dark?<LightModeIcon/>:<DarkModeIcon/>}
</Button>
      </Draggable>
    </div>
  )
}

export default DraggableButton
