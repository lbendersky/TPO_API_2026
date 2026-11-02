#!/usr/bin/env python3
"""
Script de carga de datos de demo para el TPO (marketplace de canchas).

Qué hace:
  - Crea localidades (si no existen).
  - Registra varios usuarios "organizadores" (dueños de canchas) y varios
    "compradores".
  - Publica muchas canchas repartidas entre los organizadores, con
    distintas superficies, formatos y precios.
  - Les asigna fotos: algunas canchas quedan con varias fotos, otras con
    2, y al menos una queda sin ninguna (a propósito, para mostrar el
    placeholder).
  - Crea varios turnos futuros por cancha.
  - Hace que los compradores agreguen turnos al carrito y confirmen el
    pago, generando inscripciones de verdad.
  - Si la cuenta admin configurada abajo ya es ADMIN en la base, también
    crea ofertas (descuentos) sobre algunos turnos y marca algunas
    inscripciones como PAGADO. Si todavía no es admin, el script avisa
    cómo hacerlo y sigue con todo lo demás sin cortarse.

Cómo correrlo:
  1. Backend corriendo en local (por defecto se asume http://localhost:4002,
     cambiá BASE_URL si usás otro puerto).
  2. pip install requests   (si no lo tenés instalado)
  3. python3 seed_demo.py

Se puede correr más de una vez: los usuarios/localidades que ya existen
se reutilizan (no explota si ya corriste el script antes), pero sí te va
a crear canchas y turnos nuevos cada vez que lo corras — si querés una
base bien limpia antes de la demo, mejor vaciá las tablas antes de
correrlo.
"""

import random
import sys
from datetime import datetime, timedelta

try:
    import requests
except ImportError:
    print("Falta el paquete 'requests'. Instalalo con: pip install requests")
    sys.exit(1)

# ----------------------------------------------------------------------
# Configuración
# ----------------------------------------------------------------------

BASE_URL = "http://localhost:4002"

# Contraseña que van a tener TODOS los usuarios que crea este script
# (organizadores, compradores y el admin de demo).
DEMO_PASSWORD = "Demo1234!"

# Cuenta que el script va a usar para las acciones de administrador
# (crear ofertas, marcar pagos). Si todavía no existe, el script la
# registra como usuario común y te avisa el UPDATE que tenés que correr
# en la base para convertirla en ADMIN. Si ya la tenías de antes como
# admin, el script la usa directamente.
ADMIN_EMAIL = "admin-demo@canchas.test"

# ----------------------------------------------------------------------
# Datos de demo
# ----------------------------------------------------------------------

LOCALIDADES = [
    ("Palermo", "CABA"),
    ("Belgrano", "CABA"),
    ("Caballito", "CABA"),
    ("Flores", "CABA"),
    ("Villa Urquiza", "CABA"),
    ("Recoleta", "CABA"),
    ("Núñez", "CABA"),
    ("Almagro", "CABA"),
]

# Cada organizador publica un par de canchas.
ORGANIZADORES = [
    {"nombreUsuario": "clubnorte", "nombre": "Club", "apellido": "Deportivo Norte",
     "dni": "40111001", "telefono": "1150001001", "email": "clubnorte@canchas.test"},
    {"nombreUsuario": "labombonerita", "nombre": "Complejo", "apellido": "La Bombonerita",
     "dni": "40111002", "telefono": "1150001002", "email": "labombonerita@canchas.test"},
    {"nombreUsuario": "estadiochico", "nombre": "Estadio", "apellido": "Chico FC",
     "dni": "40111003", "telefono": "1150001003", "email": "estadiochico@canchas.test"},
    {"nombreUsuario": "potrerosur", "nombre": "Potrero", "apellido": "Sur",
     "dni": "40111004", "telefono": "1150001004", "email": "potrerosur@canchas.test"},
    {"nombreUsuario": "arenadelsol", "nombre": "Arena", "apellido": "del Sol",
     "dni": "40111005", "telefono": "1150001005", "email": "arenadelsol@canchas.test"},
    {"nombreUsuario": "polideportivobelgrano", "nombre": "Polideportivo", "apellido": "Belgrano",
     "dni": "40111006", "telefono": "1150001006", "email": "polideportivobelgrano@canchas.test"},
]

