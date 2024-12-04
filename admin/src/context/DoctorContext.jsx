import {createContext} from 'react'

export const DoctorContext = createContext()


import React from 'react'

export default function DoctorContextProvider(props) {
    const value = {}
  return (
   <DoctorContext.Provider value={value}>
    {props.children}
   </DoctorContext.Provider>
  )
}
