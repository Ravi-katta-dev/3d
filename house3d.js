// 3D House Model with Modern Facilities
// Using Three.js for realistic rendering

let scene, camera, renderer, controls;
let house, rooms = {};
let viewMode = 'cutaway';
let animationId;

// Initialize the 3D scene
function init() {
    // Scene setup
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb); // Sky blue
    scene.fog = new THREE.Fog(0x87ceeb, 50, 200);
    
    // Camera setup
    camera = new THREE.PerspectiveCamera(
        60,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(30, 25, 30);
    camera.lookAt(0, 0, 0);
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.getElementById('canvas-container').appendChild(renderer.domElement);
    
    // Orbit controls (manual implementation)
    setupControls();
    
    // Lighting
    setupLighting();
    
    // Ground
    createGround();
    
    // Build the house
    buildHouse();
    
    // Event listeners
    setupEventListeners();
    
    // Hide loading
    document.getElementById('loading').style.display = 'none';
    
    // Start animation
    animate();
}

// Setup lighting for realistic rendering
function setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    // Directional light (sun)
    const sunLight = new THREE.DirectionalLight(0xffffff, 0.8);
    sunLight.position.set(50, 50, 30);
    sunLight.castShadow = true;
    sunLight.shadow.camera.left = -50;
    sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50;
    sunLight.shadow.camera.bottom = -50;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    scene.add(sunLight);
    
    // Interior lights
    const interiorLight1 = new THREE.PointLight(0xffeecc, 0.6, 30);
    interiorLight1.position.set(0, 8, 0);
    scene.add(interiorLight1);
    
    const interiorLight2 = new THREE.PointLight(0xffeecc, 0.5, 20);
    interiorLight2.position.set(-5, 8, 5);
    scene.add(interiorLight2);
    
    const interiorLight3 = new THREE.PointLight(0xffeecc, 0.5, 20);
    interiorLight3.position.set(5, 8, -5);
    scene.add(interiorLight3);
}

// Create ground/land
function createGround() {
    const groundGeometry = new THREE.PlaneGeometry(100, 100);
    const groundMaterial = new THREE.MeshStandardMaterial({
        color: 0x7caf5a,
        roughness: 0.8,
        metalness: 0.2
    });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);
    
    // Add garden elements
    addGardenElements();
}

// Add garden decorations
function addGardenElements() {
    // Trees
    for (let i = 0; i < 6; i++) {
        const treeGroup = new THREE.Group();
        
        // Trunk
        const trunkGeometry = new THREE.CylinderGeometry(0.3, 0.4, 4, 8);
        const trunkMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
        trunk.position.y = 2;
        trunk.castShadow = true;
        treeGroup.add(trunk);
        
        // Foliage
        const foliageGeometry = new THREE.SphereGeometry(2, 8, 8);
        const foliageMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
        const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
        foliage.position.y = 5;
        foliage.castShadow = true;
        treeGroup.add(foliage);
        
        // Position trees around the property
        const angle = (i / 6) * Math.PI * 2;
        treeGroup.position.x = Math.cos(angle) * 25;
        treeGroup.position.z = Math.sin(angle) * 25;
        
        scene.add(treeGroup);
    }
    
    // Pathway
    const pathGeometry = new THREE.PlaneGeometry(3, 20);
    const pathMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcccccc,
        roughness: 0.7
    });
    const path = new THREE.Mesh(pathGeometry, pathMaterial);
    path.rotation.x = -Math.PI / 2;
    path.position.y = 0.01;
    path.position.z = 10;
    scene.add(path);
}

// Build the complete house structure
function buildHouse() {
    house = new THREE.Group();
    
    // Foundation
    createFoundation();
    
    // Walls (exterior)
    createExteriorWalls();
    
    // Roof
    createRoof();
    
    // Windows and doors
    createWindowsAndDoors();
    
    // Interior walls and rooms
    createInteriorWalls();
    
    // Furnishings and facilities
    createKitchen();
    createBedroom();
    createBathroom();
    createLivingRoom();
    createStorage();
    createUtilities();
    
    scene.add(house);
}

// Foundation
function createFoundation() {
    const foundationGeometry = new THREE.BoxGeometry(20, 1, 15);
    const foundationMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x808080,
        roughness: 0.9
    });
    const foundation = new THREE.Mesh(foundationGeometry, foundationMaterial);
    foundation.position.y = 0.5;
    foundation.castShadow = true;
    foundation.receiveShadow = true;
    house.add(foundation);
}

