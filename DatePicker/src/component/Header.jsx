import React from 'react'
import Akasalogo from '../assets/Akasa.png'
import DateInput from './DatePicker'
export default function Header() {
  return (
    <div>
        <a href="https://www.akasaair.com/" target="_blank">
          <img src={Akasalogo} className="logo" alt="Vite logo" />
        </a>
        <DateInput/>
    </div>
  )
}
