const widthHeight = 15;
export const barConfigCreator = {
    'z': (settings,xi,yi,zi) => {
        return {
            width: widthHeight,
            height: widthHeight,
            depth: settings.sceneDepth,
            x: xi * settings.spacing,
            y: yi * settings.spacing,
            z: 0                
        };
    },
    'x': (settings,xi,yi,zi) => {
        return {
            width: settings.sceneDepth,
            height: widthHeight,
            depth: widthHeight,
            x: 0,
            y: yi * settings.spacing,
            z: zi * settings.spacing
        };
    },
    'y': (settings,xi,yi,zi) => {
        return {
            width: widthHeight,
            height: settings.sceneDepth,
            depth: widthHeight,
            x: xi * settings.spacing,
            y: 0,
            z: zi * settings.spacing
        };
    }
};