// Exterior walls
function createExteriorWalls() {
    const wallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf5f5dc,
        roughness: 0.7,
        metalness: 0.1
    });
    
    // Front wall
    const frontWall = createWall(20, 8, 0.3, wallMaterial);
    frontWall.position.set(0, 5, -7.5);
    house.add(frontWall);
    
    // Back wall
    const backWall = createWall(20, 8, 0.3, wallMaterial);
    backWall.position.set(0, 5, 7.5);
    house.add(backWall);
    
    // Left wall
    const leftWall = createWall(15, 8, 0.3, wallMaterial);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-10, 5, 0);
    house.add(leftWall);
    
    // Right wall
    const rightWall = createWall(15, 8, 0.3, wallMaterial);
    rightWall.rotation.y = Math.PI / 2;
    rightWall.position.set(10, 5, 0);
    house.add(rightWall);
}

// Helper function to create a wall
function createWall(width, height, depth, material) {
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const wall = new THREE.Mesh(geometry, material);
    wall.castShadow = true;
    wall.receiveShadow = true;
    return wall;
}

// Roof
function createRoof() {
    // Main roof structure
    const roofGeometry = new THREE.ConeGeometry(14, 4, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x8b4513,
        roughness: 0.8
    });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 11;
    roof.rotation.y = Math.PI / 4;
    roof.castShadow = true;
    house.add(roof);
    
    // Chimney
    const chimneyGeometry = new THREE.BoxGeometry(1, 3, 1);
    const chimneyMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const chimney = new THREE.Mesh(chimneyGeometry, chimneyMaterial);
    chimney.position.set(5, 11.5, 3);
    chimney.castShadow = true;
    house.add(chimney);
}

// Windows and doors
function createWindowsAndDoors() {
    const windowMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x87ceeb,
        transparent: true,
        opacity: 0.4,
        roughness: 0.1,
        metalness: 0.9
    });
    
    const doorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x654321,
        roughness: 0.6
    });
    
    // Front door
    const doorGeometry = new THREE.BoxGeometry(2, 4, 0.2);
    const door = new THREE.Mesh(doorGeometry, doorMaterial);
    door.position.set(0, 3, -7.4);
    house.add(door);
    
    // Door handle
    const handleGeometry = new THREE.SphereGeometry(0.1, 16, 16);
    const handleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffd700,
        metalness: 1,
        roughness: 0.2
    });
    const handle = new THREE.Mesh(handleGeometry, handleMaterial);
    handle.position.set(0.7, 3, -7.3);
    house.add(handle);
    
    // Windows - Front
    const windowGeometry = new THREE.BoxGeometry(2, 2, 0.2);
    
    const window1 = new THREE.Mesh(windowGeometry, windowMaterial);
    window1.position.set(-5, 5, -7.4);
    house.add(window1);
    
    const window2 = new THREE.Mesh(windowGeometry, windowMaterial);
    window2.position.set(5, 5, -7.4);
    house.add(window2);
    
    // Windows - Sides
    const window3 = new THREE.Mesh(windowGeometry, windowMaterial);
    window3.position.set(-9.9, 5, -3);
    house.add(window3);
    
    const window4 = new THREE.Mesh(windowGeometry, windowMaterial);
    window4.position.set(-9.9, 5, 3);
    house.add(window4);
    
    const window5 = new THREE.Mesh(windowGeometry, windowMaterial);
    window5.position.set(9.9, 5, -3);
    house.add(window5);
    
    const window6 = new THREE.Mesh(windowGeometry, windowMaterial);
    window6.position.set(9.9, 5, 3);
    house.add(window6);
    
    // Windows - Back
    const window7 = new THREE.Mesh(windowGeometry, windowMaterial);
    window7.position.set(-3, 5, 7.4);
    house.add(window7);
    
    const window8 = new THREE.Mesh(windowGeometry, windowMaterial);
    window8.position.set(3, 5, 7.4);
    house.add(window8);
}

