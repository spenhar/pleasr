const app = document.getElementById('app');
const {innerWidth: width, innerHeight: height} = window;
const aspect = width / height;
let frame = 0;
let initialized = false;
const items = [
  {
    src: 'img/01.jpg'
  },
  {
    src: 'img/08.jpg'
  },
  {
    src: 'img/05.jpg'
  },  
  {
    src: 'video7'
  },
  {
    src: 'img/snowden.jpg'
  },
  {
    src: 'video2'
  },
  {
    src: 'video3'
  },
  {
    src: 'video4'
  },
  {
    src: 'video6'
  },  
  {
    src: 'video9'
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

const camera = new THREE.PerspectiveCamera(65, aspect, .01, 4000 );
camera.position.set(cameraStartPosition.x, cameraStartPosition.y, cameraStartPosition.z);
camera.lookAt(0,0,0);
camera.zoom = cameraRadius;
camera.updateProjectionMatrix();

const scene = new THREE.Scene();

/*
  Lights
  */
const ambientLight = new THREE.AmbientLight(0xffffff, .25);
const centerLight = new THREE.PointLight(0x222222, .25, 20);
const rearLight = new THREE.PointLight(0x662222, .35, 280);
const leftLight = new THREE.PointLight(0x444444, .35, 80);
const rightLight = new THREE.PointLight(0x222255, .37, 180);
const redSpotLight = new THREE.PointLight( 0x333333, .25, 80);
const blueSpotLight = new THREE.PointLight( 0x666666, 2.5, 80);

addLights();

function addLights() {
  scene.add(ambientLight);
  centerLight.position.x = 10;
  centerLight.position.z = 12;
  scene.add(centerLight);

  rearLight.position.z = 15;
  rearLight.position.y = -10;
  scene.add(rearLight);

  leftLight.position.x = 10;
  leftLight.position.y = 10;
  leftLight.position.z = 12;
  scene.add(leftLight);

  rightLight.position.x = 5;
  rightLight.position.y = 10;
  rightLight.position.z = 10;
  scene.add(rightLight);  

  redSpotLight.position.set( -10, 10, 20 );
  scene.add(redSpotLight);

  blueSpotLight.position.set( 10, 12, 30 );
  scene.add(blueSpotLight);
}

/*
  Items
  */
const itemCount = items.length;
const itemGroup = new THREE.Group();
scene.add(itemGroup);

for (let i=0; i < itemCount; i++) {
  const src = items[i].src;
  const texture = items[i].src.substr(-3) === 'jpg' ? new THREE.TextureLoader().load( src ) : new THREE.VideoTexture( document.getElementById( src ) );
  const geometry = new THREE.BoxBufferGeometry(.08, .08, .0015);
  const material = new THREE.MeshPhongMaterial({ 
    color: 0xffffff, 
    wireframe: false, 
    transparent: true,
    opacity: 0,
    map: texture
  });
  const item = new THREE.Mesh(geometry, material);
  item.position.x = (Math.random() - 0.5) * 0.4;
  item.position.y = (Math.random() - 0.5) * 0.4;
  item.position.z = -2 - Math.random() * 5;
  item.vz = Math.random() * 0.1 + 0.05;
  item.rvx = Math.random() * 0.01 - 0.005;
  item.rvy = Math.random() * 0.01 - 0.005;
  
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
    item.rotation.y += item.rvy;
    item.rotation.x += item.rvx;
    if (item.position.z > 30) {
      item.position.z = -2 - Math.random() * 5;
      item.position.x = (Math.random() - 0.5) * 0.4;
      item.position.y = (Math.random() - 0.5) * 0.4;
      item.material.opacity = 0;
      item.vz = Math.random() * 0.1 + 0.05;
      item.rvx = Math.random() * 0.01 - 0.005;
      item.rvy = Math.random() * 0.01 - 0.005;
    }
  }
}

requestAnimationFrame(render);
