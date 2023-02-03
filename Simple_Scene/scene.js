var scene, camera, renderer, box1, box2;
let on = false

init();

function init(){
    window.addEventListener("keydown", lightup)

    const assetPath = 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/2666677/';

    scene = new THREE.Scene();

    //sky box
    const cubeMap = new THREE.CubeTextureLoader().setPath(`${assetPath}skybox2_`).load([
        'px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg'
    ]);
    scene.background = new THREE.Color('grey');
    scene.background = cubeMap;

    //camera
    camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
    camera.position.set(10, 20, 10);

    //ambient lighting
    const ambient = new THREE.HemisphereLight(0xffffbb, 0x080820);
    scene.add(ambient);

    //directional lighting
    const light = new THREE.DirectionalLight(0xFFFFFF, 1);
    light.position.set( 1, 10, 6);
    scene.add(light);

    renderer = new THREE.WebGLRenderer();
    renderer.setSize( window.innerWidth, window.innerHeight );
    document.body.appendChild( renderer.domElement );

    //orbital controls of the camera
    const controls = new THREE.OrbitControls( camera, renderer.domElement );
    controls.target.set(0,0,0);
    controls.update();

    //for the fins
    const length = 2, width = 6.5;

    const shape = new THREE.Shape();
    shape.moveTo( 0,0 );
    shape.lineTo( 0, width );
    shape.lineTo( length, width );
    shape.lineTo( length, 0 );
    shape.lineTo( 0, 0 );

    const extrudeSettings = {
        steps: 1,
        depth: 0.25,
        bevelEnabled: true,
        bevelThickness: 1,
        bevelSize: 1,
        bevelOffset: 0,
        bevelSegments: 1
    };

    //Add meshes here
    const baseHiltGeometry = new THREE.CylinderGeometry( 2.5, 2.5, 26, 32 ); //radius top, radius buttom, height, segments
    const centerHiltGeometry = new THREE.CylinderGeometry( 2.75, 2.75, 6, 32 ); //radius top, radius buttom, height, segments
    const bottomInsideGeometry = new THREE.CylinderGeometry( 2, 2, 3, 32 ); 
    const topInsideGeometry = new THREE.CylinderGeometry( 2.25, 2.25, 2.5, 32 ); //where the blade comes out
    const frontButtonGeometry1 = new THREE.CylinderGeometry( 0.75, 0.75, 0.75, 32 ); //button
    const frontButtonGeometry2 = new THREE.CylinderGeometry( 1, 1, 1, 32 ); //button cover
    const backButtonGeometry1 = new THREE.CylinderGeometry( 0.75, 0.75, 1.25, 32 ); //button
    const backButtonGeometry2 = new THREE.CylinderGeometry( 1, 1, 1.5, 32 ); //button cover
    const sideBoxGeometry1 = new THREE.BoxGeometry(0.875,6,1.25)
    const sideBoxGeometry2 = new THREE.BoxGeometry(0.125,6,1.25)
    const finGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings) //for the buttom of the lightsaber

    const silverMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.5,
        metalness: 1.0,
        // roughnessMap: roughnessMap,
        // metalnessMap: metalnessMap,
        envMap: cubeMap, // important -- especially for metals!
        envMapIntensity: 1
    });

    const goldMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xc28e00,
        roughness: 0.5,
        metalness: 1.0,
        // roughnessMap: roughnessMap,
        // metalnessMap: metalnessMap,
        envMap: cubeMap, // important -- especially for metals!
        envMapIntensity: 1
    });

    const darkColor = new THREE.MeshStandardMaterial({ 
        color: 0x000000
    });

    //the lightsaber
    baseHilt = new THREE.Mesh(baseHiltGeometry, silverMaterial);
    baseHilt.position.x = 0;
    baseHilt.position.y = 0;
    centerHilt = new THREE.Mesh(centerHiltGeometry, silverMaterial);
    centerHilt.position.x = 0;
    centerHilt.position.y = 0;
    sideBox1 = new THREE.Mesh(sideBoxGeometry1, silverMaterial)
    sideBox1.position.x = 3;
    sideBox1.position.y = 0;
    sideBox2 = new THREE.Mesh(sideBoxGeometry2, goldMaterial)
    sideBox2.position.x = 3.5;
    sideBox2.position.y = 0;
    frontButton1 = new THREE.Mesh(frontButtonGeometry1, goldMaterial)
    frontButton1.position.z = -2.825;
    frontButton1.position.y = 11;
    frontButton1.rotation.x = Math.PI/2
    frontButton1.rotation.y = Math.PI/2
    frontButton2 = new THREE.Mesh(frontButtonGeometry2, silverMaterial)
    frontButton2.position.z = -2.5;
    frontButton2.position.y = 11;
    frontButton2.rotation.x = Math.PI/2
    frontButton2.rotation.y = Math.PI/2
    backButton1 = new THREE.Mesh(backButtonGeometry1, goldMaterial)
    backButton1.position.z = 3.25;
    backButton1.position.y = 12;
    backButton1.rotation.x = Math.PI/2
    backButton1.rotation.y = Math.PI/2
    backButton2 = new THREE.Mesh(backButtonGeometry2, silverMaterial)
    backButton2.position.z = 3;
    backButton2.position.y = 12;
    backButton2.rotation.x = Math.PI/2
    backButton2.rotation.y = Math.PI/2
    bottomInside = new THREE.Mesh(bottomInsideGeometry, darkColor)
    bottomInside.position.x = 0;
    bottomInside.position.y = 13;
    topInside = new THREE.Mesh(topInsideGeometry, silverMaterial)
    topInside.position.x = 0;
    topInside.position.y = 14.5;

    //all of the fins on the bottom
    fin = new THREE.Mesh(finGeometry, darkColor)
    let rotationY = Math.PI/6
    for(let i = 0; i < 6; i++){
        const eachFin = fin.clone()
        eachFin.position.x = 0;
        eachFin.position.z = 0;
        eachFin.position.y = -11.5;
        eachFin.rotation.y = rotationY
        rotationY += Math.PI/3
        scene.add(eachFin)
    }

    let arc = Math.PI
    let offset = 0
    let arcOffset = 0
    for(let i = 0; i < 80; i++){
        arc += arcOffset
        const topRingGeometry = new THREE.TorusGeometry(2.35, 0.125, 30, 32, arc) //very top part
        const topRing = new THREE.Mesh(topRingGeometry, silverMaterial)
        topRing.position.x = 0;
        topRing.position.z = 0;
        topRing.position.y = 13 + offset;
        topRing.rotation.x = Math.PI / 2
        topRing.rotation.z = Math.PI*2 - arcOffset * i / 4
        offset += 0.05
        arcOffset -= 0.00025
        scene.add(topRing)
    }

    scene.add(baseHilt, centerHilt, sideBox1, sideBox2, frontButton1, frontButton2, backButton1, backButton2, bottomInside, topInside);

    window.addEventListener( 'resize', resize, false);

    update();
}

function lightup(){
    const saberGeometry = new THREE.CylinderGeometry( 2, 2, 1, 32 ); //radius top, radius buttom, height, segments
    const blueColor = new THREE.MeshBasicMaterial({ 
        color: 0x0000ff
    })
    if(!on){
        saber = new THREE.Mesh(saberGeometry, blueColor)
        for(let i = 0; i < 70; i++){
            const eachSaber = saber.clone()
            eachSaber.position.x = 0;
            eachSaber.position.z = 0;
            eachSaber.position.y = 15 + i
            scene.add(eachSaber)
        }
        on = true
    } else {
        for(let i = 0; i < 70; i++){
            scene.remove(eachSaber)
        }
        on = false
    }
}

function update(){
    requestAnimationFrame( update );
    renderer.render( scene, camera );
}

function resize(){
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
}

const delay = (delayInms) => {
    return new Promise(resolve => setTimeout(resolve, delayInms));
  }