// Interior walls to divide rooms
function createInteriorWalls() {
    const interiorWallMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.8,
        side: THREE.DoubleSide
    });
    
    // Vertical wall dividing left and right sections
    const dividerWall1 = createWall(0.2, 8, 15, interiorWallMaterial);
    dividerWall1.position.set(0, 5, 0);
    house.add(dividerWall1);
    
    // Horizontal wall dividing front and back
    const dividerWall2 = createWall(10, 8, 0.2, interiorWallMaterial);
    dividerWall2.position.set(-5, 5, 0);
    house.add(dividerWall2);
    
    const dividerWall3 = createWall(10, 8, 0.2, interiorWallMaterial);
    dividerWall3.position.set(5, 5, 0);
    house.add(dividerWall3);
    
    // Floor
    const floorGeometry = new THREE.PlaneGeometry(19.5, 14.5);
    const floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd2b48c,
        roughness: 0.7
    });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 1;
    floor.receiveShadow = true;
    house.add(floor);
}

// Kitchen with appliances
function createKitchen() {
    const kitchenGroup = new THREE.Group();
    kitchenGroup.name = 'kitchen';
    
    // Kitchen counter
    const counterGeometry = new THREE.BoxGeometry(4, 1, 1.5);
    const counterMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x696969,
        roughness: 0.3,
        metalness: 0.5
    });
    const counter = new THREE.Mesh(counterGeometry, counterMaterial);
    counter.position.set(-7, 2, -5);
    kitchenGroup.add(counter);
    
    // Refrigerator
    const fridgeGeometry = new THREE.BoxGeometry(1.2, 2.5, 1);
    const fridgeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xc0c0c0,
        metalness: 0.8,
        roughness: 0.2
    });
    const fridge = new THREE.Mesh(fridgeGeometry, fridgeMaterial);
    fridge.position.set(-8.5, 2.5, -5);
    kitchenGroup.add(fridge);
    
    // Stove
    const stoveGeometry = new THREE.BoxGeometry(1, 1, 1);
    const stoveMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const stove = new THREE.Mesh(stoveGeometry, stoveMaterial);
    stove.position.set(-6, 2.5, -5);
    kitchenGroup.add(stove);
    
    // Burners
    for (let i = 0; i < 4; i++) {
        const burnerGeometry = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
        const burnerMaterial = new THREE.MeshStandardMaterial({ 
            color: 0xff4500,
            emissive: 0xff4500,
            emissiveIntensity: 0.3
        });
        const burner = new THREE.Mesh(burnerGeometry, burnerMaterial);
        burner.position.set(
            -6 + (i % 2) * 0.4 - 0.2,
            3.05,
            -5 + Math.floor(i / 2) * 0.4 - 0.2
        );
        kitchenGroup.add(burner);
    }
    
    // Sink
    const sinkGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.6);
    const sinkMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xc0c0c0,
        metalness: 0.9,
        roughness: 0.1
    });
    const sink = new THREE.Mesh(sinkGeometry, sinkMaterial);
    sink.position.set(-5, 2.5, -5);
    kitchenGroup.add(sink);
    
    // Cabinets
    const cabinetGeometry = new THREE.BoxGeometry(4, 1.5, 0.8);
    const cabinetMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const cabinet = new THREE.Mesh(cabinetGeometry, cabinetMaterial);
    cabinet.position.set(-7, 4.5, -5);
    kitchenGroup.add(cabinet);
    
    // Dining table
    const tableGeometry = new THREE.BoxGeometry(2, 0.1, 1.5);
    const tableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.set(-5, 2, -2);
    kitchenGroup.add(table);
    
    // Table legs
    const legGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1.9, 8);
    const legMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const positions = [
        [-5.8, 1, -2.6],
        [-5.8, 1, -1.4],
        [-4.2, 1, -2.6],
        [-4.2, 1, -1.4]
    ];
    positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeometry, legMaterial);
        leg.position.set(...pos);
        kitchenGroup.add(leg);
    });
    
    // Chairs
    for (let i = 0; i < 2; i++) {
        const chairGroup = new THREE.Group();
        
        const seatGeometry = new THREE.BoxGeometry(0.8, 0.1, 0.8);
        const seat = new THREE.Mesh(seatGeometry, tableMaterial);
        seat.position.y = 1.5;
        chairGroup.add(seat);
        
        const backGeometry = new THREE.BoxGeometry(0.8, 0.8, 0.1);
        const back = new THREE.Mesh(backGeometry, tableMaterial);
        back.position.set(0, 2, -0.35);
        chairGroup.add(back);
        
        chairGroup.position.set(-5 + i * 2.5, 0, -0.5);
        kitchenGroup.add(chairGroup);
    }
    
    house.add(kitchenGroup);
    rooms.kitchen = kitchenGroup;
}

