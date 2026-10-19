import * as THREE from 'three';

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111c30);
scene.fog = new THREE.Fog(0x111c30, 20, 100);

const camera = new THREE.PerspectiveCamera(
  65, innerWidth / innerHeight, 0.1, 200
);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(innerWidth, innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 1.5));
renderer.shadowMap.enabled = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
document.body.prepend(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xaacaff, 0x28202a, 2));

const light = new THREE.DirectionalLight(0xffe0a0, 3);
light.position.set(-10, 20, 10);
light.castShadow = true;
scene.add(light);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(200, 200),
  new THREE.MeshStandardMaterial({
    color: 0x343943, roughness: 0.9
  })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

// Temporary player placeholder.
// Replace with a realistic rigged Indra model in the next stage.
const player = new THREE.Group();

const body = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.45, 1, 6, 12),
  new THREE.MeshStandardMaterial({
    color: 0x343d4b, metalness: 0.5, roughness: 0.45
  })
);
body.position.y = 1.4;
body.castShadow = true;
player.add(body);

const head = new THREE.Mesh(
  new THREE.SphereGeometry(0.3, 24, 16),
  new THREE.MeshStandardMaterial({ color: 0x98745a })
);
head.position.y = 2.35;
head.castShadow = true;
player.add(head);

scene.add(player);

camera.position.set(0, 4, 7);
camera.lookAt(0, 1, 0);

const keys = new Set();
let playing = false;
let yaw = 0;

document.addEventListener('keydown', e => {
  keys.add(e.code);
  if (e.code === 'Escape') {
    playing = !playing;
  }
});
document.addEventListener('keyup', e => keys.delete(e.code));

document.querySelector('#start').addEventListener('click', () => {
  playing = true;
  document.querySelector('#menu').style.display = 'none';
  document.querySelector('#hud').style.display = 'block';
});

function animate() {
  requestAnimationFrame(animate);

  if (playing) {
    const speed = 0.09;
    if (keys.has('KeyW')) player.position.z -= speed;
    if (keys.has('KeyS')) player.position.z += speed;
    if (keys.has('KeyA')) player.position.x -= speed;
    if (keys.has('KeyD')) player.position.x += speed;

    const target = new THREE.Vector3(
      player.position.x,
      player.position.y + 1.5,
      player.position.z
    );

    const offset = new THREE.Vector3(
      Math.sin(yaw) * 7,
      3.3,
      Math.cos(yaw) * 7
    );

    camera.position.lerp(target.clone().add(offset), 0.08);
    camera.lookAt(target);
  }

  renderer.render(scene, camera);
}

addEventListener('resize', () => {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(innerWidth, innerHeight);
});

animate();
