import * as THREE from "three";

/**
 * The world: a developer's machine rendered as a place you fly through.
 * Five zones sit along -Z. Scroll drives the camera down that corridor.
 *
 * Layers are registered in ZONES, so adding a sixth zone means adding an
 * entry, never editing the camera or scroll code.
 */

const CYAN = new THREE.Color("#08fdd8");
const PINK = new THREE.Color("#fd1056");
// Structure leans blue rather than green - a teal grid read as dull/murky,
// while blue stays clearly visible without competing with the cyan type.
const GRID = new THREE.Color("#2f7dff");
const VIOLET = new THREE.Color("#7b5cff");

// Each zone owns a camera anchor. Scroll progress maps onto this spine.
export const ZONES = [
  { id: "boot", z: 0, label: "BOOT" },
  { id: "arsenal", z: -60, label: "ARSENAL" },
  { id: "campaign", z: -120, label: "CAMPAIGN" },
  { id: "builds", z: -180, label: "BUILDS" },
  { id: "comms", z: -240, label: "COMMS" },
];

const TRACK_LENGTH = Math.abs(ZONES[ZONES.length - 1].z);

/** Deterministic PRNG so the world looks identical on every load. */
function mulberry32(seed) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class World {
  constructor(canvas) {
    this.canvas = canvas;
    this.rand = mulberry32(20240815);
    this.clock = new THREE.Clock();
    this.progress = 0;
    this.targetProgress = 0;
    this.pointer = new THREE.Vector2(0, 0);
    this.smoothPointer = new THREE.Vector2(0, 0);
    this.disposables = [];
    this.quality = this._detectQuality();

    this._initRenderer();
    this._initScene();
    this._build();
  }

  /** Mobile and low-core machines get fewer particles and no heavy passes. */
  _detectQuality() {
    const mobile = window.matchMedia("(max-width: 820px)").matches;
    const cores = navigator.hardwareConcurrency || 4;
    if (mobile || cores <= 4) return "low";
    return "high";
  }

  _initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: this.quality === "high",
      alpha: false,
      powerPreference: "high-performance",
    });
    const cap = this.quality === "high" ? 2 : 1.5;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, cap));
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x0a0c18, 1);
  }

  _initScene() {
    this.scene = new THREE.Scene();
    // Fog tinted toward deep indigo so distance reads as atmosphere, not black.
    this.scene.fog = new THREE.FogExp2(0x0b1024, 0.0062);

    this.camera = new THREE.PerspectiveCamera(
      62,
      window.innerWidth / window.innerHeight,
      0.1,
      600
    );
    this.camera.position.set(0, 1.6, 8);

    this.scene.add(new THREE.AmbientLight(0x404050, 1.4));

    const key = new THREE.PointLight(CYAN, 90, 90, 2);
    key.position.set(6, 8, 2);
    this.scene.add(key);

    const rim = new THREE.PointLight(PINK, 60, 80, 2);
    rim.position.set(-8, -4, -30);
    this.scene.add(rim);

    // Travelling light keeps the corridor lit wherever the camera is.
    this.travelLight = new THREE.PointLight(CYAN, 45, 55, 2);
    this.scene.add(this.travelLight);
  }

  _track(mat) {
    this.disposables.push(mat);
    return mat;
  }

  _build() {
    this._buildStarfield();
    this._buildGrid();
    this._buildCorridor();
    this._buildDataStreams();
    this._buildZoneMarkers();
    this._buildDrones();
  }

  /** Deep background dust - gives parallax and depth cues. */
  _buildStarfield() {
    const count = this.quality === "high" ? 1300 : 600;
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();

    for (let i = 0; i < count; i++) {
      pos[i * 3] = (this.rand() - 0.5) * 190;
      pos[i * 3 + 1] = (this.rand() - 0.5) * 130;
      pos[i * 3 + 2] = -this.rand() * (TRACK_LENGTH + 120) + 40;

      // Three-way mix keeps the starfield from reading as a flat green haze.
      const r = this.rand();
      c.copy(r > 0.86 ? PINK : r > 0.58 ? VIOLET : CYAN);
      c.multiplyScalar(0.55 + this.rand() * 0.45);
      col[i * 3] = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    geo.setAttribute("color", new THREE.BufferAttribute(col, 3));

    const mat = this._track(
      new THREE.PointsMaterial({
        size: 0.36,
        vertexColors: true,
        transparent: true,
        opacity: 0.75,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        sizeAttenuation: true,
      })
    );

    this.stars = new THREE.Points(geo, mat);
    this.scene.add(this.stars);
    this.disposables.push(geo);
  }

  /** Floor + ceiling wireframe planes: the "inside a machine" read.
   *  Kept deliberately faint - this is scenery, not content. */
  _buildGrid() {
    const mat = this._track(
      new THREE.MeshBasicMaterial({
        color: GRID,
        wireframe: true,
        transparent: true,
        opacity: 0.15,
      })
    );

    // Fewer divisions: a dense mesh reads as noise rather than a floor.
    const geo = new THREE.PlaneGeometry(150, TRACK_LENGTH + 160, 16, 60);
    this.disposables.push(geo);

    this.floor = new THREE.Mesh(geo, mat);
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.position.set(0, -7, -TRACK_LENGTH / 2);
    this.scene.add(this.floor);

    this.ceiling = new THREE.Mesh(geo, mat);
    this.ceiling.rotation.x = Math.PI / 2;
    this.ceiling.position.set(0, 16, -TRACK_LENGTH / 2);
    this.scene.add(this.ceiling);

    // Store base Y so the pulse animation has a stable origin.
    this.floorBaseY = this.floor.position.y;
  }

  /** Ribs running the length of the track - reads as speed when moving.
   *  Smooth rings, not low-poly shapes: 4 radial segments made giant
   *  squares that sliced across the content at random angles. */
  _buildCorridor() {
    const group = new THREE.Group();
    const mat = this._track(
      new THREE.MeshBasicMaterial({
        color: GRID,
        transparent: true,
        opacity: 0.16,
      })
    );
    const geo = new THREE.TorusGeometry(21, 0.045, 5, 64);
    this.disposables.push(geo);

    const ribs = this.quality === "high" ? 46 : 24;
    const spacing = (TRACK_LENGTH + 80) / ribs;

    for (let i = 0; i < ribs; i++) {
      const rib = new THREE.Mesh(geo, mat);
      rib.position.z = 20 - i * spacing;
      group.add(rib);
    }

    this.ribs = group;
    this.scene.add(group);
  }

  /** Vertical "packet" streams - the data flowing through the system. */
  _buildDataStreams() {
    const count = this.quality === "high" ? 420 : 180;
    const pos = new Float32Array(count * 3);
    this.streamSeed = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      const angle = this.rand() * Math.PI * 2;
      // Held out at the edges so packets never drift across the copy.
      const radius = 20 + this.rand() * 20;
      pos[i * 3] = Math.cos(angle) * radius;
      pos[i * 3 + 1] = (this.rand() - 0.5) * 44;
      pos[i * 3 + 2] = -this.rand() * (TRACK_LENGTH + 60) + 30;
      this.streamSeed[i] = this.rand();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));

    const mat = this._track(
      new THREE.PointsMaterial({
        color: CYAN,
        size: 0.26,
        transparent: true,
        opacity: 0.42,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      })
    );

    this.streams = new THREE.Points(geo, mat);
    this.scene.add(this.streams);
    this.disposables.push(geo);
  }

  /** One glowing structure per zone, so each section has a landmark. */
  _buildZoneMarkers() {
    this.markers = [];

    const shapes = [
      () => new THREE.IcosahedronGeometry(3.4, 0),
      () => new THREE.OctahedronGeometry(3.6, 0),
      () => new THREE.TorusKnotGeometry(2.3, 0.62, 90, 12),
      () => new THREE.DodecahedronGeometry(3.5, 0),
      () => new THREE.TorusGeometry(2.9, 0.5, 12, 40),
    ];

    ZONES.forEach((zone, i) => {
      const geo = shapes[i % shapes.length]();
      this.disposables.push(geo);

      const mat = this._track(
        new THREE.MeshBasicMaterial({
          color: [CYAN, VIOLET, PINK][i % 3],
          wireframe: true,
          transparent: true,
          opacity: 0.34,
        })
      );

      const mesh = new THREE.Mesh(geo, mat);
      // Alternate sides so the eye travels left-right down the corridor,
      // set wide enough to clear the content column.
      mesh.position.set(i % 2 === 0 ? 19 : -19, 2 + (i % 3), zone.z - 10);
      mesh.userData.spin = 0.1 + this.rand() * 0.22;
      this.scene.add(mesh);
      this.markers.push(mesh);
    });
  }

  /** Small companions that drift alongside - makes the world feel alive. */
  _buildDrones() {
    this.drones = [];
    const count = this.quality === "high" ? 9 : 4;
    const geo = new THREE.TetrahedronGeometry(0.38, 0);
    this.disposables.push(geo);

    for (let i = 0; i < count; i++) {
      const mat = this._track(
        new THREE.MeshBasicMaterial({
          color: this.rand() > 0.7 ? PINK : this.rand() > 0.4 ? VIOLET : CYAN,
          transparent: true,
          opacity: 0.55,
        })
      );
      const drone = new THREE.Mesh(geo, mat);
      drone.userData = {
        // Orbit wide - close orbits crossed the text and pulled focus.
        radius: 24 + this.rand() * 10,
        speed: 0.16 + this.rand() * 0.4,
        phase: this.rand() * Math.PI * 2,
        z: -this.rand() * TRACK_LENGTH,
        bob: 0.6 + this.rand() * 1.6,
      };
      this.scene.add(drone);
      this.drones.push(drone);
    }
  }

  setProgress(p) {
    this.targetProgress = Math.min(Math.max(p, 0), 1);
  }

  setPointer(x, y) {
    this.pointer.set(x, y);
  }

  /** Camera Z for a zone index - used by nav jumps to stay in sync. */
  progressForZone(index) {
    const zone = ZONES[Math.min(Math.max(index, 0), ZONES.length - 1)];
    return Math.abs(zone.z) / TRACK_LENGTH;
  }

  resize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  update() {
    const t = this.clock.getElapsedTime();
    const dt = Math.min(this.clock.getDelta(), 0.05);

    // Ease toward target so nav jumps glide instead of snapping.
    this.progress += (this.targetProgress - this.progress) * 0.065;
    this.smoothPointer.lerp(this.pointer, 0.05);

    const z = -this.progress * TRACK_LENGTH;

    // Parallax from pointer, plus a slow drift so it never sits still.
    this.camera.position.x = this.smoothPointer.x * 3.2 + Math.sin(t * 0.22) * 0.7;
    this.camera.position.y =
      1.6 + this.smoothPointer.y * 1.7 + Math.sin(t * 0.31) * 0.35;
    this.camera.position.z = z + 8;
    this.camera.lookAt(
      this.smoothPointer.x * 1.6,
      1.4 + this.smoothPointer.y * 0.9,
      z - 14
    );

    this.travelLight.position.set(0, 3, z - 6);

    this.stars.rotation.z = t * 0.007;

    // Packets fall and wrap, giving continuous downward flow.
    const sp = this.streams.geometry.attributes.position;
    for (let i = 0; i < sp.count; i++) {
      let y = sp.getY(i) - (0.9 + this.streamSeed[i] * 2.4) * dt * 3;
      if (y < -24) y = 24;
      sp.setY(i, y);
    }
    sp.needsUpdate = true;

    this.markers.forEach((m, i) => {
      m.rotation.x += m.userData.spin * dt;
      m.rotation.y += m.userData.spin * dt * 0.75;
      m.position.y = 2 + (i % 3) + Math.sin(t * 0.8 + i) * 0.6;
    });

    this.drones.forEach((d) => {
      const u = d.userData;
      const a = t * u.speed + u.phase;
      d.position.set(
        Math.cos(a) * u.radius,
        1.5 + Math.sin(a * 1.7) * u.bob,
        u.z + Math.sin(a * 0.5) * 4
      );
      d.rotation.x += dt * 1.1;
      d.rotation.y += dt * 0.9;
    });

    this.floor.position.y = this.floorBaseY + Math.sin(t * 0.5) * 0.22;

    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.disposables.forEach((d) => d.dispose && d.dispose());
    this.renderer.dispose();
  }
}