// Bedroom with furniture
function createBedroom() {
    const bedroomGroup = new THREE.Group();
    bedroomGroup.name = 'bedroom';
    
    // Bed
    const bedFrameGeometry = new THREE.BoxGeometry(3, 0.5, 4);
    const bedFrameMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const bedFrame = new THREE.Mesh(bedFrameGeometry, bedFrameMaterial);
    bedFrame.position.set(6, 1.5, -4);
    bedroomGroup.add(bedFrame);
    
    // Mattress
    const mattressGeometry = new THREE.BoxGeometry(2.8, 0.4, 3.8);
    const mattressMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const mattress = new THREE.Mesh(mattressGeometry, mattressMaterial);
    mattress.position.set(6, 2, -4);
    bedroomGroup.add(mattress);
    
    // Pillows
    for (let i = 0; i < 2; i++) {
        const pillowGeometry = new THREE.BoxGeometry(0.8, 0.3, 0.6);
        const pillowMaterial = new THREE.MeshStandardMaterial({ color: 0xe0e0e0 });
        const pillow = new THREE.Mesh(pillowGeometry, pillowMaterial);
        pillow.position.set(6 - 0.7 + i * 1.4, 2.3, -5.5);
        bedroomGroup.add(pillow);
    }
    
    // Blanket
    const blanketGeometry = new THREE.BoxGeometry(2.6, 0.2, 2.5);
    const blanketMaterial = new THREE.MeshStandardMaterial({ color: 0x4169e1 });
    const blanket = new THREE.Mesh(blanketGeometry, blanketMaterial);
    blanket.position.set(6, 2.3, -3);
    bedroomGroup.add(blanket);
    
    // Wardrobe
    const wardrobeGeometry = new THREE.BoxGeometry(2, 4, 1);
    const wardrobeMaterial = new THREE.MeshStandardMaterial({ color: 0x654321 });
    const wardrobe = new THREE.Mesh(wardrobeGeometry, wardrobeMaterial);
    wardrobe.position.set(8.5, 3, -6);
    bedroomGroup.add(wardrobe);
    
    // Nightstand
    const nightstandGeometry = new THREE.BoxGeometry(0.8, 1, 0.8);
    const nightstandMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const nightstand = new THREE.Mesh(nightstandGeometry, nightstandMaterial);
    nightstand.position.set(4.5, 1.5, -5.5);
    bedroomGroup.add(nightstand);
    
    // Lamp on nightstand
    const lampBaseGeometry = new THREE.CylinderGeometry(0.1, 0.15, 0.5, 8);
    const lampBaseMaterial = new THREE.MeshStandardMaterial({ color: 0xffd700 });
    const lampBase = new THREE.Mesh(lampBaseGeometry, lampBaseMaterial);
    lampBase.position.set(4.5, 2.3, -5.5);
    bedroomGroup.add(lampBase);
    
    const lampShadeGeometry = new THREE.ConeGeometry(0.3, 0.5, 8);
    const lampShadeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffe0,
        emissive: 0xffffe0,
        emissiveIntensity: 0.3
    });
    const lampShade = new THREE.Mesh(lampShadeGeometry, lampShadeMaterial);
    lampShade.position.set(4.5, 2.8, -5.5);
    bedroomGroup.add(lampShade);
    
    house.add(bedroomGroup);
    rooms.bedroom = bedroomGroup;
}

