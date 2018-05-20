/**
 * SHA1 hash as input, is 40 chars
 * 6         e73        9       1            b93eb529004e1c67a2d28fced849ee1bb76e7391b
 * shapeType shapeColor bgColor cameraOffset
 * 
 * Permutations: 16^6 = 16777216
 */
class HashConfig {
    constructor(hash) {
        console.log('Source hash =', hash);
        const hashArr = hash.split('');
        // const shapeTypeHex = hashArr.shift();
        // const shapeTypeScaled = Math.round(parseInt(shapeTypeHex, 16) * 0.33) + 1;
        // console.log(shapeTypeHex, '->', shapeTypeScaled);
        // this.shapeType = shapeTypeScaled;//hash.split('').shift();//Math.round(Math.random() * 5);
        this.shapeType = this.getShapeType(hashArr.shift());
        this.shapeColor = hashArr.splice(0,3).join('');
        //'14524'.split('').splice(1,3).join('')
        this.bgColor = this.getBgColor(hashArr.shift()); //hashArr.splice(0,3).join('');
        this.cameraOffset = parseInt(hashArr.shift(), 16);
    }

    getShapeType(code) {
        const geoTypes = {
            0: () => new THREE.BoxGeometry(100, 100, 100),
            1: () => new THREE.TetrahedronGeometry( 100 ),
            2: () => new THREE.OctahedronGeometry( 100 ),
            3: () => new THREE.DodecahedronGeometry( 100 ),
            4: () => new THREE.IcosahedronGeometry( 100 ),
            5: () => new THREE.SphereGeometry( 100 )
        }
        const codeScaled = Math.round(parseInt(code, 16) / 16 * Object.keys(geoTypes).length) - 1;
        console.log(`shape type ${code} -> ${codeScaled} -> ${geoTypes[codeScaled]}`);
        return geoTypes[codeScaled];
    }

    getBgColor(code) {
        const acceptedColors = [0xffffff, 0xcccccc, 0xbbffdc, 0xffbbbb, 0xf5bbff, 0xc5bbff, 0xbbe9ff, 0xbbffe0, 0xccffbb, 0xfbffbb, 0xffdebb]
        const codeScaled = Math.round(parseInt(code, 16) / 16 * acceptedColors.length) - 1;
        console.log(`bg color ${code} -> ${codeScaled} -> ${acceptedColors[codeScaled]}`);
        return acceptedColors[codeScaled];
    }
}

export default HashConfig;