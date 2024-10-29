import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

let container, camera, scene, renderer, controls;
let cubeBody, sphereHead, coneHat;

init();

function init() {

  container = document.createElement("div");
  document.body.appendChild(container);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(3, 3, 6);

  // Axes Helper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);

  // Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const pointLight1 = new THREE.PointLight(0xffffff, 0.5);
  pointLight1.position.set(-5, -5, 5);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0xffffff, 0.5);
  pointLight2.position.set(5, -5, -5);
  scene.add(pointLight2);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);


  const shinyMaterial = new THREE.MeshStandardMaterial({
    color: 0x00FFFF,
    metalness: 0.8,
    roughness: 0.1,
  });

  // Cube
  const bodyGeometry = new THREE.BoxGeometry(1.5, 1.5, 1.5);
  cubeBody = new THREE.Mesh(bodyGeometry, shinyMaterial);
  scene.add(cubeBody);

  // Sphere
  const headGeometry = new THREE.SphereGeometry(0.7, 32, 32);
  sphereHead = new THREE.Mesh(headGeometry, shinyMaterial);
  sphereHead.position.set(0, 1.5, 0);
  scene.add(sphereHead);

  const headWireframe = new THREE.WireframeGeometry(headGeometry);
  const headLine = new THREE.LineSegments(headWireframe, new THREE.LineBasicMaterial({ color: 0xff00f0 }));
  sphereHead.add(headLine);

  // Cone
  const hatGeometry = new THREE.ConeGeometry(0.5, 1, 32);
  coneHat = new THREE.Mesh(hatGeometry, shinyMaterial);
  coneHat.position.set(0, 2.3, 0);
  scene.add(coneHat);

  const hatWireframe = new THREE.WireframeGeometry(hatGeometry);
  const hatLine = new THREE.LineSegments(hatWireframe, new THREE.LineBasicMaterial({ color: 0xfffff }));
  coneHat.add(hatLine);

  renderer.setAnimationLoop(animate);
}

function animate() {
  cubeBody.rotation.y += 0.01;
  cubeBody.rotation.x += 0.01;
  cubeBody.rotation.z += 0.01;
  sphereHead.rotation.y += 0.01;
  coneHat.rotation.y += 0.04;

  controls.update(); 
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