// Bathroom with fixtures
function createBathroom() {
    const bathroomGroup = new THREE.Group();
    bathroomGroup.name = 'bathroom';
    
    // Toilet
    const toiletBaseGeometry = new THREE.CylinderGeometry(0.4, 0.4, 0.5, 16);
    const toiletMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.2,
        metalness: 0.3
    });
    const toiletBase = new THREE.Mesh(toiletBaseGeometry, toiletMaterial);
    toiletBase.position.set(7, 1.5, 5);
    bathroomGroup.add(toiletBase);
    
    const toiletSeatGeometry = new THREE.CylinderGeometry(0.5, 0.4, 0.3, 16);
    const toiletSeat = new THREE.Mesh(toiletSeatGeometry, toiletMaterial);
    toiletSeat.position.set(7, 2, 5);
    bathroomGroup.add(toiletSeat);
    
    const toiletTankGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.3);
    const toiletTank = new THREE.Mesh(toiletTankGeometry, toiletMaterial);
    toiletTank.position.set(7, 2.4, 5.4);
    bathroomGroup.add(toiletTank);
    
    // Sink
    const sinkBaseGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 8);
    const sinkBaseMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xc0c0c0,
        metalness: 0.9,
        roughness: 0.1
    });
    const sinkBase = new THREE.Mesh(sinkBaseGeometry, sinkBaseMaterial);
    sinkBase.position.set(5, 2, 6);
    bathroomGroup.add(sinkBase);
    
    const sinkBowlGeometry = new THREE.SphereGeometry(0.5, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const sinkBowl = new THREE.Mesh(sinkBowlGeometry, toiletMaterial);
    sinkBowl.position.set(5, 2.5, 6);
    bathroomGroup.add(sinkBowl);
    
    // Mirror above sink
    const mirrorGeometry = new THREE.PlaneGeometry(1.5, 1.5);
    const mirrorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x87ceeb,
        metalness: 1,
        roughness: 0
    });
    const mirror = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirror.position.set(5, 4, 6.8);
    bathroomGroup.add(mirror);
    
    // Shower/Bathtub
    const bathtubGeometry = new THREE.BoxGeometry(1.5, 0.8, 2.5);
    const bathtubMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
    const bathtub = new THREE.Mesh(bathtubGeometry, bathtubMaterial);
    bathtub.position.set(8.5, 1.5, 3);
    bathroomGroup.add(bathtub);
    
    // Shower head
    const showerPoleGeometry = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
    const showerPoleMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xc0c0c0,
        metalness: 0.9,
        roughness: 0.1
    });
    const showerPole = new THREE.Mesh(showerPoleGeometry, showerPoleMaterial);
    showerPole.position.set(8.5, 3, 1.5);
    bathroomGroup.add(showerPole);
    
    const showerHeadGeometry = new THREE.SphereGeometry(0.2, 8, 8);
    const showerHead = new THREE.Mesh(showerHeadGeometry, showerPoleMaterial);
    showerHead.position.set(8.5, 4, 2);
    bathroomGroup.add(showerHead);
    
    // Towel rack
    const towelRackGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
    const towelRack = new THREE.Mesh(towelRackGeometry, showerPoleMaterial);
    towelRack.rotation.z = Math.PI / 2;
    towelRack.position.set(6.5, 3, 6.5);
    bathroomGroup.add(towelRack);
    
    house.add(bathroomGroup);
    rooms.bathroom = bathroomGroup;
}

