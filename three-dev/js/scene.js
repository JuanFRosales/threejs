import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';

let container, camera, scene, renderer, controls;
let barrelModel, shoesModel;

init();

function init() {
  // Set up container and renderer
  container = document.createElement("div");
  document.body.appendChild(container);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.outputEncoding = THREE.sRGBEncoding;
  document.body.appendChild(renderer.domElement);

  // Scene and Camera
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(3, 3, 6);

  // Orbit Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Lights
  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);

  const exrLoader = new EXRLoader();
  exrLoader.load('./scenes/photo_studio_loft_hall_4k.exr', (texture) => {
    texture.mapping = THREE.EquirectangularReflectionMapping;
    scene.background = texture;
    scene.environment = texture;


    const gltfLoader = new GLTFLoader();
    gltfLoader.load(
      './3d-assets/Barrel/barrel.glb', 
      function (gltf) {
        barrelModel = gltf.scene;
        barrelModel.position.set(-1, 0, 0); 
        barrelModel.traverse((child) => {
          if (child.isMesh) {
            child.material.envMap = texture;
            child.material.envMapIntensity = 1.0;
            child.material.needsUpdate = true;
          }
        });
        scene.add(barrelModel);
      },
      undefined,
      function (error) {
        console.error('An error occurred while loading the barrel model:', error);
      }
    );

    
    gltfLoader.load(
      './3d-assets/3d-shoes/untitled.glb', 
      function (gltf) {
        shoesModel = gltf.scene;
        shoesModel.position.set(1, 0, 0);
        shoesModel.traverse((child) => {
          if (child.isMesh) {
            child.material.envMap = texture;
            child.material.envMapIntensity = 1.0;
            child.material.needsUpdate = true;
          }
        });
        scene.add(shoesModel);
      },
      undefined,
      function (error) {
        console.error('An error occurred while loading the shoes model:', error);
      }
    );
  });

  // Animation Loop
  renderer.setAnimationLoop(animate);
}

// Animate Function
function animate() {
  controls.update(); 
  renderer.render(scene, camera);
}


window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
