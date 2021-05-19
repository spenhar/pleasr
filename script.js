const app = document.getElementById('app');
const {innerWidth: width, innerHeight: height} = window;
const cameraAspect = width / height;
let frame = 0;
let initialized = false;
const itemProps = [
  {
    src: 'video7',
    aspect: 1,
  },
  {
    src: 'img/snowden.jpg',
    aspect: 1000 / 1294,
  },
  {
    src: 'video2',
    aspect: 1,
  },
  {
    src: 'video3',
    aspect: 600 / 450,
  },
  {
    src: 'img/01.jpg',
    aspect: 1,
  },  
  {
    src: 'video4',
    aspect: 1,
  },
  {
    src: 'img/08.jpg',
    aspect: 824 / 456
  },  
  {
    src: 'video6',
    aspect: 500 / 606,
  },
  {
    src: 'img/05.jpg',
    aspect: 1,
  },    
  {
    src: 'video9',
    aspect: 654 / 820,
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
  antialias: true,
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
    document.body.classList.add('isActive');
  } else {
    activeItem = null;
    document.body.classList.remove('isActive');
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
let cameraRadius = 3;
let cameraStartPosition = {
  x: 0, 
  y: 0,
  z: cameraRadius
};
let cameraEndPosition = cameraStartPosition;
let cameraFrame = 0;

const camera = new THREE.PerspectiveCamera(45, cameraAspect, .01, 4000 );
camera.position.set(cameraStartPosition.x, cameraStartPosition.y, cameraStartPosition.z);
camera.zoom = 1;
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
const rightLight = new THREE.PointLight(0x444444, .25, 80);
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

  rightLight.position.x = 10;
  rightLight.position.y = 10;
  rightLight.position.z = 12;
  scene.add(rightLight);

  // redSpotLight.position.set( 0, 0, -12 );
  scene.add(redSpotLight);

  blueSpotLight.position.set( 10, 12, 30 );
  scene.add(blueSpotLight);
}

/*
  Items
  */
const itemCount = itemProps.length;
const itemGroup = new THREE.Group();
scene.add(itemGroup);

for (let i=0; i < itemCount; i++) {
  createItem(i);
}

function createItem(i) {
  setTimeout(() => {
    const props = itemProps[i];
    const texture = props.src.substr(-3) === 'jpg' ? new THREE.TextureLoader().load( props.src ) : new THREE.VideoTexture( document.getElementById( props.src ) );
    const geometry = new THREE.BoxBufferGeometry(.08 * props.aspect, .08, .0015);
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

function updateField() {
  for (let pIndex = 0; pIndex < itemGroup.children.length; pIndex++) {
    const item = itemGroup.children[pIndex];
    if (item === activeItem) {
      item.position.x += 0.2 * (0 - item.position.x);
      item.position.y += 0.2 * (0 - item.position.y);
      item.position.z += 0.2 * (2.8 - item.position.z);
      item.material.opacity = 1;
      item.rotation.x += 0.2 * (-mouse.y * 0.4 - item.rotation.x);
      item.rotation.y += 0.2 * (mouse.x * 0.4 - item.rotation.y);
      item.rotation.z += 0.2 * (0 - item.rotation.z);
    } else {
      item.position.z += item.vz;
      item.material.opacity = Math.min(1, item.material.opacity + 0.04);
      item.rotation.y += item.rvy;
      item.rotation.x += item.rvx;
      item.rotation.z += item.rvz;
      if (item.position.z > 3) {
        resetItemPosition(item);
      }
    }
  }
}

function resetItemPosition(item) {
  const positionRange = activeItem ? 0.9 : 0.6;
  item.material.opacity = 0;
  item.position.x = (Math.random() - 0.5) * positionRange;
  item.position.y = (Math.random() - 0.5) * positionRange;
  item.position.z = 1 + Math.random() * 0.5;
  item.vz = Math.random() * 0.005 + 0.005;
  item.rvx = Math.random() * 0.02 - 0.01;
  item.rvy = Math.random() * 0.02 - 0.01;
  item.rvz = Math.random() * 0.02 - 0.01;
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

requestAnimationFrame(render);