// Living room with furniture
function createLivingRoom() {
    const livingGroup = new THREE.Group();
    livingGroup.name = 'living';
    
    // Sofa
    const sofaBaseGeometry = new THREE.BoxGeometry(3, 0.8, 1.2);
    const sofaMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const sofaBase = new THREE.Mesh(sofaBaseGeometry, sofaMaterial);
    sofaBase.position.set(-6, 1.5, 3);
    livingGroup.add(sofaBase);
    
    const sofaBackGeometry = new THREE.BoxGeometry(3, 1, 0.3);
    const sofaBack = new THREE.Mesh(sofaBackGeometry, sofaMaterial);
    sofaBack.position.set(-6, 2.3, 3.5);
    livingGroup.add(sofaBack);
    
    // Sofa arms
    const armGeometry = new THREE.BoxGeometry(0.3, 0.8, 1.2);
    const armMaterial = new THREE.MeshStandardMaterial({ color: 0x8b0000 });
    const leftArm = new THREE.Mesh(armGeometry, armMaterial);
    leftArm.position.set(-7.5, 1.9, 3);
    livingGroup.add(leftArm);
    
    const rightArm = new THREE.Mesh(armGeometry, armMaterial);
    rightArm.position.set(-4.5, 1.9, 3);
    livingGroup.add(rightArm);
    
    // Coffee table
    const coffeeTableGeometry = new THREE.BoxGeometry(2, 0.1, 1);
    const coffeeTableMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const coffeeTable = new THREE.Mesh(coffeeTableGeometry, coffeeTableMaterial);
    coffeeTable.position.set(-6, 1.5, 1);
    livingGroup.add(coffeeTable);
    
    // Coffee table legs
    const coffeeTableLegGeometry = new THREE.CylinderGeometry(0.05, 0.05, 1.4, 8);
    const coffeeTableLegPositions = [
        [-6.8, 0.7, 0.4],
        [-6.8, 0.7, 1.6],
        [-5.2, 0.7, 0.4],
        [-5.2, 0.7, 1.6]
    ];
    coffeeTableLegPositions.forEach(pos => {
        const leg = new THREE.Mesh(coffeeTableLegGeometry, coffeeTableMaterial);
        leg.position.set(...pos);
        livingGroup.add(leg);
    });
    
    // TV
    const tvStandGeometry = new THREE.BoxGeometry(2.5, 0.8, 0.6);
    const tvStandMaterial = new THREE.MeshStandardMaterial({ color: 0x333333 });
    const tvStand = new THREE.Mesh(tvStandGeometry, tvStandMaterial);
    tvStand.position.set(-6, 1.5, 6);
    livingGroup.add(tvStand);
    
    const tvScreenGeometry = new THREE.BoxGeometry(2, 1.2, 0.1);
    const tvScreenMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000,
        emissive: 0x333333,
        emissiveIntensity: 0.5
    });
    const tvScreen = new THREE.Mesh(tvScreenGeometry, tvScreenMaterial);
    tvScreen.position.set(-6, 2.8, 6);
    livingGroup.add(tvScreen);
    
    // Bookshelf
    const bookshelfGeometry = new THREE.BoxGeometry(1.5, 3, 0.5);
    const bookshelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const bookshelf = new THREE.Mesh(bookshelfGeometry, bookshelfMaterial);
    bookshelf.position.set(-9, 2.5, 5);
    livingGroup.add(bookshelf);
    
    // Books on shelf
    const bookColors = [0xff0000, 0x0000ff, 0x00ff00, 0xffff00, 0xff00ff];
    for (let i = 0; i < 5; i++) {
        const bookGeometry = new THREE.BoxGeometry(0.15, 0.4, 0.3);
        const bookMaterial = new THREE.MeshStandardMaterial({ color: bookColors[i] });
        const book = new THREE.Mesh(bookGeometry, bookMaterial);
        book.position.set(-9 + (i - 2) * 0.2, 3, 5);
        livingGroup.add(book);
    }
    
    // Decorative plant
    const plantPotGeometry = new THREE.CylinderGeometry(0.2, 0.15, 0.3, 8);
    const plantPotMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const plantPot = new THREE.Mesh(plantPotGeometry, plantPotMaterial);
    plantPot.position.set(-4, 1.7, 1);
    livingGroup.add(plantPot);
    
    const plantGeometry = new THREE.SphereGeometry(0.3, 8, 8);
    const plantMaterial = new THREE.MeshStandardMaterial({ color: 0x228b22 });
    const plant = new THREE.Mesh(plantGeometry, plantMaterial);
    plant.position.set(-4, 2.2, 1);
    livingGroup.add(plant);
    
    house.add(livingGroup);
    rooms.living = livingGroup;
}

// Storage area
function createStorage() {
    const storageGroup = new THREE.Group();
    storageGroup.name = 'storage';
    
    // Storage shelves
    for (let i = 0; i < 3; i++) {
        const shelfGeometry = new THREE.BoxGeometry(2, 0.1, 1);
        const shelfMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
        const shelf = new THREE.Mesh(shelfGeometry, shelfMaterial);
        shelf.position.set(7, 2 + i * 1.2, 1);
        storageGroup.add(shelf);
    }
    
    // Storage boxes
    const boxColors = [0xff6347, 0x4169e1, 0x32cd32];
    for (let i = 0; i < 3; i++) {
        const boxGeometry = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        const boxMaterial = new THREE.MeshStandardMaterial({ color: boxColors[i] });
        const box = new THREE.Mesh(boxGeometry, boxMaterial);
        box.position.set(7, 2.5 + i * 1.2, 1);
        storageGroup.add(box);
    }
    
    house.add(storageGroup);
    rooms.storage = storageGroup;
}

