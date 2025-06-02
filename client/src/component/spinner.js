
import {HashLoader} from "react-spinners";

import React from 'react'

function Spinner() {
  return (
    <div className="flex items-center justify-center h-screen">
        <HashLoader size = {80} color="#a033ff" />
    </div>
    
  )
}

export default Spinner