import { Menu } from 'lucide-react'

export default function Header() {
  return (
    <header className="header">
      <div className="header-left">
        <button className="menu-btn"><Menu size={28} /></button>
        <img className='logo' src="./src/assets/logocafe.png" alt="logo" />
        <h1>Bookend coffe</h1>
      </div>
    </header>
  )
}