// Utilities (electrical panel, water heater, etc.)
function createUtilities() {
    const utilitiesGroup = new THREE.Group();
    utilitiesGroup.name = 'utilities';
    
    // Electrical panel
    const panelGeometry = new THREE.BoxGeometry(0.6, 1, 0.2);
    const panelMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x808080,
        metalness: 0.6,
        roughness: 0.4
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(9.5, 3, 6);
    utilitiesGroup.add(panel);
    
    // Water heater
    const heaterGeometry = new THREE.CylinderGeometry(0.4, 0.4, 1.5, 16);
    const heaterMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xc0c0c0,
        metalness: 0.8,
        roughness: 0.2
    });
    const heater = new THREE.Mesh(heaterGeometry, heaterMaterial);
    heater.position.set(9, 3, 4);
    utilitiesGroup.add(heater);
    
    // Pipes
    const pipeGeometry = new THREE.CylinderGeometry(0.05, 0.05, 3, 8);
    const pipeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xc0c0c0,
        metalness: 0.9,
        roughness: 0.1
    });
    const pipe1 = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe1.position.set(9.3, 2.5, 4);
    utilitiesGroup.add(pipe1);
    
    const pipe2 = new THREE.Mesh(pipeGeometry, pipeMaterial);
    pipe2.rotation.z = Math.PI / 2;
    pipe2.position.set(8, 4, 4);
    utilitiesGroup.add(pipe2);
    
    // AC unit
    const acGeometry = new THREE.BoxGeometry(1.5, 0.8, 0.4);
    const acMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        metalness: 0.5,
        roughness: 0.3
    });
    const ac = new THREE.Mesh(acGeometry, acMaterial);
    ac.position.set(6, 7, -6.8);
    utilitiesGroup.add(ac);
    
    house.add(utilitiesGroup);
    rooms.utilities = utilitiesGroup;
}

