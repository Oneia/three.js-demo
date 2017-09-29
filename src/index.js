import * as TrackballControls from 'three-trackballcontrols';
import * as OrbitControls from 'three-orbitcontrols';
import {
  BoxGeometry,
  Mesh,
  MeshPhongMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  SpotLight,
  PCFSoftShadowMap,
  SpotLightHelper,
  CameraHelper,
  AmbientLight,
  AxisHelper,
  TetrahedronGeometry,
  MeshBasicMaterial,
} from 'three';

class AppThreeDemo {

  constructor() {
    this.with = window.innerWidth;
    this.height = window.innerHeight;

    this.createRenderer();
    this.createScene();
    this.addCamera();
    this.addLight();
    this.addMesh();
    this.addCube();
    this.addSphere();

    this.render();
  }

  createRenderer() {
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( this.with, this.height );
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.gammaInput = true;
    this.renderer.gammaOutput = true;

    // setInterval(() => {
    //   this.pyra.rotation.x +=0.05;
    //   this.pyra.rotation.z +=0.05;
    //   this.renderer.render( this.scene, this.camera );
    //   console.log('test');
    // },40);



    document.body.appendChild( this.renderer.domElement );
  }

  createScene() {
    this.scene = new Scene();
  }

  addCamera() {
    this.camera = new PerspectiveCamera( 35, this.with / this.height, 1, 1000 );
    this.camera.position.set( 65, 100, 300 );
    this.controls = new OrbitControls( this.camera, this.renderer.domElement );
    this.controls.addEventListener( 'change', () => this.render());
    this.controls.minDistance = 20;
    this.controls.maxDistance = 500;
    this.controls.enablePan = false;
  }

  addLight() {
    const ambient = new AmbientLight( 0xffffff, 0.1 );
    this.scene.add( ambient );
    this.spotLight = new SpotLight( 0xffffff, 1 );
    this.spotLight.position.set( 15, 40, 35 );
    // this.spotLight.angle = Math.PI / 4;
    // this.spotLight.penumbra = 0.05;
    // this.spotLight.decay = 2;
    // this.spotLight.distance = 200;
    this.spotLight.castShadow = true;
    // this.spotLight.shadow.mapSize.width = 1024;
    // this.spotLight.shadow.mapSize.height = 1024;
    // this.spotLight.shadow.camera.near = 10;
    // this.spotLight.shadow.camera.far = 200;
    this.scene.add( this.spotLight );
    // this.lightHelper = new SpotLightHelper( this.spotLight );
    // this.scene.add( this.lightHelper );
    // this.shadowCameraHelper = new CameraHelper( this.spotLight.shadow.camera );
    // this.scene.add( this.shadowCameraHelper );
    // this.scene.add( new AxisHelper( 10 ) );
  }

  addMesh() {
    const material = new MeshPhongMaterial( { color: 0x808080, dithering: true } );
    const geometry = new BoxGeometry( 200, 1, 200 );
    const mesh = new Mesh( geometry, material );
    mesh.position.set( 0, - 40, 0 );
    mesh.receiveShadow = true;
    this.scene.add( mesh );
  }

  addCube() {
    const material = new MeshPhongMaterial( { color: 0x4080ff, dithering: true } );
    const geometry = new BoxGeometry( 3, 1, 2 );
    const mesh = new Mesh( geometry, material );
    mesh.position.set(40, 2, 0);
    mesh.castShadow = true;
    this.scene.add( mesh );
    this.controls.target.copy( mesh.position );
    this.controls.update();
  }

  addSphere() {
    const pyremideGeom = new TetrahedronGeometry(5);
    const matPyr = new MeshBasicMaterial({color: 'red'});
    this.pyra = new Mesh(pyremideGeom, matPyr);
    this.pyra.castShadow = true;
    this.pyra.position.set(10, 2, 0);
    this.scene.add(this.pyra);
  }

  render() {
     requestAnimationFrame(() => this.render());

    if (this.pyra) {
      this.pyra.rotation.x +=0.05;
      this.pyra.rotation.z +=0.05;
    }
    

    this.renderer.render( this.scene, this.camera );
  }

}

new AppThreeDemo();