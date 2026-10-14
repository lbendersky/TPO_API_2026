import UsuarioNavBar from "./UsuarioNavBar"

export const BotonUsuarioNavBar = ({ irAPerfil }) => {
  return (
    <>
        <button onClick={irAPerfil}>
            <UsuarioNavBar/>
        </button>
    </>
  )
}