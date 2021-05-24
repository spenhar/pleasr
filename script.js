const app = document.getElementById('app');
const itemTitleEl = document.querySelector('.item__title');
const itemByEl = document.querySelector('.item__by')
const {innerWidth: width, innerHeight: height} = window;
const cameraAspect = width / height;
let frame = 0;
let initialized = false;
let scrollBoost = 0;
const emojiProps = [
  {
    src: 'img/emoji/chilis@2x.png',
  },     
  {
    src: 'img/emoji/frog@2x.png',
  },       
  {
    src: 'img/emoji/rocket@2x.png',
  },     
  {
    src: 'img/emoji/unicorn@2x.png',
  },
  {
    src: 'img/emoji/cone@2x.png',
  },       
  {
    src: 'img/emoji/headphones@2x.png',
  }, 
  {
    src: 'img/emoji/silverback@2x.png',
  }, 
  {
    src: 'img/emoji/sushi@2x.png',
  },
]
const itemProps = [
  {
    src: 'video7',
    aspect: 1,
    title: 'Apes Together Strong',
    by: 'pplpleasr',
  },
  {
    src: 'img/snowden.jpg',
    aspect: 1000 / 1294,
    title: 'Stay Free (Edward Snowden)',
    by: 'Snowden',
    activeZ: 2.7,
    scale: 2,
  },
  {
    src: 'video2',
    aspect: 1,
    title: '数人が理解',
    by: 'pplpleasr',
  },
  {
    src: 'video3',
    aspect: 600 / 450,
    by: 'pplpleasr',
    title: 'すごい!!!',
  },
  {
    src: 'img/01.jpg',
    aspect: 1,
    title: 'Dank Elon',
    by: 'MCE'
  },  
  {
    src: 'video4',
    aspect: 1,
    title: 'All Aboard',
    by: 'bluekirbyfi',
  },
  {
    src: 'video8',
    aspect: 824 / 456,
    title: 'x*y=k',
    by: 'pplpleasr',
  },  
  {
    src: 'video6',
    aspect: 500 / 606,
    title: 'ETH Bruh',
    by: 'pplpleasr',
  },
  {
    src: 'video5',
    aspect: 1,
    title: 'Safe Keeping',
    by: 'bluekirbyfi'
  },    
  {
    src: 'video9',
    aspect: 654 / 820,
    title: 'Dreaming at Dusk',
    by: 'ixshells',
    activeZ: 2.7,
    scale: 2,
  }
]

window.addEventListener('load', () => {
  if (!initialized) {
    initialized = true;
  }
});

window.addEventListener('wheel', (e) => {
  scrollBoost = e.deltaY * 0.001;
})
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
let prevItem;
let hoveredItem;

document.addEventListener( 'mousemove', handleMouseMove );
document.addEventListener('click', handleClick);

function handleClick() {
  if (intersections[0] && intersections[0].object !== activeItem) {
    activateItem();
  } else {
    prevItem = activeItem;
    activeItem = null;
    document.body.classList.remove('isActive');
  }
}

function handleMouseMove( event ) {

  event.preventDefault();

  mouse.x = ( event.clientX / width ) * 2 - 1;
  mouse.y = - ( event.clientY / height ) * 2 + 1;

  raycaster.setFromCamera( mouse, camera );
  intersections = raycaster.intersectObjects( itemGroup.children )

  if ( intersections.length > 0 ) {
    hoveredItem = intersections[0].object;
    if (hoveredItem !== activeItem) {
      document.body.style.cursor = 'pointer';
    }
  } else {
    hoveredItem = null;
    document.body.style.cursor = 'auto';
  }
}

function activateItem() {
  activeItem = intersections[0].object;
  document.body.classList.add('isActive');
  itemTitleEl.innerHTML = itemProps[activeItem.index].title;
  itemByEl.innerHTML = itemProps[activeItem.index].by;
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
const ambientLight = new THREE.AmbientLight(0xffffff, .35);
const centerLight = new THREE.PointLight(0xcccccc, 0.4, 20);
const topLeftSpotLight = new THREE.PointLight( 0xaa9977, 0.75, 80);
const bottomLeftLight = new THREE.PointLight(0x553333, 0.75, 280);
const topRightLight = new THREE.PointLight(0x887788, 0.75, 80);
const bottomRightLight = new THREE.PointLight( 0x9944cc, 0.75, 5);

addLights();

function addLights() {
  scene.add(ambientLight);
  centerLight.position.x = 0;
  centerLight.position.y = 0;
  centerLight.position.z = 4;
  scene.add(centerLight);

  bottomLeftLight.position.x = -4;
  bottomLeftLight.position.z = 4;
  bottomLeftLight.position.y = -4;
  scene.add(bottomLeftLight);

  topRightLight.position.x = 5;
  topRightLight.position.y = 5;
  topRightLight.position.z = 5;
  scene.add(topRightLight);

  bottomRightLight.position.set( 5, -5, 5 );
  scene.add(bottomRightLight);

  topLeftSpotLight.position.set( -5, 5, 5 );
  scene.add(topLeftSpotLight);
}

/*
  Items
  */
const itemCount = itemProps.length;
const itemGroup = new THREE.Group();
scene.add(itemGroup);

const starCount = 2000;
const starGroup = new THREE.Group();
scene.add(starGroup);

const emojiCount = emojiProps.length;
const emojiGroup = new THREE.Group();
scene.add(emojiGroup);

for (let i=0; i < itemCount; i++) {
  createItem(i);
}

for (let i=0; i < starCount; i++) {
  createStar(i);
}

for (let i=0; i < emojiCount; i++) {
  createEmoji(i);
}

function createItem(i) {
  setTimeout(() => {
    const props = itemProps[i];
    const texture = props.src.substr(-3) === 'jpg' ? new THREE.TextureLoader().load( props.src ) : new THREE.VideoTexture( document.getElementById( props.src ) );
    const scale = props.scale ? props.scale : 1;
    const geometry = new THREE.BoxBufferGeometry(.08 * props.aspect * scale, .08 * scale, .003);
    const material = new THREE.MeshPhongMaterial({ 
      color: 0xffffff, 
      wireframe: false,
      transparent: true,
      opacity: 0,
      map: texture
    });
    const item = new THREE.Mesh(geometry, material);
    item.index = i;
    resetItemPosition(item);
    
    itemGroup.add(item);
  }, i * 500);
}

function createStar(i) {
  const geometry = new THREE.OctahedronBufferGeometry(.0008);
  const material = new THREE.MeshLambertMaterial({ 
    color: 0xffffcc, 
    wireframe: false,
  });
  const item = new THREE.Mesh(geometry, material);
  item.index = i;
  resetStarPosition(item);
  starGroup.add(item);
}

function createEmoji(i) {
  setTimeout(() => {
    const props = emojiProps[i];
    const texture = new THREE.TextureLoader().load( props.src );
    const geometry = new THREE.PlaneBufferGeometry(0.03, 0.03, 2);
    const material = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: false,
      transparent: true,
      map: texture
    });
    const item = new THREE.Mesh(geometry, material);
    item.index = i;
    resetEmojiPosition(item);
    
    emojiGroup.add(item);
  }, i * 500);
}


