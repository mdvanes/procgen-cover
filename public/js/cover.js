import {barConfigCreator} from './barConfigCreator.js';
import HashConfig from './HashConfig.js';

let renderer, scene, camera;
//const kubisch = {};

// revolutions per second
const settings = {
    spacing: 500, // block spacing
    sceneDepth: 5000,
    cameraLookAt: null
};
// var angularSpeed = 0.2;
// var lastTime = 0;

// kubisch.angle = 0;

// kubisch.isShiftingOn = false;
// kubisch.isSpiralOutOn = false;
// kubisch.isResetOn = false;

// const geoTypes = {
//     0: () => new THREE.BoxGeometry(100, 100, 100),
//     1: () => new THREE.TetrahedronGeometry( 100 ),
//     2: () => new THREE.OctahedronGeometry( 100 ),
//     3: () => new THREE.DodecahedronGeometry( 100 ),
//     4: () => new THREE.IcosahedronGeometry( 100 ),
//     5: () => new THREE.SphereGeometry( 100 )
// }

const createShape = function(shapeType, shapeColor, xi, yi, zi) {
    // cube (width, height, depth)
    //console.log('shapeType', shapeType);
    const customShape = new THREE.Mesh(shapeType(), new THREE.MeshLambertMaterial({
        //wireframe: true,
        color: `#${shapeColor}`
    }));
    // const customShape = new THREE.Mesh(new THREE.BoxGeometry(100, 100, 100), new THREE.MeshLambertMaterial({
    //     //wireframe: true,
    //     color: '#ddd'
    // }));
    //cube.rotation.x = Math.PI * 0.1;
    customShape.position.x = xi * settings.spacing;
    customShape.position.y = yi * settings.spacing;
    customShape.position.z = zi * settings.spacing;
    return customShape;
};

// const widthHeight = 15;
// const barConfigCreator = {
//     'z': (settings,xi,yi,zi) => {
//         return {
//             width: widthHeight,
//             height: widthHeight,
//             depth: settings.sceneDepth,
//             x: xi * settings.spacing,
//             y: yi * settings.spacing,
//             z: 0                
//         };
//     },
//     'x': (settings,xi,yi,zi) => {
//         return {
//             width: settings.sceneDepth,
//             height: widthHeight,
//             depth: widthHeight,
//             x: 0,
//             y: yi * settings.spacing,
//             z: zi * settings.spacing
//         };
//     },
//     'y': (settings,xi,yi,zi) => {
//         return {
//             width: widthHeight,
//             height: settings.sceneDepth,
//             depth: widthHeight,
//             x: xi * settings.spacing,
//             y: 0,
//             z: zi * settings.spacing
//         };
//     }
// }

const createBar = function(xi,yi,zi,axisName) {
    const widthHeight = 15;
    // let width, height, depth, x, y, z;
    const { width, height, depth, x, y, z } = barConfigCreator[axisName](settings,xi,yi,zi)
    // TODO use polymorphism
    // if(axisName === 'z') {
    //     width = widthHeight;
    //     height = widthHeight;
    //     depth = settings.sceneDepth;
    //     x = xi * settings.spacing;
    //     y = yi * settings.spacing;
    //     z = 0;
    // } else if(axisName === 'x') {
    //     width = settings.sceneDepth;
    //     height = widthHeight;
    //     depth = widthHeight;
    //     x = 0;
    //     y = yi * settings.spacing;
    //     z = zi * settings.spacing;
    // } else {
    //     // y axis
    //     width = widthHeight;
    //     height = settings.sceneDepth;
    //     depth = widthHeight;
    //     x = xi * settings.spacing;
    //     y = 0;
    //     z = zi * settings.spacing;
    // }
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
    const spacing = 500;
    const min = -8;
    const max = 8;
    //var test = 0; // TODO remove
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
                    //test++;
                }
            }
        }
    }
    //console.log('amount of bars on z axis: ' + test);
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
    // var renderWidth = 600;
    // var renderHeight = 600;
    var renderWidth = 1222;
    var renderHeight = 300;        
    renderer.setSize(renderWidth, renderHeight);
    document.querySelector('.cover').appendChild(renderer.domElement);

    // camera
    camera = new THREE.PerspectiveCamera(45, renderWidth / renderHeight, 1, settings.sceneDepth);
    //camera.position.z = 1000;
    camera.position.set( 500, 500, 1000); // x,y,z
    settings.cameraLookAt = new THREE.Vector3( -100, -150, 0 );
    camera.lookAt( settings.cameraLookAt );
//    camera.rotation.z = 1;

    // Math.round((Math.random() * 5))
    rotateCamera(hashConfig.cameraOffset, camera, settings.cameraLookAt)

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
    // TODO pick bgColor from a limited list of approved colors
    // ok colors: ffffff, #cccccc, #bbffdc, #ffbbbb, #f5bbff, #c5bbff, #bbe9ff, #bbffe0, #ccffbb, #fbffbb, #ffdebb
    const bgColor = hashConfig.bgColor; //0xe0b15b; //0x00ff00;
    scene.fog = new THREE.Fog(bgColor, 2000, 5000); // TODO hex, near, far make near and far variables
    // from r78 scene.background(new THREE.color(0x00ff00))
    renderer.setClearColorHex( bgColor, 1 );

    //animate();
    renderer.render(scene, camera);
};