COMPRADORES = [
    {"nombreUsuario": "juanp", "nombre": "Juan", "apellido": "Pérez",
     "dni": "40222001", "telefono": "1150002001", "email": "juanp@canchas.test"},
    {"nombreUsuario": "mica_g", "nombre": "Micaela", "apellido": "Gómez",
     "dni": "40222002", "telefono": "1150002002", "email": "micag@canchas.test"},
    {"nombreUsuario": "lucasr", "nombre": "Lucas", "apellido": "Rodríguez",
     "dni": "40222003", "telefono": "1150002003", "email": "lucasr@canchas.test"},
    {"nombreUsuario": "sofiam", "nombre": "Sofía", "apellido": "Martínez",
     "dni": "40222004", "telefono": "1150002004", "email": "sofiam@canchas.test"},
    {"nombreUsuario": "tomid", "nombre": "Tomás", "apellido": "Díaz",
     "dni": "40222005", "telefono": "1150002005", "email": "tomid@canchas.test"},
]

# Nombre de cancha, superficie, formato, precio base del turno completo.
CANCHAS = [
    ("Cancha Norte 1", "SINTETICO", "F5", 18000),
    ("Cancha Norte 2", "CESPED", "F7", 26000),
    ("La Bombonerita A", "SINTETICO", "F5", 17000),
    ("La Bombonerita B", "PARQUET", "F8", 30000),
    ("Estadio Chico Principal", "CESPED", "F11", 55000),
    ("Estadio Chico Anexo", "SINTETICO", "F7", 27000),
    ("Potrero Sur 1", "CEMENTO", "F5", 12000),
    ("Potrero Sur 2", "SINTETICO", "F5", 16000),
    ("Arena del Sol Techada", "SINTETICO", "F8", 32000),
    ("Arena del Sol Descubierta", "CESPED", "F7", 25000),
    ("Polideportivo Belgrano 1", "PARQUET", "F5", 19000),
    ("Polideportivo Belgrano 2", "SINTETICO", "F8", 29000),
]

# Cuántas fotos precargadas le asignamos a cada cancha (mismo orden que
# CANCHAS de arriba). Está armado a propósito para que haya variedad:
# algunas con varias (4), otras con 2, una sin ninguna (0).
FOTOS_POR_CANCHA = [4, 3, 2, 4, 1, 0, 3, 2, 4, 2, 3, 1]

HORARIOS = ["18:00", "19:00", "20:00", "21:00", "22:00"]
DESCRIPCIONES_TURNO = [
    "Nivel intermedio, traer pechera",
    "Grupo mixto, buena onda",
    "Nivel competitivo",
    "Para recreativos, no hace falta experiencia",
    "",
    "",
]

session = requests.Session()


def log(msg):
    print(msg, flush=True)


def api(method, path, token=None, **kwargs):
    headers = kwargs.pop("headers", {})
    if token:
        headers["Authorization"] = f"Bearer {token}"
    resp = session.request(method, f"{BASE_URL}{path}", headers=headers, timeout=15, **kwargs)
    return resp


# ----------------------------------------------------------------------
# Usuarios
# ----------------------------------------------------------------------

def registrar_o_loguear(datos):
    """Intenta loguear; si el usuario no existe todavía, lo registra.
    Devuelve (token, idUsuario)."""
    resp = api("POST", "/api/v1/auth/authenticate", json={
        "email": datos["email"],
        "contrasena": DEMO_PASSWORD,
    })
    if resp.status_code == 200:
        token = resp.json()["access_token"]
    else:
        # El registro puede chocar (403 = UsuarioDuplicadoException) si el DNI, el
        # teléfono o el nombre de usuario ya existían de antes en tu base (por ejemplo,
        # de pruebas manuales previas). En vez de cortar todo el script, reintenta un
        # par de veces con una variante numérica de esos campos antes de rendirse.
        intento = dict(datos)
        token = None
        for _ in range(5):
            resp = api("POST", "/api/v1/auth/register", json={
                "email": intento["email"],
                "nombre": intento["nombre"],
                "apellido": intento["apellido"],
                "nombreUsuario": intento["nombreUsuario"],
                "dni": intento["dni"],
                "telefono": intento["telefono"],
                "contrasena": DEMO_PASSWORD,
            })
            if resp.status_code == 200:
                token = resp.json()["access_token"]
                break
            if resp.status_code == 403:
                sufijo = random.randint(100, 999)
                intento = dict(intento)
                intento["dni"] = f"{datos['dni']}{sufijo}"
                intento["telefono"] = f"{datos['telefono']}{sufijo}"
                intento["nombreUsuario"] = f"{datos['nombreUsuario']}{sufijo}"
                continue
            raise RuntimeError(f"No se pudo registrar a {datos['email']}: {resp.status_code} {resp.text}")
        if token is None:
            raise RuntimeError(
                f"No se pudo registrar a {datos['email']} después de varios intentos (siempre 403). "
                f"Es raro que sea casualidad -- revisá si ese email ya existe en tu base con otra "
                f"contraseña distinta a {DEMO_PASSWORD}."
            )

    resp = api("GET", "/usuarios", token=token, params={"email": datos["email"]})
    resp.raise_for_status()
    usuario = resp.json()
    return token, usuario["idUsuario"]


