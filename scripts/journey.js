// Set up Three.js scene for Mars
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(300, 300);
document.getElementById('mars-container').appendChild(renderer.domElement);

// Create Mars sphere
const geometry = new THREE.SphereGeometry(1, 32, 32);
const textureLoader = new THREE.TextureLoader();
const marsTexture = textureLoader.load('https://space-assets-1290.kxcdn.com/assets/planets/mars_texture.jpg');
const material = new THREE.MeshStandardMaterial({
    map: marsTexture,
    roughness: 0.7,
    metalness: 0.3
});
const mars = new THREE.Mesh(geometry, material);
scene.add(mars);

// Add ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Add directional light for shadows
const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 3, 5);
scene.add(directionalLight);

camera.position.z = 2.5;

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    mars.rotation.y += 0.005;
    renderer.render(scene, camera);
}

animate();