// Setup manual orbit controls
function setupControls() {
    let isDragging = false;
    let previousMousePosition = { x: 0, y: 0 };
    let isPanning = false;
    
    renderer.domElement.addEventListener('mousedown', (e) => {
        if (e.button === 0) { // Left click
            isDragging = true;
            isPanning = false;
        } else if (e.button === 2) { // Right click
            isPanning = true;
            isDragging = false;
        }
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    renderer.domElement.addEventListener('mousemove', (e) => {
        if (isDragging) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            const rotationSpeed = 0.005;
            
            // Rotate camera around the house
            const radius = Math.sqrt(
                camera.position.x * camera.position.x +
                camera.position.z * camera.position.z
            );
            
            const currentAngle = Math.atan2(camera.position.z, camera.position.x);
            const newAngle = currentAngle - deltaX * rotationSpeed;
            
            camera.position.x = radius * Math.cos(newAngle);
            camera.position.z = radius * Math.sin(newAngle);
            
            camera.position.y += deltaY * rotationSpeed * 10;
            camera.position.y = Math.max(5, Math.min(40, camera.position.y));
            
            camera.lookAt(0, 5, 0);
        } else if (isPanning) {
            const deltaX = e.clientX - previousMousePosition.x;
            const deltaY = e.clientY - previousMousePosition.y;
            
            const panSpeed = 0.05;
            
            const right = new THREE.Vector3();
            const up = new THREE.Vector3(0, 1, 0);
            camera.getWorldDirection(right);
            right.cross(up).normalize();
            
            camera.position.x -= right.x * deltaX * panSpeed;
            camera.position.z -= right.z * deltaX * panSpeed;
            camera.position.y += deltaY * panSpeed;
        }
        
        previousMousePosition = { x: e.clientX, y: e.clientY };
    });
    
    renderer.domElement.addEventListener('mouseup', () => {
        isDragging = false;
        isPanning = false;
    });
    
    renderer.domElement.addEventListener('wheel', (e) => {
        e.preventDefault();
        const zoomSpeed = 0.1;
        const delta = e.deltaY * zoomSpeed;
        
        const direction = new THREE.Vector3();
        camera.getWorldDirection(direction);
        
        camera.position.x += direction.x * delta;
        camera.position.y += direction.y * delta;
        camera.position.z += direction.z * delta;
        
        const minDistance = 10;
        const maxDistance = 60;
        const distance = Math.sqrt(
            camera.position.x * camera.position.x +
            camera.position.y * camera.position.y +
            camera.position.z * camera.position.z
        );
        
        if (distance < minDistance || distance > maxDistance) {
            camera.position.x -= direction.x * delta;
            camera.position.y -= direction.y * delta;
            camera.position.z -= direction.z * delta;
        }
    });
    
    // Prevent context menu on right click
    renderer.domElement.addEventListener('contextmenu', (e) => {
        e.preventDefault();
    });
}

// Event listeners for UI controls
function setupEventListeners() {
    document.getElementById('btn-exterior').addEventListener('click', () => {
        setViewMode('exterior');
        updateActiveButton('btn-exterior');
    });
    
    document.getElementById('btn-interior').addEventListener('click', () => {
        setViewMode('interior');
        updateActiveButton('btn-interior');
    });
    
    document.getElementById('btn-cutaway').addEventListener('click', () => {
        setViewMode('cutaway');
        updateActiveButton('btn-cutaway');
    });
    
    document.getElementById('btn-wireframe').addEventListener('click', () => {
        setViewMode('wireframe');
        updateActiveButton('btn-wireframe');
    });
    
    document.getElementById('btn-kitchen').addEventListener('click', () => {
        focusOnRoom('kitchen', -7, 5, -3);
    });
    
    document.getElementById('btn-bedroom').addEventListener('click', () => {
        focusOnRoom('bedroom', 6, 5, -4);
    });
    
    document.getElementById('btn-bathroom').addEventListener('click', () => {
        focusOnRoom('bathroom', 7, 5, 5);
    });
    
    document.getElementById('btn-living').addEventListener('click', () => {
        focusOnRoom('living', -6, 5, 3);
    });
    
    document.getElementById('btn-reset').addEventListener('click', () => {
        resetView();
    });
    
    window.addEventListener('resize', onWindowResize);
}

// Update active button styling
function updateActiveButton(buttonId) {
    const buttons = document.querySelectorAll('.control-group button');
    buttons.forEach(btn => {
        if (btn.id === buttonId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// Set view mode
function setViewMode(mode) {
    viewMode = mode;
    
    house.traverse((child) => {
        if (child instanceof THREE.Mesh) {
            const material = child.material;
            
            switch (mode) {
                case 'exterior':
                    material.wireframe = false;
                    material.opacity = 1;
                    material.transparent = false;
                    // Hide interior items
                    if (child.parent && (
                        child.parent.name === 'kitchen' ||
                        child.parent.name === 'bedroom' ||
                        child.parent.name === 'bathroom' ||
                        child.parent.name === 'living' ||
                        child.parent.name === 'storage' ||
                        child.parent.name === 'utilities'
                    )) {
                        child.visible = false;
                    } else {
                        child.visible = true;
                    }
                    break;
                    
                case 'interior':
                    material.wireframe = false;
                    material.opacity = 1;
                    material.transparent = false;
                    // Show all
                    child.visible = true;
                    break;
                    
                case 'cutaway':
                    material.wireframe = false;
                    // Make walls semi-transparent
                    if (child.geometry instanceof THREE.BoxGeometry &&
                        child.position.y > 3 && child.position.y < 7) {
                        material.transparent = true;
                        material.opacity = 0.3;
                    } else {
                        material.transparent = false;
                        material.opacity = 1;
                    }
                    child.visible = true;
                    break;
                    
                case 'wireframe':
                    material.wireframe = true;
                    material.opacity = 1;
                    material.transparent = false;
                    child.visible = true;
                    break;
            }
        }
    });
}

// Focus on specific room
function focusOnRoom(roomName, x, y, z) {
    const targetPosition = new THREE.Vector3(x, y, z);
    const offset = new THREE.Vector3(10, 8, 10);
    
    animateCameraTo(
        targetPosition.x + offset.x,
        targetPosition.y + offset.y,
        targetPosition.z + offset.z,
        targetPosition
    );
}

// Animate camera to position
function animateCameraTo(x, y, z, lookAt) {
    const startPosition = camera.position.clone();
    const endPosition = new THREE.Vector3(x, y, z);
    const duration = 1000; // ms
    const startTime = Date.now();
    
    function updateCamera() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const easeProgress = progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;
        
        camera.position.lerpVectors(startPosition, endPosition, easeProgress);
        
        if (lookAt) {
            camera.lookAt(lookAt);
        }
        
        if (progress < 1) {
            requestAnimationFrame(updateCamera);
        }
    }
    
    updateCamera();
}

// Reset to default view
function resetView() {
    animateCameraTo(30, 25, 30, new THREE.Vector3(0, 5, 0));
    setViewMode('cutaway');
    updateActiveButton('btn-cutaway');
}

// Handle window resize
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Animation loop
function animate() {
    animationId = requestAnimationFrame(animate);
    renderer.render(scene, camera);
}

// Start the application
window.addEventListener('load', init);