# ----------------------------------------------------------------------
# Localidades
# ----------------------------------------------------------------------

def cargar_localidades(token):
    resp = api("GET", "/localidades", token=token)
    resp.raise_for_status()
    existentes = {l["nombre"]: l["idLocalidad"] for l in resp.json()}

    ids = {}
    for nombre, provincia in LOCALIDADES:
        if nombre in existentes:
            ids[nombre] = existentes[nombre]
            continue
        resp = api("POST", "/localidades", token=token, json={"nombre": nombre, "provincia": provincia})
        if resp.status_code not in (200, 201):
            log(f"  ! No se pudo crear la localidad {nombre}: {resp.status_code} {resp.text}")
            continue
        ids[nombre] = resp.json()["idLocalidad"]
        log(f"  + Localidad creada: {nombre}")
    return ids


# ----------------------------------------------------------------------
# Imágenes precargadas
# ----------------------------------------------------------------------

def obtener_precargadas():
    resp = api("GET", "/imagenes/precargadas")
    if resp.status_code != 200:
        return []
    return [img["id"] for img in resp.json() if img.get("id") is not None]


def asignar_fotos(token, id_cancha, cantidad, precargadas):
    if cantidad <= 0 or not precargadas:
        return
    for i in range(cantidad):
        id_imagen = precargadas[i % len(precargadas)]
        resp = api("POST", "/imagenes/precargada", token=token,
                    json={"idCancha": id_cancha, "idImagenPrecargada": id_imagen})
        if resp.status_code != 200:
            log(f"    ! No se pudo asignar foto a la cancha {id_cancha}: {resp.status_code}")


# ----------------------------------------------------------------------
# Canchas y turnos
# ----------------------------------------------------------------------

def publicar_cancha(token, nombre, direccion, id_localidad, superficie, formato, precio, descripcion):
    resp = api("POST", "/canchas", token=token, json={
        "nombre": nombre,
        "direccion": direccion,
        "idLocalidad": id_localidad,
        "tipoSuperficie": superficie,
        "tipoFutbol": formato,
        "precioUnitario": precio,
        "descripcion": descripcion,
    })
    if resp.status_code not in (200, 201):
        raise RuntimeError(f"No se pudo publicar la cancha {nombre}: {resp.status_code} {resp.text}")
    return resp.json()


def crear_turno(token, id_cancha, fecha_hora_iso, precio_por_jugador, descripcion):
    resp = api("POST", "/turnos", token=token, json={
        "fechaHora": fecha_hora_iso,
        "precioPorJugador": precio_por_jugador,
        "descripcion": descripcion,
        "idCancha": id_cancha,
    })
    if resp.status_code not in (200, 201):
        return None
    return resp.json()


# ----------------------------------------------------------------------
# Main
# ----------------------------------------------------------------------

