const app = document.getElementById('app');
const {innerWidth: width, innerHeight: height} = window;
const aspect = width / height;
let frame = 0;
let initialized = false;
const items = [
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
    src: 'img/01.jpg'
  },  
  {
    src: 'video4'
  },
  {
    src: 'img/08.jpg'
  },  
  {
    src: 'video6'
  },
  {
    src: 'img/05.jpg'
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
renderer.setClearColor(0x000000, 0);
app.appendChild(renderer.domElement);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2( 1, 1 );
const color = new THREE.Color();
let intersections;
let activeItem;

document.addEventListener( 'mousemove', onMouseMove );
document.addEventListener('click', handleClick);

function handleClick() {
  if (intersections[0]) {
    activeItem = intersections[0].object;
  } else {
    activeItem = null;
  }
}

function onMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / width ) * 2 - 1;
  mouse.y = - ( event.clientY / height ) * 2 + 1;

}

/*
  Camera
  */
let cameraRadius = 12;
let cameraStartPosition = {
  x: 0, 
  y: 0,
  z: cameraRadius
};
let cameraEndPosition = cameraStartPosition;
let cameraFrame = 0;

const camera = new THREE.PerspectiveCamera(5, aspect, .01, 4000 );
camera.position.set(cameraStartPosition.x, cameraStartPosition.y, cameraStartPosition.z);
camera.zoom = 1.5;
camera.updateProjectionMatrix();

const scene = new THREE.Scene();

// let planeGeometry = new THREE.BoxGeometry(cameraRadius * 10, cameraRadius * 10, 0);

// let planeMaterial = new THREE.MeshPhongMaterial({
//   color: 0x330055
// });
// let plane = new THREE.Mesh(planeGeometry, planeMaterial);
// plane.position.set(0, 0, -8);
// scene.add(plane);

/*
  Lights
  */
const ambientLight = new THREE.AmbientLight(0xffffff, .25);
const centerLight = new THREE.PointLight(0x222222, .25, 20);
const rearLight = new THREE.PointLight(0x662222, .35, 280);
const leftLight = new THREE.PointLight(0x444444, .35, 80);
const rightLight = new THREE.PointLight(0x222255, .37, 180);
const redSpotLight = new THREE.PointLight( 0xffffff, 1, 5);
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

  // redSpotLight.position.set( 0, 0, -12 );
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
  createItem(i);
}

function createItem(i) {
  setTimeout(() => {
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
    resetItemPosition(item);
    
    item.material.needsUpdate = true;
    itemGroup.add(item);
  }, i * 500);
}

const render = (now) => {

  requestAnimationFrame(render);

  if (!initialized) return;
  updateField()

  raycaster.setFromCamera( mouse, camera );
  intersections = raycaster.intersectObjects( itemGroup.children )

  if ( intersections.length > 0 ) {
    const intersection = intersections[0].object;
    if (intersection !== activeItem) {
      intersection.material.opacity = 0.8;
      document.body.style.cursor = 'pointer';
    }
  } else {
    document.body.style.cursor = 'auto';
  }
  renderer.render(scene, camera);

  frame++;
}

function updateField() {
  for (let pIndex = 0; pIndex < itemGroup.children.length; pIndex++) {
    const item = itemGroup.children[pIndex];
    if (item === activeItem) {
      item.position.x += 0.2 * (0 - item.position.x);
      item.position.y += 0.2 * (0 - item.position.y);
      item.position.z += 0.2 * (9 - item.position.z);
      item.material.opacity = 1;
      item.rotation.x += 0.2 * (0 - item.rotation.x);
      item.rotation.y += 0.2 * (0 - item.rotation.y);
      item.rotation.z += 0.2 * (0 - item.rotation.z);
    } else {
      item.position.z += item.vz;
      item.material.opacity = Math.min(1, item.material.opacity + 0.04);
      item.rotation.y += item.rvy;
      item.rotation.x += item.rvx;
      item.rotation.z += item.rvz;
      if (item.position.z > 20) {
        resetItemPosition(item);
      }
    }
  }
}

function resetItemPosition(item) {
  item.material.opacity = 0;
  item.position.x = (Math.random() - 0.5) * 0.2;
  item.position.y = (Math.random() - 0.5) * 0.2;
  item.position.z = -2 + Math.random() * 5;
  item.vz = Math.random() * 0.05 + 0.025;
  item.rvx = Math.random() * 0.02 - 0.01;
  item.rvy = Math.random() * 0.02 - 0.01;
  item.rvz = Math.random() * 0.02 - 0.01;
}

requestAnimationFrame(render);