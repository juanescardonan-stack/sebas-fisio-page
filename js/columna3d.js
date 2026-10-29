/* ============================================================================
   Columna vertebral 3D para el hero (Three.js)
   - Se monta dentro de #columna3d (dentro de .hero-photo) y reemplaza la foto.
   - Si WebGL no está disponible, no hace nada y la foto queda como respaldo.
   - Paleta integrada con el sitio: fondo azul profundo (--primary-deep),
     hueso marfil, discos y contraluz en el teal de acento (--accent).
   ============================================================================ */
import * as THREE from 'three';

const CONFIG = {
  velocidadGiro: 0.0045,      // radianes por frame (a 60 fps)
  sentidoHorario: true,       // giro horario visto desde arriba
  mostrarEtiquetas: false,    // C1…L5 y S junto a cada vértebra
  colorHueso: '#e3d6bd',      // base de la textura ósea (marfil cálido)
  colorDisco: 0x19b39c,       // --accent del sitio
  colorContraluz: 0x3fd0b8,   // teal claro para el borde iluminado
  colorRelleno: 0x0d6e8f      // --primary del sitio
};

const contenedor = document.getElementById('columna3d');
if (contenedor && soportaWebGL()) iniciar();

function soportaWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch (e) { return false; }
}

function iniciar() {
  /* ---------------- Escena / cámara / render ---------------- */
  const escena = new THREE.Scene();                 // sin fondo: el degradado lo pone el CSS
  const camara = new THREE.PerspectiveCamera(36, 1, 0.1, 200);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.setClearColor(0x000000, 0);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  contenedor.appendChild(renderer.domElement);

  /* ---------------- Luces (clave cálida, contraluz teal, relleno azul) ---------------- */
  escena.add(new THREE.HemisphereLight(0xfff4e6, 0x08303f, 0.6));

  const luzClave = new THREE.DirectionalLight(0xfff3e2, 2.3);
  luzClave.position.set(6, 9, 8);
  luzClave.castShadow = true;
  luzClave.shadow.mapSize.set(1024, 1024);
  luzClave.shadow.camera.left = luzClave.shadow.camera.bottom = -12;
  luzClave.shadow.camera.right = luzClave.shadow.camera.top = 12;
  luzClave.shadow.camera.far = 50;
  luzClave.shadow.bias = -0.0005;
  escena.add(luzClave);

  const luzContra = new THREE.DirectionalLight(CONFIG.colorContraluz, 1.8);
  luzContra.position.set(-7, 3, -8);
  escena.add(luzContra);

  const luzRelleno = new THREE.PointLight(CONFIG.colorRelleno, 30, 60, 2);
  luzRelleno.position.set(-6, -5, 7);
  escena.add(luzRelleno);

  /* ---------------- Materiales ---------------- */
  const texHueso = crearTexturaHueso(renderer);
  const matHueso = new THREE.MeshStandardMaterial({ map: texHueso, bumpMap: texHueso, bumpScale: 0.035, roughness: 0.78, metalness: 0 });
  const matDisco = new THREE.MeshPhysicalMaterial({
    color: CONFIG.colorDisco, emissive: CONFIG.colorDisco, emissiveIntensity: 0.28,
    roughness: 0.35, clearcoat: 0.5, clearcoatRoughness: 0.3, transparent: true, opacity: 0.95
  });
  const matForamen = new THREE.MeshStandardMaterial({ color: 0x3a2e1f, roughness: 1 });

  const ARRIBA = new THREE.Vector3(0, 1, 0);

  /* ---------------- Utilidades geométricas ---------------- */
  // Hueso alargado que se afina de la base a la punta, con extremos redondeados
  function huesoEntre(a, b, rBase, rPunta, escalaX = 1, escalaZ = 1) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const perfil = [], pasos = 10;
    for (let i = 0; i <= pasos; i++) {
      const t = i / pasos, y = t * len;
      let r = rBase + (rPunta - rBase) * t;
      const capBase = Math.min(1, y / rBase), capPunta = Math.min(1, (len - y) / rPunta);
      r *= Math.sqrt(Math.max(0, 1 - Math.pow(1 - capBase, 2))) * Math.sqrt(Math.max(0, 1 - Math.pow(1 - capPunta, 2)));
      perfil.push(new THREE.Vector2(Math.max(r, 0.001), y));
    }
    perfil[0].x = 0; perfil[pasos].x = 0;
    const m = new THREE.Mesh(new THREE.LatheGeometry(perfil, 14), matHueso);
    m.position.copy(a);
    m.quaternion.setFromUnitVectors(ARRIBA, dir.normalize());
    m.scale.set(escalaX, 1, escalaZ);
    m.castShadow = m.receiveShadow = true;
    return m;
  }

  function capsulaEntre(a, b, radio, escalaX = 1, escalaZ = 1) {
    const dir = new THREE.Vector3().subVectors(b, a);
    const len = dir.length();
    const m = new THREE.Mesh(new THREE.CapsuleGeometry(radio, Math.max(len - radio * 2, 0.01), 5, 12), matHueso);
    m.position.copy(a).add(b).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(ARRIBA, dir.normalize());
    m.scale.set(escalaX, 1, escalaZ);
    m.castShadow = m.receiveShadow = true;
    return m;
  }

  // Cuerpo vertebral "acinturado" (perfil revolucionado)
  function geoCuerpo(radio, alto) {
    const h = alto / 2;
    const p = [
      [0, -h], [0.82 * radio, -h], [0.96 * radio, -h + 0.06 * alto], [radio, -h + 0.16 * alto],
      [0.93 * radio, -0.25 * alto], [0.89 * radio, 0], [0.93 * radio, 0.25 * alto],
      [radio, h - 0.16 * alto], [0.96 * radio, h - 0.06 * alto], [0.82 * radio, h], [0, h]
    ].map(([x, y]) => new THREE.Vector2(x, y));
    return new THREE.LatheGeometry(p, 36);
  }

  /* ---------------- Una vértebra (local: +y arriba, +z anterior) ---------------- */
  function crearVertebra(s, alto, region, idx) {
    const v = new THREE.Group();

    const cuerpo = new THREE.Mesh(geoCuerpo(s, alto), matHueso);
    cuerpo.scale.x = 1.18;
    cuerpo.castShadow = cuerpo.receiveShadow = true;
    v.add(cuerpo);

    const zCuerpo = -0.86 * s, zArco = -(0.86 * s + 0.42 * s), xPed = 0.42 * s;
    [-1, 1].forEach(l => v.add(capsulaEntre(
      new THREE.Vector3(l * xPed, 0.04 * alto, zCuerpo), new THREE.Vector3(l * xPed, 0.04 * alto, zArco), 0.11 * s, 1, 1.1)));

    const arco = new THREE.Mesh(new THREE.TorusGeometry(xPed, 0.115 * s, 9, 24, Math.PI), matHueso);
    arco.rotation.x = -Math.PI / 2;
    arco.position.set(0, 0.04 * alto, zArco);
    arco.scale.set(1, 1.08, 1);
    arco.castShadow = arco.receiveShadow = true;
    v.add(arco);

    [-1, 1].forEach(l => [1, -1].forEach(sup => {
      const c = new THREE.Mesh(new THREE.SphereGeometry(0.15 * s, 12, 10), matHueso);
      c.position.set(l * (xPed + 0.02 * s), sup * (alto * 0.38), zArco - 0.08 * s);
      c.scale.set(0.9, 1.3, 0.7);
      c.castShadow = true;
      v.add(c);
    }));

    const zEsp0 = zArco - xPed + 0.05 * s;
    const pe = { C: { len: 0.8, ang: -0.4, rb: 0.16, rp: 0.09, ex: 0.55 },
                 T: { len: 1.5, ang: -0.95, rb: 0.19, rp: 0.07, ex: 0.45 },
                 L: { len: 1.25, ang: -0.18, rb: 0.24, rp: 0.17, ex: 0.42 } }[region];
    const finEsp = new THREE.Vector3(0, Math.sin(pe.ang) * pe.len * s, zEsp0 - Math.cos(pe.ang) * pe.len * s);
    v.add(huesoEntre(new THREE.Vector3(0, 0.02 * alto, zEsp0 + 0.1 * s), finEsp, pe.rb * s, pe.rp * s, pe.ex, 1));
    if (region === 'C' && idx >= 1 && idx <= 5) {
      [-1, 1].forEach(l => {
        const b = new THREE.Mesh(new THREE.SphereGeometry(0.085 * s, 8, 6), matHueso);
        b.position.copy(finEsp).add(new THREE.Vector3(l * 0.09 * s, 0, 0));
        v.add(b);
      });
    }

    const pt = { C: { len: 0.55, ang: 0.15, rb: 0.16, rp: 0.09 },
                 T: { len: 0.85, ang: 0.55, rb: 0.2, rp: 0.12 },
                 L: { len: 1.0, ang: 0.2, rb: 0.17, rp: 0.08 } }[region];
    [-1, 1].forEach(l => {
      const ini = new THREE.Vector3(l * xPed * 0.75, 0.1 * alto, zArco + 0.08 * s);
      const fin = new THREE.Vector3(l * (xPed + Math.cos(pt.ang) * pt.len * s), 0.08 * alto - 0.1 * s, zArco - Math.sin(pt.ang) * pt.len * s);
      v.add(huesoEntre(ini, fin, pt.rb * s, pt.rp * s, 1, 0.65));
    });

    if (region === 'C' && idx > 1) {
      [-1, 1].forEach(l => {
        const u = new THREE.Mesh(new THREE.SphereGeometry(0.12 * s, 8, 6), matHueso);
        u.position.set(l * 0.95 * s, alto * 0.45, 0.2 * s);
        u.scale.set(0.8, 0.6, 1.1);
        v.add(u);
      });
    }
    return v;
  }

  function crearDisco(radio, alto) {
    const h = alto / 2;
    const p = [[0, -h], [0.9 * radio, -h], [radio, -h * 0.4], [1.02 * radio, 0], [radio, h * 0.4], [0.9 * radio, h], [0, h]]
      .map(([x, y]) => new THREE.Vector2(x, y));
    const d = new THREE.Mesh(new THREE.LatheGeometry(p, 36), matDisco);
    d.scale.x = 1.18;
    d.castShadow = d.receiveShadow = true;
    return d;
  }

  /* ---------------- Curva anatómica en "S" ---------------- */
  const curva = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0, 7.9, 0.85), new THREE.Vector3(0, 6.4, 1.0), new THREE.Vector3(0, 4.7, 0.25),
    new THREE.Vector3(0, 1.0, -1.35), new THREE.Vector3(0, -2.9, -0.45), new THREE.Vector3(0, -5.5, 0.72),
    new THREE.Vector3(0, -7.9, 0.05)
  ], false, 'centripetal', 0.5);

  const defs = [];
  for (let i = 0; i < 7; i++)  defs.push({ region: 'C', s: 0.40 + i * 0.022, alto: 0.30 + i * 0.012, disco: 0.10, nombre: 'C' + (i + 1) });
  for (let i = 0; i < 12; i++) defs.push({ region: 'T', s: 0.56 + i * 0.016, alto: 0.44 + i * 0.016, disco: 0.13, nombre: 'T' + (i + 1) });
  for (let i = 0; i < 5; i++)  defs.push({ region: 'L', s: 0.78 + i * 0.012, alto: 0.66 + i * 0.016, disco: 0.21, nombre: 'L' + (i + 1) });
  const L = curva.getLength();
  const k = L / defs.reduce((a, d) => a + d.alto + d.disco, 0);
  defs.forEach(d => { d.alto *= k; d.disco *= k; });

  const columna = new THREE.Group();
  const etiquetas = [];
  function colocarEnCurva(obj, u) {
    obj.position.copy(curva.getPointAt(u));
    obj.quaternion.setFromUnitVectors(ARRIBA, curva.getTangentAt(u).negate());
  }

  let d = 0, idx = 0, regionPrev = '';
  defs.forEach((def, i) => {
    if (def.region !== regionPrev) { idx = 0; regionPrev = def.region; }
    const uCentro = (d + def.alto / 2) / L;
    const vert = crearVertebra(def.s, def.alto, def.region, idx++);
    colocarEnCurva(vert, uCentro);
    columna.add(vert);
    etiquetas.push({ texto: def.nombre, u: uCentro, s: def.s });
    d += def.alto;
    if (i < defs.length - 1) {
      const disco = crearDisco((def.s + defs[i + 1].s) / 2 * 0.98, def.disco);
      colocarEnCurva(disco, (d + def.disco / 2) / L);
      columna.add(disco);
      d += def.disco;
    }
  });

  /* ---------------- Sacro y cóccix ---------------- */
  const sacro = new THREE.Group();
  {
    const ultima = defs[defs.length - 1];
    const discoLS = crearDisco(ultima.s * 0.97, ultima.disco);
    colocarEnCurva(discoLS, (L - ultima.disco * 0.55) / L);
    discoLS.position.add(curva.getTangentAt(1).multiplyScalar(ultima.disco * 0.6));
    columna.add(discoLS);

    const w = ultima.s * 1.55, hS = ultima.s * 3.6, grosorS = ultima.s * 0.75;
    const forma = new THREE.Shape();
    forma.moveTo(-w, 0);
    forma.quadraticCurveTo(-w * 1.08, -hS * 0.45, -w * 0.28, -hS * 0.92);
    forma.quadraticCurveTo(0, -hS * 1.05, w * 0.28, -hS * 0.92);
    forma.quadraticCurveTo(w * 1.08, -hS * 0.45, w, 0);
    forma.quadraticCurveTo(0, ultima.alto * 0.25, -w, 0);
    const geoS = new THREE.ExtrudeGeometry(forma, { depth: grosorS, bevelEnabled: true, bevelThickness: 0.1, bevelSize: 0.12, bevelSegments: 4, curveSegments: 20 });
    geoS.translate(0, 0, -grosorS / 2);
    const pos = geoS.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const t = THREE.MathUtils.clamp(-pos.getY(i) / hS, 0, 1);
      pos.setZ(i, pos.getZ(i) * (1 - 0.55 * t) - 0.7 * ultima.s * t * t);
    }
    pos.needsUpdate = true;
    geoS.computeVertexNormals();
    const cuerpoS = new THREE.Mesh(geoS, matHueso);
    cuerpoS.castShadow = cuerpoS.receiveShadow = true;
    sacro.add(cuerpoS);

    const zSacro = (t, cara) => cara * (grosorS / 2) * (1 - 0.55 * t) - 0.7 * ultima.s * t * t;
    for (let i = 0; i < 4; i++) {
      const t = 0.12 + i * 0.2;
      const cresta = new THREE.Mesh(new THREE.SphereGeometry(ultima.s * 0.14, 8, 6), matHueso);
      cresta.position.set(0, -hS * t, zSacro(t, -1) - 0.02);
      cresta.scale.set(0.8, 1, 0.7);
      sacro.add(cresta);
    }
    for (let i = 0; i < 4; i++) {
      const t = 0.2 + i * 0.18;
      [-1, 1].forEach(l => [1, -1].forEach(cara => {
        const f = new THREE.Mesh(new THREE.SphereGeometry(ultima.s * 0.1, 8, 6), matForamen);
        f.position.set(l * w * (0.5 - i * 0.07), -hS * t, zSacro(t, cara));
        f.scale.set(1, 1.2, 0.5);
        sacro.add(f);
      }));
    }
    let py = -hS, pz = zSacro(1, 0), r = ultima.s * 0.26;
    for (let i = 0; i < 4; i++) {
      const seg = new THREE.Mesh(new THREE.SphereGeometry(r, 10, 8), matHueso);
      seg.position.set(0, py, pz);
      seg.scale.set(1.4, 0.85, 1);
      seg.castShadow = true;
      sacro.add(seg);
      py -= r * 1.5; pz += r * 0.55; r *= 0.78;
    }
    colocarEnCurva(sacro, 1);
    sacro.position.add(curva.getTangentAt(1).multiplyScalar(ultima.disco * 0.75));
    sacro.translateZ(0.12 * ultima.s);
    sacro.rotateX(0.32);
  }
  columna.add(sacro);

  /* ---------------- Etiquetas opcionales ---------------- */
  if (CONFIG.mostrarEtiquetas) {
    const poner = (texto, x, y, z) => {
      const c = document.createElement('canvas'); c.width = 128; c.height = 64;
      const ctx = c.getContext('2d');
      ctx.font = '600 34px Inter, "Segoe UI", Arial, sans-serif';
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.fillStyle = 'rgba(215,243,238,0.95)';
      ctx.fillText(texto, 64, 34);
      const tex = new THREE.CanvasTexture(c); tex.colorSpace = THREE.SRGBColorSpace;
      const sp = new THREE.Sprite(new THREE.SpriteMaterial({ map: tex, transparent: true, depthWrite: false }));
      sp.scale.set(0.9, 0.45, 1); sp.position.set(x, y, z);
      columna.add(sp);
    };
    etiquetas.forEach(e => { const p = curva.getPointAt(e.u), sep = e.s * 1.18 + 1.1; poner(e.texto, -sep * 0.75, p.y, p.z + sep * 0.75); });
    const sepS = defs[23].s * 1.18 + 1.1;
    poner('S', -sepS * 0.75, sacro.position.y - 1.3, sacro.position.z + sepS * 0.75);
  }

  /* ---------------- Centrado y pivote ---------------- */
  const caja = new THREE.Box3().setFromObject(columna);
  const tamano = caja.getSize(new THREE.Vector3());
  columna.position.sub(caja.getCenter(new THREE.Vector3()));
  const pivote = new THREE.Group();
  pivote.add(columna);
  pivote.rotation.y = -Math.PI / 2 - 0.55;     // arranca en vista lateral-oblicua
  escena.add(pivote);

  /* ---------------- Encuadre según el tamaño del contenedor ---------------- */
  function ajustar() {
    const w = contenedor.clientWidth || 1, h = contenedor.clientHeight || 1;
    renderer.setSize(w, h, false);
    camara.aspect = w / h;
    camara.updateProjectionMatrix();
    const fov = THREE.MathUtils.degToRad(camara.fov);
    const distAlto = (tamano.y / 2) / Math.tan(fov / 2);
    const distAncho = (Math.max(tamano.x, tamano.z) / 2) / Math.tan(fov / 2) / camara.aspect;
    camara.position.set(0, 0.5, Math.max(distAlto, distAncho) * 1.08 + 0.8);
    camara.lookAt(0, -0.1, 0);
  }
  ajustar();
  if ('ResizeObserver' in window) new ResizeObserver(ajustar).observe(contenedor);
  else window.addEventListener('resize', ajustar);

  /* ---------------- Arrastrar para girar (horizontal); el scroll vertical sigue libre ---------------- */
  let arrastrando = false, px = 0, py = 0, inclinacion = 0;
  const lienzo = renderer.domElement;
  lienzo.addEventListener('pointerdown', e => { arrastrando = true; px = e.clientX; py = e.clientY; lienzo.setPointerCapture(e.pointerId); });
  lienzo.addEventListener('pointerup', e => { arrastrando = false; lienzo.releasePointerCapture(e.pointerId); });
  lienzo.addEventListener('pointercancel', () => arrastrando = false);
  lienzo.addEventListener('pointermove', e => {
    if (!arrastrando) return;
    pivote.rotation.y += (e.clientX - px) * 0.008;
    inclinacion = THREE.MathUtils.clamp(inclinacion + (e.clientY - py) * 0.004, -0.5, 0.5);
    px = e.clientX; py = e.clientY;
  });

  /* ---------------- Animación (giro automático, se pausa fuera de pantalla) ---------------- */
  const direccion = CONFIG.sentidoHorario ? -1 : 1;
  const reloj = new THREE.Clock();
  const reducirMovimiento = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let visible = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; if (visible) reloj.getDelta(); }, { threshold: 0.05 }).observe(contenedor);
  }

  function animar() {
    requestAnimationFrame(animar);
    if (!visible) return;
    const dt = Math.min(reloj.getDelta(), 0.1) * 60;
    if (!arrastrando && !reducirMovimiento) {
      pivote.rotation.y += CONFIG.velocidadGiro * direccion * dt;
      inclinacion *= Math.pow(0.96, dt);
    }
    pivote.rotation.x = inclinacion;
    renderer.render(escena, camara);
  }
  animar();

  // Oculta la foto de respaldo y revela el lienzo con un fundido
  contenedor.closest('.hero-photo')?.classList.add('is-3d');
  requestAnimationFrame(() => contenedor.classList.add('ready'));

  window.columna3D = { escena, camara, renderer, pivote, columna, config: CONFIG };
}