def main():
    log(f"Usando backend en {BASE_URL}")
    log("")
    log("== 1) Usuarios organizadores ==")
    organizadores_tokens = []
    for datos in ORGANIZADORES:
        token, id_usuario = registrar_o_loguear(datos)
        organizadores_tokens.append((datos, token, id_usuario))
        log(f"  - {datos['email']} listo (id {id_usuario})")

    log("")
    log("== 2) Usuarios compradores ==")
    compradores_tokens = []
    for datos in COMPRADORES:
        token, id_usuario = registrar_o_loguear(datos)
        compradores_tokens.append((datos, token, id_usuario))
        log(f"  - {datos['email']} listo (id {id_usuario})")

    log("")
    log("== 3) Cuenta admin de demo ==")
    admin_datos = {
        "nombreUsuario": "admindemo",
        "nombre": "Admin",
        "apellido": "Demo",
        "dni": "40333001",
        "telefono": "1150003001",
        "email": ADMIN_EMAIL,
    }
    admin_token, admin_id = registrar_o_loguear(admin_datos)
    log(f"  - {ADMIN_EMAIL} logueado (id {admin_id})")

    log("")
    log("== 4) Localidades ==")
    ids_localidad = cargar_localidades(organizadores_tokens[0][1])

    log("")
    log("== 5) Fotos precargadas disponibles ==")
    precargadas = obtener_precargadas()
    if precargadas:
        log(f"  - Hay {len(precargadas)} imagen(es) precargada(s) en la base, se van a reutilizar.")
    else:
        log("  ! No hay imágenes precargadas en la base todavía, así que ninguna cancha va a "
            "quedar con fotos (se va a ver el logo de pelota por defecto en todas). Si querés "
            "fotos de verdad, subí al menos una imagen precargada antes de correr el script de nuevo.")

    log("")
    log("== 6) Publicando canchas y turnos ==")
    nombres_localidad = list(ids_localidad.keys())
    canchas_creadas = []  # (cancha_response, token_organizador)
    turnos_creados = []   # turno_response

    hoy = datetime.now()

    for i, (nombre, superficie, formato, precio) in enumerate(CANCHAS):
        organizador = ORGANIZADORES[i % len(ORGANIZADORES)]
        token_org = next(t for d, t, _ in organizadores_tokens if d is organizador)
        localidad_nombre = nombres_localidad[i % len(nombres_localidad)] if nombres_localidad else None
        if localidad_nombre is None:
            log(f"  ! No hay localidades cargadas, se salta la cancha {nombre}")
            continue
        id_localidad = ids_localidad[localidad_nombre]

        direccion = f"Av. Demo {1000 + i * 37}"
        descripcion = f"{nombre}, cancha de {formato.replace('F', 'fútbol ')} en {localidad_nombre}."

        cancha = publicar_cancha(token_org, nombre, direccion, id_localidad, superficie, formato,
                                  precio, descripcion)
        log(f"  + Cancha publicada: {nombre} (id {cancha['idCancha']}, {localidad_nombre})")

        asignar_fotos(token_org, cancha["idCancha"], FOTOS_POR_CANCHA[i], precargadas)
        if FOTOS_POR_CANCHA[i] > 0:
            log(f"    -> {FOTOS_POR_CANCHA[i]} foto(s) asignada(s)")
        else:
            log("    -> sin fotos (a propósito)")

        canchas_creadas.append((cancha, token_org))

        # 3 a 5 turnos futuros por cancha, en distintos días y horarios.
        cantidad_turnos = random.randint(3, 5)
        dias_usados = random.sample(range(2, 20), cantidad_turnos)
        for dia_offset in dias_usados:
            hora = random.choice(HORARIOS)
            fecha = (hoy + timedelta(days=dia_offset)).strftime("%Y-%m-%d")
            fecha_hora_iso = f"{fecha}T{hora}:00"
            precio_jugador = round(precio / 10) if "11" not in formato else round(precio / 22)
            descripcion_turno = random.choice(DESCRIPCIONES_TURNO)

            turno = crear_turno(token_org, cancha["idCancha"], fecha_hora_iso, precio_jugador,
                                 descripcion_turno)
            if turno is None:
                continue  # probablemente se superpuso con otro turno ya creado, se salta
            turnos_creados.append(turno)

        log(f"    -> {len([t for t in turnos_creados if t['idCancha'] == cancha['idCancha']])} turno(s) creado(s)")

    log("")
    log(f"Total: {len(canchas_creadas)} canchas, {len(turnos_creados)} turnos.")

    # --------------------------------------------------------------
    # 7) Ofertas (requiere que ADMIN_EMAIL ya sea ADMIN en la base)
    # --------------------------------------------------------------
    log("")
    log("== 7) Ofertas (requiere cuenta ADMIN) ==")
    ofertas_creadas = 0
    es_admin = False
    if turnos_creados:
        turno_prueba = turnos_creados[0]
        resp_prueba = api("POST", "/ofertas", token=admin_token, json={
            "idTurno": turno_prueba["idTurno"],
            "porcentajeDescuento": 15,
            "fechaInicio": hoy.strftime("%Y-%m-%d"),
            "fechaFin": (hoy + timedelta(days=30)).strftime("%Y-%m-%d"),
        })
        if resp_prueba.status_code in (200, 201):
            es_admin = True
            ofertas_creadas += 1
            log(f"  + Oferta creada sobre el turno {turno_prueba['idTurno']}")
        elif resp_prueba.status_code == 403:
            log(f"  ! La cuenta {ADMIN_EMAIL} todavía no es ADMIN, así que no se pueden crear ofertas.")
            log(f"    Corré esto en tu base y volvé a correr el script:")
            log(f"    UPDATE usuario SET rol = 'ADMIN' WHERE email = '{ADMIN_EMAIL}';")
        else:
            log(f"  ! Fallo inesperado creando la oferta de prueba: {resp_prueba.status_code} {resp_prueba.text}")

    if es_admin:
        # una oferta cada 3 turnos aprox, variando el descuento
        candidatos = turnos_creados[1:]
        random.shuffle(candidatos)
        for turno in candidatos[: max(1, len(candidatos) // 3)]:
            descuento = random.choice([10, 15, 20, 25, 30, 40])
            resp = api("POST", "/ofertas", token=admin_token, json={
                "idTurno": turno["idTurno"],
                "porcentajeDescuento": descuento,
                "fechaInicio": hoy.strftime("%Y-%m-%d"),
                "fechaFin": (hoy + timedelta(days=30)).strftime("%Y-%m-%d"),
            })
            if resp.status_code in (200, 201):
                ofertas_creadas += 1
        log(f"  Total ofertas creadas: {ofertas_creadas}")

    # --------------------------------------------------------------
    # 8) Compradores: carrito + checkout -> inscripciones
    # --------------------------------------------------------------
    log("")
    log("== 8) Compradores reservando turnos (carrito + checkout) ==")
    inscripciones_creadas = []
    turnos_disponibles = [t for t in turnos_creados]

    for datos, token, _id in compradores_tokens:
        if not turnos_disponibles:
            break
        cantidad_compras = random.randint(2, 4)
        elegidos = random.sample(turnos_disponibles, min(cantidad_compras, len(turnos_disponibles)))
        agregados = 0
        for turno in elegidos:
            resp = api("POST", "/carrito/items", token=token, json={
                "idTurno": turno["idTurno"],
                "cantidad": random.choice([1, 1, 1, 2]),
            })
            if resp.status_code == 200:
                agregados += 1
        if agregados == 0:
            continue
        resp = api("POST", "/carrito/checkout", token=token)
        if resp.status_code == 200:
            nuevas = resp.json()
            inscripciones_creadas.extend(nuevas)
            log(f"  + {datos['email']} compró {len(nuevas)} inscripción(es)")
        else:
            log(f"  ! {datos['email']} no pudo pagar: {resp.status_code} {resp.text}")

    log(f"  Total inscripciones creadas: {len(inscripciones_creadas)}")

    # --------------------------------------------------------------
    # 9) Marcar algunas inscripciones como PAGADO (requiere admin)
    # --------------------------------------------------------------
    if es_admin and inscripciones_creadas:
        log("")
        log("== 9) Marcando parte de las inscripciones como PAGADO ==")
        a_marcar = random.sample(inscripciones_creadas, max(1, len(inscripciones_creadas) // 2))
        marcadas = 0
        for inscripcion in a_marcar:
            resp = api("PUT", f"/inscripciones/{inscripcion['idInscripcion']}/estado-pago",
                       token=admin_token, params={"nuevoEstado": "PAGADO"})
            if resp.status_code == 200:
                marcadas += 1
        log(f"  Marcadas como PAGADO: {marcadas} de {len(a_marcar)}")

    log("")
    log("========================================")
    log("Listo. Resumen:")
    log(f"  Organizadores: {len(organizadores_tokens)}")
    log(f"  Compradores: {len(compradores_tokens)}")
    log(f"  Localidades: {len(ids_localidad)}")
    log(f"  Canchas: {len(canchas_creadas)}")
    log(f"  Turnos: {len(turnos_creados)}")
    log(f"  Ofertas: {ofertas_creadas}")
    log(f"  Inscripciones: {len(inscripciones_creadas)}")
    log("")
    log(f"  Todos los usuarios creados tienen la contraseña: {DEMO_PASSWORD}")
    log(f"  Cuenta admin de demo: {ADMIN_EMAIL}")
    if not es_admin:
        log(f"  (todavía no es ADMIN -> correr el UPDATE de arriba y volver a ejecutar el script")
        log(f"   para que también se creen las ofertas y se marquen pagos)")
    log("========================================")


if __name__ == "__main__":
    main()
