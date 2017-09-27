import * as TrackballControls from 'three-trackballcontrols';
import * as OrbitControls from 'three-orbitcontrols';
import {
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer, SpotLight, PCFSoftShadowMap, SpotLightHelper,
  CameraHelper, AmbientLight, AxisHelper,
} from 'three';


var renderer, scene, camera;
var spotLight, lightHelper, shadowCameraHelper;
function init() {
  renderer = new WebGLRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  scene = new Scene();
  camera = new PerspectiveCamera( 35, window.innerWidth / window.innerHeight, 1, 1000 );
  camera.position.set( 65, 8, - 10 );
  var controls = new OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  controls.minDistance = 20;
  controls.maxDistance = 500;
  controls.enablePan = false;
  var ambient = new AmbientLight( 0xffffff, 0.1 );
  scene.add( ambient );
  spotLight = new SpotLight( 0xffffff, 1 );
  spotLight.position.set( 15, 40, 35 );
  spotLight.angle = Math.PI / 4;
  spotLight.penumbra = 0.05;
  spotLight.decay = 2;
  spotLight.distance = 200;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 200;
  scene.add( spotLight );
  lightHelper = new SpotLightHelper( spotLight );
  scene.add( lightHelper );
  shadowCameraHelper = new CameraHelper( spotLight.shadow.camera );
  scene.add( shadowCameraHelper );
  scene.add( new AxisHelper( 10 ) );
  var material = new MeshPhongMaterial( { color: 0x808080, dithering: true } );
  var geometry = new BoxGeometry( 2000, 1, 2000 );
  var mesh = new Mesh( geometry, material );
  mesh.position.set( 0, - 1, 0 );
  mesh.receiveShadow = true;
  scene.add( mesh );
  var material = new MeshPhongMaterial( { color: 0x4080ff, dithering: true } );
  var geometry = new BoxGeometry( 3, 1, 2 );
  var mesh = new Mesh( geometry, material );
  mesh.position.set( 40, 2, 0 );
  mesh.castShadow = true;
  scene.add( mesh );
  controls.target.copy( mesh.position );
  controls.update();
  window.addEventListener( 'resize', onResize, false );
}
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function render() {
  lightHelper.update();
  shadowCameraHelper.update();
  renderer.render( scene, camera );
}


init();
render();