/* ---------------- Textura ósea procedural (poros, vetas y manchas) ---------------- */
function crearTexturaHueso(renderer, tam = 1024) {
  const c = document.createElement('canvas');
  c.width = c.height = tam;
  const ctx = c.getContext('2d');
  const r = Math.random;
  ctx.fillStyle = CONFIG.colorHueso;
  ctx.fillRect(0, 0, tam, tam);
  for (let i = 0; i < 90; i++) {
    const x = r() * tam, y = r() * tam, rad = 60 + r() * 220;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const tono = r() < 0.5 ? '170,140,95' : '245,236,214';
    g.addColorStop(0, `rgba(${tono},0.3)`); g.addColorStop(1, `rgba(${tono},0)`);
    ctx.fillStyle = g; ctx.fillRect(x - rad, y - rad, rad * 2, rad * 2);
  }
  ctx.lineWidth = 1;
  for (let i = 0; i < 400; i++) {
    ctx.strokeStyle = `rgba(130,100,62,${0.07 + r() * 0.13})`;
    ctx.beginPath();
    let x = r() * tam, y = r() * tam; ctx.moveTo(x, y);
    for (let k = 0; k < 6; k++) { x += (r() - 0.5) * 40; y += (r() - 0.5) * 40; ctx.lineTo(x, y); }
    ctx.stroke();
  }
  for (let i = 0; i < 14000; i++) {
    ctx.fillStyle = `rgba(${95 + r() * 50},${75 + r() * 35},${45 + r() * 25},${0.1 + r() * 0.3})`;
    ctx.beginPath();
    ctx.ellipse(r() * tam, r() * tam, 0.8 + r() * 2.6, 0.8 + r() * 2.6, r() * Math.PI, 0, Math.PI * 2);
    ctx.fill();
  }
  for (let i = 0; i < 6000; i++) {
    ctx.fillStyle = `rgba(250,244,228,${0.1 + r() * 0.3})`;
    ctx.beginPath(); ctx.arc(r() * tam, r() * tam, 0.6 + r() * 1.6, 0, Math.PI * 2); ctx.fill();
  }
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
  return tex;
}
