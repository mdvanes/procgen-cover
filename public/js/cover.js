import {barConfigCreator} from './barConfigCreator.js';
import HashConfig from './HashConfig.js';

let renderer, scene, camera;

// revolutions per second
const settings = {
    spacing: 500, // block spacing
    sceneDepth: 5000,
    cameraLookAt: null
};

const createShape = function(shapeType, shapeColor, xi, yi, zi) {
    const customShape = new THREE.Mesh(shapeType(), new THREE.MeshLambertMaterial({
        //wireframe: true,
        color: `#${shapeColor}`
    }));
    customShape.position.x = xi * settings.spacing;
    customShape.position.y = yi * settings.spacing;
    customShape.position.z = zi * settings.spacing;
    return customShape;
};

const createBar = function(xi,yi,zi,axisName) {
    const { width, height, depth, x, y, z } = barConfigCreator[axisName](settings,xi,yi,zi);
    const bar = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), new THREE.MeshLambertMaterial({
        //wireframe: true,
        color: '#999'//'#33f'
    }));
    bar.position.x = x;
    bar.position.y = y;
    bar.position.z = z;
    scene.add(bar);
};

const addElements = function(hashConfig) {
    const min = -8;
    const max = 8;
    //var debugCounter = 0;
    for(let zi = min; zi < max; zi++) {
        for(let yi = min; yi < max; yi++) {
            for(let xi = min; xi < max; xi++) {
                scene.add(createShape(hashConfig.shapeType, hashConfig.shapeColor, xi, yi, zi));
                // add bars along the x axis
                if(xi === min) {
                    createBar(xi,yi,zi,'x');
                }
                // add bars along the y axis
                if(yi === min) {
                    createBar(xi,yi,zi,'y'); // TODO replace 'y' by enum Bar.Y. Make Bar an object.
                }
                // add bars along the z axis
                if(zi === min) {
                    createBar(xi,yi,zi,'z');
                    //debugCounter++;
                }
            }
        }
    }
    //console.log('amount of bars on z axis: ' + debugCounter);
};

function rotateCamera(offset, _camera, lookAt) {
    const offsetScaled = offset * 100;
    _camera.position.x += offsetScaled;
    _camera.position.z -= offsetScaled;
    _camera.lookAt( lookAt );
}

export function generateCover(hash = '3fd4e1c67a2d28fced849ee1bb76e7391b93eb12') {
    const hashConfig = new HashConfig(hash);
    // renderer
    renderer = new THREE.WebGLRenderer({alpha: true, antialias: true});

    const renderWidth = document.body.clientWidth; //1222
    const renderHeight = document.body.clientHeight; //300
    renderer.setSize(renderWidth, renderHeight);
    document.querySelector('.cover').appendChild(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(45, renderWidth / renderHeight, 1, settings.sceneDepth);
    camera.position.set( 500, 500, 1000); // x,y,z
    settings.cameraLookAt = new THREE.Vector3( -100, -150, 0 );
    camera.lookAt( settings.cameraLookAt );

    rotateCamera(hashConfig.cameraOffset, camera, settings.cameraLookAt);

    // scene
    scene = new THREE.Scene();

    addElements(hashConfig);

    // Do not use
    // const ambientLight = new THREE.AmbientLight(0x0000ff, 0.001);
    // scene.add(ambientLight);

    // Maybe use instead of ambientLight or colored DirectionalLight 
    // const hemiLight = new THREE.HemisphereLight(0xff0000, 0.1);
    // scene.add(hemiLight);

    // directional lighting
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(500, 500, -1000);
    //directionalLight.position.set(500, 500, 1000).normalize();
    scene.add(directionalLight);

    const directionalLightFront = new THREE.DirectionalLight(0xffffff);
    directionalLightFront.position.set(0, 500, 1000);
    directionalLightFront.intensity = 0.2;
    scene.add(directionalLightFront);

    // If setting fog color, set image background color to the same color
    console.log(hashConfig.bgColor, typeof hashConfig.bgColor);
    const bgColor = hashConfig.bgColor;
    scene.fog = new THREE.Fog(bgColor, 2000, 5000);
    // from r78 scene.background(new THREE.color(0x00ff00))
    renderer.setClearColorHex( bgColor, 1 );

    renderer.render(scene, camera);
};
