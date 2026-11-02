# Plan de pauta · Google Ads + Meta Ads
**Sitio:** https://www.fisiosebastianrengifo.com · **Presupuesto mensual:** Google consultorio $50.000 · Google FISIO 2.0 $50.000 · Meta FISIO 2.0 $100.000 (COP)

> Con $50.000/mes (≈ $1.650/día) Google entrega entre 1 y 3 clics diarios. Es un presupuesto de **prueba**: sirve para descubrir qué palabras y anuncios convierten. Cuando una campaña dé conversiones a buen costo, ahí se sube el presupuesto. Evita repartir aún más: mejor pocas palabras muy exactas que muchas con poco dinero.

---

## 0. Antes de pautar (una sola vez)

1. **Crear la cuenta de Google Ads** (ads.google.com) con la cuenta de Google de Sebas/Destiny. Al crearla, elige "Cambiar al modo experto" para no caer en una campaña inteligente automática.
2. **Etiqueta de Google:** Herramientas → Medición → Conversiones → crea las conversiones de abajo. Al crear la primera, Google muestra el ID `AW-XXXXXXXXX`; cada conversión tiene su **etiqueta** (lo que va después de la barra en `AW-XXXXXXXXX/AbCdEfGh`). Pégalos en `js/config.js` → `tracking` y haz commit. El sitio ya envía los eventos solo; no hay que pegar más código.

   | Conversión en Google Ads | Categoría | Valor | Clave en `config.js` |
   |---|---|---|---|
   | Contacto por WhatsApp | Contacto / cliente potencial | sin valor (o $65.000, el de la valoración) | `conversions.whatsapp` |
   | Llamada (clic en teléfono) | Llamada telefónica | sin valor | `conversions.llamada` |
   | Inscripción FISIO 2.0 | Envío de formulario de clientes potenciales | $699.900 | `conversions.curso` |

   En las tres: "Usar la etiqueta de Google (gtag)", recuento **una vez** por clic, ventana 30 días.
3. **Meta:** business.facebook.com → Orígenes de datos → Píxeles → crear → copiar el **ID del píxel** a `config.js` → `tracking.metaPixelId`. El sitio dispara `PageView`, `Contact` (WhatsApp/teléfono) y `Lead` (formulario FISIO 2.0). Verifica con la extensión "Meta Pixel Helper".
4. **Perfil de Negocio de Google** (business.google.com) verificado para las dos sedes y enlazado a la cuenta de Ads (extensión de ubicación). Es gratis y es lo que más pesa en "fisioterapeuta cerca de mí".
5. Instala en el celular la app de **Google Ads** y revisa la campaña 2 veces por semana la primera quincena.

---

## 1. Google Ads · Consultorio ($50.000/mes)

**Tipo:** Búsqueda · **Objetivo:** Clientes potenciales · **Puja:** Maximizar clics con CPC máximo $2.000 las primeras 3 semanas; luego "Maximizar conversiones" cuando haya ≥15 conversiones.
**Ubicación:** Medellín + Envigado, Sabaneta, Itagüí, Bello (radio 15 km desde el consultorio). Palmira como campaña aparte solo si sube el presupuesto. Opción "Personas que están en la ubicación", nunca "interés en".
**Idioma:** español · **Horario:** lunes a sábado 7:00–20:00 · **Red:** solo Búsqueda (desactiva Display y Partners).
**Página de destino:** `https://www.fisiosebastianrengifo.com/` (y `/#servicios` para el grupo Quiropráctica).

### Grupos de anuncios y palabras clave (concordancia de frase `"..."` y exacta `[...]`)

**Grupo 1 · Fisioterapeuta Medellín**
`[fisioterapeuta medellin]` `[fisioterapia medellin]` `"fisioterapeuta cerca"` `"fisioterapia a domicilio medellin"` (negativa si no se ofrece) `"fisioterapeuta deportivo medellin"`

