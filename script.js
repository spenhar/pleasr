const app = document.getElementById('app');
const {innerWidth: width, innerHeight: height} = window;
const aspect = width / height;
let frame = 0;
let initialized = false;
const items = [
  {
    title: ''
  }
]

window.addEventListener('load', () => {
  if (!initialized) {
    initialized = true;
  }
});

/*
  Renderer
  */
const renderer = new THREE.WebGLRenderer({
  antialias: false,
  alpha: true,
});

renderer.setSize(width, height);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x000000, 1);
app.appendChild(renderer.domElement);

/*
  Camera
  */
let cameraRadius = 24;
let cameraStartPosition = {
  x: 0, 
  y: 0,
  z: cameraRadius
};
let cameraEndPosition = cameraStartPosition;
let cameraFrame = 0;
let zoom = 20;

const camera = new THREE.PerspectiveCamera(45, aspect, .01, 4000 );
camera.position.set(cameraStartPosition.x, cameraStartPosition.y, cameraStartPosition.z);
camera.lookAt(0,0,0);
camera.zoom = cameraRadius;
camera.updateProjectionMatrix();

const scene = new THREE.Scene();

/* 
  Orienting Image
  */
let planeGeometry = new THREE.BoxGeometry(cameraRadius * 10, cameraRadius * 10, 0);

let planeMaterial = new THREE.MeshPhongMaterial({

});
let plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, -12);
scene.add(plane);

/*
  Lights
  */
const ambientLight = new THREE.AmbientLight(0xffffff, .15);
const centerLight = new THREE.PointLight(0x222222, 1.25, 20);
const rearLight = new THREE.PointLight(0x665555, .15, 280);
const leftLight = new THREE.PointLight(0x443333, .15, 80);
const rightLight = new THREE.PointLight(0x554455, .17, 180);
const redSpotLight = new THREE.PointLight( 0x332222, .5, 80);
const blueSpotLight = new THREE.PointLight( 0x664444, 2.5, 80);

addLights();

function addLights() {
  scene.add(ambientLight);
  centerLight.position.z = 1;  
  scene.add(centerLight);

  rearLight.position.z = -5;
  rearLight.position.y = 10;
  scene.add(rearLight);

  leftLight.position.x = -10;
  leftLight.position.y = 10;
  leftLight.position.z = 10;
  scene.add(leftLight);

  rightLight.position.x = -5;
  rightLight.position.y = 10;
  rightLight.position.z = 10;
  scene.add(rightLight);  

  redSpotLight.position.set( -10, 10, -20 );
  scene.add(redSpotLight);

  blueSpotLight.position.set( 10, 12, 30 );
  scene.add(blueSpotLight);
}

/*
  Items
  */
const itemCount = 20;
const itemGroup = new THREE.Group();
scene.add(itemGroup);

for (let i=0; i < itemCount; i++) {
  const geometry = new THREE.BoxBufferGeometry(.04, .04, .04);
  const material = new THREE.MeshPhongMaterial({ 
    color: 0xff5544, 
    wireframe: false, 
    transparent: true,
    opacity: 0,
  });
  const item = new THREE.Mesh(geometry, material);
  item.position.x = (Math.random() - 0.5) * 0.2;
  item.position.y = (Math.random() - 0.5) * 0.2;
  item.position.z = -2;
  item.vz = Math.random() * 0.3 + 0.1;
  
  item.material.needsUpdate = true;
  itemGroup.add(item);
}

const render = (now) => {

  requestAnimationFrame(render);

  if (!initialized) return;
  updateField()
  renderer.render(scene, camera);

  frame++;
}

function updateField() {
  for (let pIndex = 0; pIndex < itemCount; pIndex++) {
    const item = itemGroup.children[pIndex];
    item.position.z += item.vz;
    item.material.opacity = Math.min(1, item.material.opacity + 0.04);
    if (item.position.z > 30) {
      item.position.z = -3;
      item.material.opacity = 0;
    }
  }
}

requestAnimationFrame(render);
