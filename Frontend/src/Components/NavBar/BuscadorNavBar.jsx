export const BuscadorNavBar= () =>{
    return (
        <>
            <input
                type="text"
                placeholder="Buscar canchas, barrios..."
                className="w-48 bg-transparent text-gray-600 placeholder-gray-500 outline-none"
            />
            <span className="h-5 w-px bg-gray-300" />
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                HOY
            </div>
        </>
    )
}