function updateField() {
  for (let i = 0; i < itemGroup.children.length; i++) {
    const item = itemGroup.children[i];
    const targetOpacity = activeItem ? 0.2 : 1;
    if (item === activeItem) {
      let activeZ = itemProps[item.index].activeZ ? itemProps[item.index].activeZ : 2.8;
      if (width < 600) {
        activeZ *= 0.95;
      }
      item.position.x += 0.3 * -item.position.x;
      item.position.y += 0.3 * -item.position.y;
      item.position.z += 0.3 * (activeZ - item.position.z);
      item.material.opacity += 0.3 * (1 - item.material.opacity);
      item.rotation.x += 0.3 * (-mouse.y * 0.4 - item.rotation.x);
      item.rotation.y += 0.3 * (mouse.x * 0.4 - item.rotation.y);
      item.rotation.z += 0.3 * -item.rotation.z;
    } else if (item === hoveredItem) {
      let speed = prevItem === hoveredItem ? 1 : 0.2;
      item.position.z += item.vz * speed;
      item.rotation.x += 0.03 * (-item.rotation.x);
      item.rotation.y += 0.03 * (-item.rotation.y);
      item.rotation.z += 0.03 * (-item.rotation.z);
      if (item.position.z > 3) {
        resetItemPosition(item);
      }
    } else {
      item.position.z += item.vz + scrollBoost;
      item.material.opacity += 0.06 * (targetOpacity - item.material.opacity);
      item.rotation.x += item.rvx;
      item.rotation.y += item.rvy;
      item.rotation.z += item.rvz;
      if (item.position.z > 3) {
        resetItemPosition(item);
      }
    }
  }

  for (let s = 0; s < starGroup.children.length; s++) {
    const item = starGroup.children[s];
    item.position.z += item.vz + scrollBoost;
    if (item.position.z > 3) {
      resetStarPosition(item);
    }
  }

  for (let e = 0; e < emojiGroup.children.length; e++) {
    const item = emojiGroup.children[e];
    item.position.z += item.vz + scrollBoost;
    item.rotation.z += item.rvz;  
    item.material.opacity += 0.3 * (1 - item.material.opacity);  
    if (item.position.z > 3) {
      resetEmojiPosition(item);
    }
  }
}

function resetItemPosition(item) {
  const positionRange = activeItem ? 1.2 : 0.6;
  item.material.opacity = 0;
  item.position.x = (Math.random() - 0.5) * positionRange;
  item.position.y = (Math.random() - 0.5) * positionRange;
  item.position.z = 1 + Math.random() * 0.5;
  item.rotation.x = Math.random();
  item.rotation.y = Math.random();
  item.rotation.z = Math.random();
  item.vz = Math.random() * 0.005 + 0.005;
  item.rvx = Math.random() * 0.02 - 0.01;
  item.rvy = Math.random() * 0.02 - 0.01;
  item.rvz = Math.random() * 0.02 - 0.01;
}

function resetStarPosition(item) {
  const positionRange = 2;
  item.position.x = (Math.random() - 0.5) * positionRange;
  item.position.y = (Math.random() - 0.5) * positionRange;
  item.position.z = 1 + Math.random() * 0.5;
  item.vz = Math.random() * 0.01 + 0.005;
}

function resetEmojiPosition(item) {
  const positionRange = 1;
  item.material.opacity = 0;
  item.position.x = (Math.random() - 0.5) * positionRange;
  item.position.y = (Math.random() - 0.5) * positionRange;
  item.position.z = -1 + Math.random() * 2;
  item.rotation.z = Math.random();  
  item.vz = Math.random() * 0.01 + 0.005;
  item.rvz = Math.random() * 0.02 - 0.01;  
}

const render = (now) => {

  requestAnimationFrame(render);

  if (!initialized) return;
  updateField()

  renderer.render(scene, camera);
  scrollBoost *= 0.8;
  if (scrollBoost < 0.00015) {
    scrollBoost = 0;
  }
  frame++;
}

requestAnimationFrame(render);




// Modal
var modal = document.getElementById("myModal");
var btn = document.getElementById("myBtn");
var span = document.getElementsByClassName("close")[0];

btn.onclick = function() {
  modal.style.display = "block";
}

span.onclick = function() {
  modal.style.display = "none";
}

window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}