**Grupo 2 · Dolor lumbar / espalda**
`"fisioterapia dolor lumbar"` `"dolor de espalda tratamiento medellin"` `"hernia discal fisioterapia"` `"dolor lumbar medellin"` `"lumbalgia tratamiento"`

**Grupo 3 · Quiropráctica**
`[quiropractico medellin]` `"quiropraxia medellin"` `"manipulacion vertebral medellin"` `"ajuste de columna medellin"`

**Grupo 4 · ATM / bruxismo**
`"fisioterapia atm"` `"dolor mandibula tratamiento"` `"bruxismo fisioterapia medellin"`

**Palabras negativas (lista compartida):** gratis, curso, cursos, empleo, trabajo, vacante, universidad, carrera, estudiar, pdf, que es, salario, sueldo, eps, sura, sanitas, veterinaria, perro, gato, domicilio (si no aplica).

### Anuncios de búsqueda responsivos (uno por grupo; usa estos textos)
**Títulos (máx. 30 caracteres):** Fisioterapeuta en Medellín · Vive sin dolor · Experto en dolor lumbar · Valoración desde $65.000 · 4.9 ★ en Google · +1.500 pacientes · Agenda por WhatsApp · Quiropráctica en Medellín · Terapia manual + ejercicio · Sebastián Rengifo Fisio · Atención lunes a sábado
**Descripciones (máx. 90):**
- Valoración con pruebas ortopédicas, tratamiento basado en evidencia y acompañamiento real. Agenda hoy.
- Quiropráctica, fisioterapia deportiva, ATM y recuperación muscular. 4.9 ★ en Google. Escríbenos.
- Encontramos el origen de tu dolor y lo tratamos con ejercicio terapéutico y terapia manual.
- Consultorio en Medellín (Cra 77B #45G-61). Lunes a sábado 8 a. m. a 12:30 p. m. Reserva por WhatsApp.
**Extensiones:** enlaces de sitio (Servicios, Recuperación muscular, Sedes, Formación FISIO 2.0), llamada (+57 315 515 9416), ubicación (Perfil de Negocio), texto destacado ("4.9 ★ en Google", "+5 años de experiencia", "Lunes a sábado"), precios (Valoración $65.000, Quiropráctica $150.000, Masaje $120.000).

---

## 2. Google Ads · Formación FISIO 2.0 ($50.000/mes)

**Tipo:** Búsqueda · **Página de destino:** `https://www.fisiosebastianrengifo.com/cursos.html`
**Ubicación:** Colombia completa (los asistentes viajan a Medellín); excluir fuera del país. **Horario:** todos los días.
**Puja:** Maximizar clics, CPC máx. $1.500. Es un nicho pequeño: las búsquedas son pocas pero muy calificadas.

**Palabras clave (un solo grupo):**
`"curso de terapia manual"` `"curso manipulacion vertebral"` `"curso ejercicio terapeutico"` `"cursos para fisioterapeutas"` `"formacion fisioterapia deportiva"` `"diplomado terapia manual colombia"` `"curso fisioterapia medellin"` `"curso quiropraxia fisioterapeutas"` `[fisio 2.0]`
**Negativas:** gratis, pdf, universidad, pregrado, posgrado, maestría, virtual gratis, youtube, empleo, veterinaria.

**Títulos:** Formación FISIO 2.0 · Curso para fisioterapeutas · Terapia manual + ejercicio · Medellín 10 y 11 de abril · 16 h de práctica guiada · +200 fisios formados · Solo 25 cupos · Un solo método · Reserva tu cupo · Manipulaciones paso a paso
**Descripciones:**
- Módulo virtual + 2 días presenciales de práctica en camilla con casos reales. Certificado y grupo privado.
- Aprende cuándo usar cada técnica: valoración, dosificación, manipulación y reintegro deportivo.
- Para fisioterapeutas y estudiantes de último semestre. Inversión $699.900. Cupos limitados.
- Dictado por Sebastián Rengifo, fisioterapeuta deportivo con +5 años de resultados en consulta.

---

## 3. Meta Ads · FISIO 2.0 ($100.000/mes ≈ $3.300/día)

Meta funciona mejor que Google para la formación porque permite mostrar el curso a fisioterapeutas aunque no lo estén buscando. Ejecuta **una sola campaña** con dos conjuntos de anuncios y rota creativos cada 2 semanas.

**Campaña:** Objetivo **Clientes potenciales** → conversión en el sitio web, evento **Lead** (píxel). Si al inicio no hay 10 Leads/semana, usa temporalmente objetivo **Tráfico** (clics al enlace) o **Mensajes a WhatsApp** (lleva directo al chat 315 515 9416 con el mensaje de FISIO 2.0).
**Destino:** `cursos.html` (o `cursos.html#formulario`). Activa el **parámetro de URL** `utm_source=meta&utm_medium=paid&utm_campaign=fisio20`.

**Conjunto A · Intereses (70%):** Colombia; 22–45 años; intereses: Fisioterapia, Terapia física, Kinesiología, Terapia manual, Rehabilitación, Medicina deportiva; cargo: fisioterapeuta / physiotherapist; estudios: Fisioterapia. Ubicaciones: Feed e Historias de Instagram y Facebook, Reels. Acota a Medellín + Bogotá + Cali + Eje Cafetero si el alcance supera 500.000.
**Conjunto B · Retargeting (30%):** personas que visitaron el sitio (píxel) o interactuaron con el Instagram @fisio.sebastian.rengifo en los últimos 90 días, excluyendo quienes ya dispararon Lead. Mensaje de urgencia (cupos/fecha).

**Creativos (3 para empezar; usa las fotos del brochure y videos cortos de Sebas en práctica):**
1. Reel/vertical 15–30 s: Sebas explicando "No es falta de capacidad, es falta de un sistema" sobre tomas de práctica. Texto en pantalla: "FISIO 2.0 · Medellín · 10 y 11 de abril".
2. Imagen cuadrada: foto de grupo con certificados + "+200 fisioterapeutas formados" + "25 cupos".
3. Carrusel 4 tarjetas: ¿Te suena familiar? → Lo que aprendes → Módulo 1 y 2 → Reserva tu cupo.
**Texto principal (versión corta):** "¿Aprendiste técnicas sueltas y no sabes cómo combinarlas en un mismo paciente? En FISIO 2.0 aprendes un solo método: valorar, decidir, tratar y dar el alta con criterios claros. Módulo virtual + 16 h presenciales en Medellín, 10 y 11 de abril de 2027. 25 cupos. Reserva el tuyo 👇"
**Título:** Formación FISIO 2.0 · Ejercicio terapéutico + terapia manual · **Botón:** Más información / Registrarte.

---

## 4. Qué revisar y cuándo

| Semana | Qué mirar | Acción |
|---|---|---|
| 1–2 | Términos de búsqueda reales (Google: Palabras clave → Términos de búsqueda) | Añadir negativas; pausar palabras sin clics. |
| 2–4 | CTR de anuncios (>5% en Búsqueda es bueno), CPC, conversiones | Pausar el anuncio con peor CTR; duplicar el mejor con otro título. |
| 4 | Costo por conversión: consultorio < $25.000 por WhatsApp; curso < $70.000 por formulario | Si una campaña lo cumple, subir su presupuesto +50% y bajar la otra. |
| mensual | Meta: frecuencia < 3, CTR > 1%, costo por Lead | Cambiar creativos cuando la frecuencia pase de 3. |

**Reglas de oro:** nunca activar "Red de Display" ni "Partners de búsqueda" en Búsqueda; revisar que el número de WhatsApp y el formulario funcionen antes de pautar; que la fecha y el valor del curso del anuncio coincidan siempre con los del sitio (`js/config.js`).
