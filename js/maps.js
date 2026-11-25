export const cityRuins = {
  id: 'city-ruins',
  name: 'CITY RUINS',
  subtitle: 'THE LAST BLOCK',
  description: 'A fractured downtown where rooftops, broken streets and buried transit tunnels turn every sightline into a fight.',
  weather: 'Light rain · gusting west',
  time: 'Blue-hour dusk',
  difficulty: 'STANDARD',
  players: '2–8 FIGHTERS',
  width: 3600,
  height: 1100,
  spawn: { x: 120, y: 680 },
  platforms: [
    { x: 0, y: 890, w: 3600, h: 210, kind: 'ground' },
    { x: 170, y: 720, w: 280, h: 28, kind: 'roof' },
    { x: 525, y: 610, w: 220, h: 26, kind: 'roof' },
    { x: 810, y: 755, w: 310, h: 28, kind: 'bridge' },
    { x: 1220, y: 650, w: 240, h: 26, kind: 'roof' },
    { x: 1510, y: 530, w: 300, h: 26, kind: 'roof' },
    { x: 1870, y: 735, w: 250, h: 28, kind: 'bridge' },
    { x: 2190, y: 605, w: 285, h: 26, kind: 'roof' },
    { x: 2540, y: 475, w: 250, h: 26, kind: 'roof' },
    { x: 2870, y: 710, w: 330, h: 28, kind: 'roof' },
    { x: 3280, y: 585, w: 210, h: 26, kind: 'roof' },
    { x: 1090, y: 840, w: 210, h: 22, kind: 'tunnel' },
    { x: 2080, y: 840, w: 250, h: 22, kind: 'tunnel' },
    { x: 2630, y: 840, w: 200, h: 22, kind: 'tunnel' }
  ],
  buildings: [
    { x: 55, w: 430, h: 590, seed: 3, label: 'HOTEL' },
    { x: 480, w: 370, h: 465, seed: 8, label: 'BLOCK 09' },
    { x: 900, w: 470, h: 555, seed: 13, label: 'METRO' },
    { x: 1390, w: 520, h: 680, seed: 5, label: 'TOWER' },
    { x: 1940, w: 430, h: 500, seed: 17, label: 'PARKING' },
    { x: 2410, w: 500, h: 730, seed: 22, label: 'NOVA' },
    { x: 2960, w: 480, h: 540, seed: 11, label: 'DISTRICT' },
    { x: 3440, w: 250, h: 620, seed: 19, label: 'EAST' }
  ],
  cover: [
    { x: 440, y: 828, w: 82, h: 62, kind: 'car' }, { x: 880, y: 832, w: 92, h: 58, kind: 'rubble' },
    { x: 1340, y: 820, w: 76, h: 70, kind: 'crate' }, { x: 1805, y: 833, w: 115, h: 57, kind: 'car' },
    { x: 2320, y: 824, w: 95, h: 66, kind: 'rubble' }, { x: 2780, y: 827, w: 82, h: 63, kind: 'crate' },
    { x: 3200, y: 830, w: 110, h: 60, kind: 'car' }
  ],
  pickups: [
    { x: 355, y: 680, kind: 'health' }, { x: 675, y: 570, kind: 'ammo' },
    { x: 1040, y: 715, kind: 'jetpack' }, { x: 1350, y: 610, kind: 'health' },
    { x: 1655, y: 490, kind: 'ammo' }, { x: 1985, y: 695, kind: 'jetpack' },
    { x: 2340, y: 565, kind: 'health' }, { x: 2650, y: 435, kind: 'ammo' },
    { x: 3040, y: 670, kind: 'jetpack' }, { x: 3360, y: 545, kind: 'health' }
  ],
  passages: [{ x: 1050, w: 270 }, { x: 2030, w: 310 }, { x: 2580, w: 260 }]
};
