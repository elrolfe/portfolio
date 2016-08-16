const ENTRY_POINT = -1;
const EXIT_POINT = -2;
const UNUSED = -512;
const WALL = 1;
const TORCH = 2;
const BANNER = 3;
const STATUE = 4;
const FOUNTAIN = 5;

const ITEM_RATIO = 0.00625;
const WEAPON_CHANCE = 0.05;
const ARMOR_CHANCE = 0.1;
const ENEMY_CHANCE = 0.65;

const topLeftRooms = [
	[
		[1, 1, 1, 2, 1, 1, 2, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 0, 1, 1, 1, 3, 1, 1, 1, 0],
		[1, 0, 1, 4, 0,-2, 0, 4, 1, 0],
		[1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
		[1, 0, 1, 0, 0, 5, 0, 0, 1, 0],
		[1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
		[1, 0, 1, 0, 0,-1, 0, 0, 1, 0],
		[1, 0, 1, 1, 1, 0, 1, 1, 1, 0],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
		[1, 0, 0, 0, 0,-2, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 1, 1, 1, 0, 1, 1, 1, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0,-1, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 1, 1, 1, 0, 1, 1, 1, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],    
	[
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
		[1, 0, 0, 0, 1, 0, 0, 0, 0, 0], 
		[1, 0,-3, 0, 1, 0, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 1, 1, 1, 1, 0, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 0], 
		[1, 0, 0, 0, 0, 0, 1, 1, 1, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1,-2, 1, 0, 0, 1,-1, 1, 0, 0], 
		[1, 0, 1, 0, 0, 1, 0, 1, 0, 0], 
		[1, 0, 1, 0, 0, 1, 0, 1, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 1, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 1, 0, 0], 
		[1, 0, 1, 0, 0, 1, 0, 1, 0, 0], 
		[1,-1, 1, 0, 0, 1,-2, 1, 0, 0], 
		[1, 1, 1, 0, 0, 1, 1, 1, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 0, 0, 1, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 0, 1, 0, 0],
		[1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
		[1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0,-3, 1, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 1, 0], 
		[1, 0, 1, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 1, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	]
];

const topCenterRooms = [
	[
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 1, 1, 0, 0, 0, 1, 1, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 5, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[1, 0, 1, 1, 0, 0, 0, 1, 1, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
		[0, 1, 0, 0, 0, 0, 0, 0, 1, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 1, 0, 0, 1, 0, 0, 0], 
		[0, 0, 0, 0, 1, 1, 0, 0, 0, 0], 
		[0, 0, 0, 0, 1, 1, 0, 0, 0, 0], 
		[0, 0, 0, 1, 0, 0, 1, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 1, 0, 0, 0, 0, 0, 0, 1, 0], 
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1]
	],
	[
		[1, 1, 1, 1, 3, 3, 1, 1, 1, 1], 
		[0, 0, 1, 0, 0, 0, 0, 1, 0, 0], 
		[0, 0, 2, 0, 0, 0, 0, 2, 0, 0], 
		[0, 0, 1, 0, 0, 0, 0, 1, 0, 0], 
		[0, 0, 1, 0, 0, 0, 0, 1, 0, 0], 
		[0, 0, 2, 0, 0, 0, 0, 2, 0, 0], 
		[0, 0, 1, 0, 0, 0, 0, 1, 0, 0], 
		[0, 0, 1, 1, 0, 0, 1, 1, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
	[
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0], 
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	]
];

const topRightRooms = [
	[
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 1, 0,-1, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 1, 1, 1, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 1,-2, 0, 1, 0, 0, 1],
		[1, 0, 0, 1, 0, 0, 1, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1]
	],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0,-3, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 1, 1, 1, 0, 0, 0, 1],
        [0, 0, 0, 1, 5, 1, 0, 0, 0, 1],
        [0, 0, 0, 1, 0, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 1, 0, 0, 1, 0, 0,-3, 1],
        [0, 0, 1, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 0, 0, 1, 1, 1],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 1, 1, 1, 1, 1, 0, 1],
        [0, 1, 0, 1, 0, 0, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1,-3, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 1, 1, 0, 1, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    ]
];

const middleLeftRooms = [
    [
        [1, 0, 0, 2, 0, 0, 0, 2, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [1, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 1, 1, 1, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [1, 0, 2, 2, 0, 0, 2, 2, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 2, 2, 0, 0, 2, 2, 0, 0],
        [1, 0, 1, 1, 0, 0, 1, 1, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [1, 1, 2, 0, 1, 1, 0, 2, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 5, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    ]
];

const middleCenterRooms = [
	[
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
		[0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
		[0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 1, 0, 1, 0, 0, 1, 0, 1, 0],
		[0, 1, 0, 0, 0, 0, 0, 0, 1, 0],
		[0, 1, 1, 1, 0, 0, 1, 1, 1, 0],
		[0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	],
    [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 4, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 4, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 5, 1, 0, 0, 1, 5, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 1, 0, 0],
        [0, 0, 5, 1, 0, 0, 1, 5, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 1, 1, 1, 1, 3, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 4, 3, 0],
        [0, 0, 0, 2, 0, 0,-3, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0,-3, 0, 0, 2, 0, 0, 0],
        [0, 3, 4, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 3, 1, 1, 1, 1, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 3, 1, 1, 1, 1, 1, 1, 0],
        [0, 3, 5, 0, 0, 0, 0, 1, 0, 0],
        [0, 1, 0,-3, 0, 0, 2, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 2, 0, 0, 0, 0, 0, 0],
        [0, 1, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 2, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 2, 0, 0,-3, 0, 1, 0],
        [0, 0, 1, 0, 0, 0, 0, 5, 3, 0],
        [0, 1, 1, 1, 1, 1, 1, 3, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ]
];

const middleRightRooms = [
	[
		[1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 1]
	],
    [
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 1, 1, 1, 1, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 1, 0, 1, 0, 1],
        [1, 1, 1, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 2, 0, 1],
        [0, 0, 0, 0, 0, 0, 2, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 2, 0, 0, 0, 0, 1],
        [0, 0, 0, 2, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 2, 0, 0, 0, 0, 0, 0, 0, 1],
        [2, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [0, 0, 0, 0, 0, 1, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 1],
        [0, 0, 0, 1, 0, 0, 0, 0, 1, 1],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 1]
    ]
];

const bottomLeftRooms = [
	[
		[1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1,-1, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1,-2, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	],
    [
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 1, 0, 1, 0, 1, 0, 0, 0],
        [1, 0, 1, 0, 1, 0, 1, 1, 1, 0],
        [1, 0, 1, 0, 1, 0, 0, 0, 0, 0],
        [1, 0, 1, 0, 1, 1, 1, 1, 1, 0],
        [1, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
        [1,-3, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 0, 1, 1, 3, 1, 1, 1, 1, 0],
        [1, 0, 1, 4, 0, 0, 0,-3, 1, 0],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [1, 0, 1, 0, 0, 0, 0, 0, 3, 0],
        [1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 4, 1, 0],
        [1, 0,-5, 0, 1, 1, 1, 1, 1, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 0, 1, 1, 1, 1, 1, 1, 1, 0],
        [1, 0, 2, 0, 1, 0, 0, 0, 1, 0],
        [1, 0, 0, 0, 1, 0, 2, 0, 1, 0],
        [1, 1, 2, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 0, 0, 1, 0, 1, 0, 1, 0],
        [1, 0, 2, 1, 2, 0, 1, 0, 1, 0],
        [1, 0, 0, 0, 0, 0, 1, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 2, 0, 1, 0],
        [1,-3, 0, 0, 0, 0, 0, 0, 1, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

const bottomCenterRooms = [
	[
		[1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[0, 0, 1, 1, 1, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 1, 0, 0, 0, 0, 0],
		[1, 0, 0, 0, 1, 1, 0, 0, 0, 0],
		[1, 0, 0, 0, 0, 1, 0, 0, 0, 0],
		[0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
		[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 4, 5, 0, 0, 0, 0],
        [0, 0, 0, 0, 5, 4, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 2, 0, 0, 2, 1, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 3, 0, 0, 3, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [2, 0, 0, 3, 0, 0, 3, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 1, 1, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
        [0, 0, 0, 0, 0, 1, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 1, 1, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

const bottomRightRooms = [
	[
		[1, 1, 0, 1, 1, 1, 1, 1, 0, 1],
		[0, 0, 0, 1, 0,-3, 0, 1, 0, 1],
		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[0, 1, 0, 1, 0, 1, 0, 1, 0, 1],
		[0, 1, 0, 0, 0, 1, 0, 0, 0, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	],
    [
        [1, 1, 1, 1, 1, 1, 1, 1, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
        [1, 0, 2, 1, 1, 2, 0, 1, 0, 1],
        [1, 0, 1, 0, 0, 1, 0, 1, 0, 1],
        [1, 0, 1, 0,-1, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 0,-2, 0, 1, 0, 1],
        [1, 0, 1, 0, 1, 0, 0, 1, 0, 1],
        [1, 0, 1, 0, 2, 1, 1, 2, 0, 1],
        [0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [0, 2, 0, 2, 0, 2, 0, 2, 0, 1],
        [2, 2, 0, 1, 0, 1, 0, 1, 0, 1],
        [0, 0,-3, 1, 0, 1, 0, 1, 0, 1],
        [2, 1, 1, 2, 0, 1, 0, 1, 0, 1],
        [0, 0, 0, 0,-3, 1, 0, 1, 0, 1],
        [2, 1, 1, 1, 1, 2, 0, 1, 0, 1],
        [0, 0, 0, 0, 0, 0,-3, 1, 0, 1],
        [2, 1, 1, 1, 1, 1, 1, 2, 0, 1],
        [0, 0, 0, 0, 0, 0, 0, 0,-3, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ],
    [
        [1, 1, 1, 1, 1, 1, 1, 0, 0, 1],
        [1,-3, 0, 0, 0, 1, 0, 0, 1, 1],
        [1, 0, 0, 0, 0, 0, 0, 2, 0, 1],
        [1, 0, 0, 2, 0, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 2, 0, 0, 0, 1],
        [1, 1, 0, 0, 2, 0, 0, 0, 0, 1],
        [1, 0, 0, 0, 0, 0, 0, 0, 0, 1],
        [0, 0, 2, 0, 0, 0, 0, 0, 0, 1],
        [0, 1, 0, 0, 0, 0, 0, 0,-3, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
    ]
];

const armorItems = [
    {
        name: "None",
        protection: 0
    },
    {
        name: "Leather Armor",
        protection: 1
    },
    {
        name: "Banded Mail",
        protection: 2
    },
    {
        name: "Ring Mail",
        protection: 3
    },
    {
        name: "Chain Mail",
        protection: 4
    },
    {
        name: "Plate Mail",
        protection: 5
    }
];

const weaponItems = [
    {
        name: "Fists",
        damageStr: "1d4 + level",
        damageMin: 1,
        damageMax: 4,
        levelMultiplier: 1
    },
    {
        name: "Quarterstaff",
        damageStr: "1d4 + 2 + level",
        damageMin: 3,
        damageMax: 6,
        levelMultiplier: 1
    },
    {
        name: "Club",
        damageStr: "1d6 + level",
        damageMin: 1,
        damageMax: 6,
        levelMultiplier: 1
    },
    {
        name: "Dagger",
        damageStr: "2d4 + level",
        damageMin: 2,
        damageMax: 8,
        levelMultiplier: 1
    },
    {
        name: "Whip",
        damageStr: "1d8 + 1 + level",
        damageMin: 2,
        damageMax: 9,
        levelMultiplier: 1
    },
    {
        name: "Sabre",
        damageStr: "1d10 + level",
        damageMin: 1,
        damageMax: 10,
        levelMultiplier: 1
    },
    {
        name: "Scimitar",
        damageStr: "2d6 + level x 2",
        damageMin: 2,
        damageMax: 12,
        levelMultiplier: 2
    },
    {
        name: "Short Sword",
        damageStr: "1d10 + 4 + level x 2",
        damageMin: 5,
        damageMax: 14,
        levelMultiplier: 2
    },
    {
        name: "Long Sword",
        damageStr: "1d12 + 4 + level x 2",
        damageMin: 5,
        damageMax: 16,
        levelMultiplier: 2
    },
    {
        name: "Battle Axe",
        damageStr: "2d8 + 4 + level x 2",
        damageMin: 6,
        damageMax: 20,
        levelMultiplier: 2
    }
];

const enemies = [
    {
        name: "Rat",
        level: 1,
        healthMin: 5,
        healthMax: 10,
        xp: 10
    },
    {
        name: "Hound",
        level: 1,
        healthMin: 10,
        healthMax: 20,
        xp: 15
    },
    {
        name: "Snake",
        level: 2,
        healthMin: 15,
        healthMax: 30,
        xp: 20
    },
    {
        name: "Giant Ant",
        level: 2,
        healthMin: 20,
        healthMax: 40,
        xp: 25
    },
    {
        name: "Spider",
        level: 3,
        healthMin: 25,
        healthMax: 50,
        xp: 30
    },
    {
        name: "Scorpion",
        level: 3,
        healthMin: 30,
        healthMax: 60,
        xp: 35
    },
    {
        name: "Killer Bee",
        level: 4,
        healthMin: 35,
        healthMax: 70,
        xp: 40
    },
    {
        name: "Hobgoblin",
        level: 4,
        healthMin: 40,
        healthMax: 80,
        xp: 45
    },
    {
        name: "Kobold",
        level: 5,
        healthMin: 45,
        healthMax: 90,
        xp: 50
    },
    {
        name: "Troll",
        level: 5,
        healthMin: 50,
        healthMax: 100,
        xp: 55
    }
];

var torchIndex = 0;
var fountainIndex = 0;

$(document).ready(function () {
    setInterval(animate15fps, 67);
});

function animate15fps() {
    // Update Torches
    var newTorch = (torchIndex + 1) % 4;
    $(".torch-" + torchIndex).addClass("torch-" + newTorch).removeClass("torch-" + torchIndex);
    torchIndex = newTorch;

    // Update Fountains
    var newFountain = (fountainIndex + 1) % 2;
    $(".fountain-" + fountainIndex).addClass("fountain-" + newFountain).removeClass("fountain-" + fountainIndex);
    fountainIndex = newFountain;
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var DungeonCrawler = React.createClass({
    getInitialState: function() {
        var levelMaps = this.generateLevels();
        var items = this.generateItems(levelMaps);
        
        return {
            currentLevel: 0,
            levelMaps: levelMaps,
            rowOffset: levelMaps[0].entry[0] - 5,
            colOffset: levelMaps[0].entry[1] - 9,
            items: items,
            player: {
                hp: 50,
                xp: 0,
                weapon: 0,
                armor: 0,
                level: 1
            },
            enemy: -1,
            log: "Welcome to Dungeon Crawler!\nFind and defeat the dragon to win!\n",
            gameOver: false
        }
    },
    
    generateItems: function(levelMaps) {
        var allItems = [];
        var weaponRange = (weaponItems.length - 2) - (levelMaps.length - 1);
        var armorRange = (armorItems.length - 2) - (levelMaps.length - 1);
        var enemyRange = (enemies.length - 1) - (levelMaps.length - 1);

        for (var level = 0; level < levelMaps.length; level++) {
            var levelItems = [];
            var size = (levelMaps[level].level.length - 20) * (levelMaps[level].level[0].length - 20);
            var totalItems = Math.floor(size * ITEM_RATIO);
            
            for (var i = 0; i < totalItems; i++) {
                var goodTile = false;
                while (!goodTile) {
                    var row = random(11, levelMaps[level].level.length - 11);
                    var col = random(11, levelMaps[level].level[0].length - 11);
                    if (levelMaps[level].level[row][col] == 0) { // Floor tile, we can put an item here
                        goodTile = true;
                        for (var j = 0; j < levelItems.length; j++) {
                            if (levelItems[j].tile.row == row && levelItems[j].tile.col == col) {
                                goodTile = false;
                                break;
                            }
                        }
                    }
                }
                
                var choice = Math.random();
                var index;
                var itemType;
                var hp = 0;
                
                if (choice <= WEAPON_CHANCE) {
                    itemType = "weapon";
                    index = random(level + 1, level + 1 + weaponRange);
                } else if (choice <= ARMOR_CHANCE) {
                    itemType = "armor";
                    index = random(level + 1, level + 1 + armorRange);
                } else if (choice <= ENEMY_CHANCE) {
                    itemType = "enemy";
                    index = random(level, level + enemyRange);
                    hp = random(enemies[index].healthMin, enemies[index].healthMax);
                } else {
                    itemType = "food"
                    index = random(0, 4);
                    hp = 25;
                }

                levelItems.push({
                    tile: {
                        row: row,
                        col: col
                    },
                    type: itemType,
                    index: index,
                    hp: hp
                });
            }
            
            if (level == levelMaps.length - 1) {
                var bossRow = levelMaps[level].exit[0];
                var bossCol = levelMaps[level].exit[1];
                levelMaps[level].level[bossRow][bossCol] = 0;
                levelItems.push({
                    tile: {
                        row: bossRow,
                        col: bossCol
                    },
                    type: "boss",
                    index: 0,
                    hp: 250
                });
            }
            allItems.push(levelItems);
        }

        return allItems;
    },
    
    generateLevels: function() {
        var levelMaps = [];
        
        for (var levelNum = 0; levelNum < this.props.totalLevels; levelNum++) {
            var centerSections = random(3, 6);
            var middleSections = random(3, 6);
            
            var newLevel = [];
            
            for (var index = 0; index < 10; index++)
                newLevel.push(Array(40 + (centerSections * 10)).fill(-5120));

            newLevel = newLevel.concat(this.generateLevelRow(topLeftRooms, topCenterRooms, topRightRooms, centerSections));
            
            for (var index = 0; index < middleSections; index++)
                newLevel = newLevel.concat(this.generateLevelRow(middleLeftRooms, middleCenterRooms, middleRightRooms, centerSections));
            
            newLevel = newLevel.concat(this.generateLevelRow(bottomLeftRooms, bottomCenterRooms, bottomRightRooms, centerSections));
            
            for (var index = 0; index < 10; index++)
                newLevel.push(Array(40 + (centerSections * 10)).fill(-5120));
            
            var points = this.getEntryAndExitPoints(newLevel);
            levelMaps.push({
                level: newLevel,
                entry: points.entry,
                exit: points.exit
            });
        }
        
        return levelMaps;
    },
        
    generateLevelRow: function(left, center, right, centerSections) {
        var levelRow = [];
        
        var leftIndex = random(0, left.length - 1);
        var rightIndex = random(0, right.length - 1);
        var centerIndices = [];
        
        for (var i = 0; i < centerSections; i++)
            centerIndices.push(random(0, center.length - 1));
        
        for (i = 0; i < 10; i++) {
            var newRow = Array(10).fill(-5120).concat(left[leftIndex][i].map(this.mapLevelTile));
            for (var x = 0; x < centerSections; x++)
                newRow = newRow.concat(center[centerIndices[x]][i].map(this.mapLevelTile));
            newRow = newRow.concat(right[rightIndex][i].map(this.mapLevelTile).concat(Array(10).fill(-5120)));
            levelRow.push(newRow);    
        }
        
        return levelRow;
    },
    
    getEntryAndExitPoints: function(level) {
        var entryPoints = [];
        var exitPoints = [];
        
        for (var row = 10; row < level.length - 10; row++) {
            for (var col = 10; col < level[row].length - 10; col++) {
                if (level[row][col] < 0) {
                    var value = parseInt(level[row][col] / -10);
                    if (value & ENTRY_POINT)
                        entryPoints.push([row, col]);
                    if (value & EXIT_POINT)
                        exitPoints.push([row, col]);
                    level[row][col] = random(0, 9);
                }
            }
        }
        
        var goodPoints = false;
        var entryIndex = 0;
        var exitIndex = 0;
        var counter = 0;
        while (!goodPoints && counter < 30) {
            entryIndex = random(0, entryPoints.length - 1);
            exitIndex = random(0, exitPoints.length - 1);
            var distance = Math.sqrt(Math.pow(entryPoints[entryIndex][0] - exitPoints[exitIndex][0], 2) + Math.pow(entryPoints[entryIndex][1] - exitPoints[exitIndex][1], 2));
            goodPoints = distance > 20;
            counter++;
        }
        
        level[entryPoints[entryIndex][0]][entryPoints[entryIndex][1]] = -10;
        level[exitPoints[exitIndex][0]][exitPoints[exitIndex][1]] = -20;
        
        return {
            entry: entryPoints[entryIndex],
            exit: exitPoints[exitIndex]
        };
    },
    
    getPlayerLevel: function(xp) {
        const playerLevelXPNeeded = [0, 50, 100, 200, 400, 800, 1600, 3200, 6400, 12800];
        for (var i = 0; i < playerLevelXPNeeded.length; i++) {
            if (playerLevelXPNeeded[i] > xp)
                break;
        }
        
        return i;  
    },
    
    mapLevelTile: function(tile) {
        var newTile = tile * 10;
        switch (tile) {
            case 0: // Floor Tile
                newTile += random(0, 9);
                break;
                
            case 1: // Wall Tile
            case 2: // Torch Tile
            case 3: // Banner Tile
                newTile += random(0, 3);
                break;
                
            case 4: // Statue Tile
            case 5: // Fountain Tile
            default:
                break;
        }
        
        return newTile;
    },
    
    componentDidMount: function() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this), true);
    },
    
    componentWillUnmount: function() {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this), true);    
    },
    
    handleKeyDown: function(e) {
        if (this.state.gameOver)
            return;
        
        var mapLevel = this.state.levelMaps[this.state.currentLevel].level;
        var rowOffset = this.state.rowOffset;
        var colOffset = this.state.colOffset;
        
        switch (e.key) {
            case "ArrowDown":
                if (mapLevel[rowOffset + 6][colOffset + 9] < 10)
                    rowOffset += 1;
                break;
                
            case "ArrowUp":
                if (mapLevel[rowOffset + 4][colOffset + 9] < 10)
                    rowOffset -= 1;
                break;
                
            case "ArrowLeft":
                if (mapLevel[rowOffset + 5][colOffset + 8] < 10)
                    colOffset -= 1;
                break;
                
            case "ArrowRight":
                if (mapLevel[rowOffset + 5][colOffset + 10] < 10)
                    colOffset += 1;
                break;
                
            default:
                return;
        }
        
        e.preventDefault();
        
        // Did we hit a level exit?
        if ((mapLevel[rowOffset + 5][colOffset + 9] == ENTRY_POINT * 10 && this.state.currentLevel > 0) ||
            (mapLevel[rowOffset + 5][colOffset + 9] == EXIT_POINT * 10) && this.state.currentLevel < this.props.totalLevels - 2) {
            var newLevel;
            var log = this.state.log;
            
            // Go to a lower numbered level at entry point, higher on exit
            if (mapLevel[rowOffset + 5][colOffset + 9] == ENTRY_POINT * 10) {
                newLevel = this.state.currentLevel - 1;
                rowOffset = this.state.levelMaps[newLevel].exit[0] - 5;
                colOffset = this.state.levelMaps[newLevel].exit[1] - 9;
            } else {
                newLevel = this.state.currentLevel + 1;
                rowOffset = this.state.levelMaps[newLevel].entry[0] - 5;
                colOffset = this.state.levelMaps[newLevel].entry[1] - 9;
            }
            log = "You have entered floor " + (newLevel + 1) + "\n\n" + log;
            
            this.setState({
                currentLevel: newLevel,
                rowOffset: rowOffset,
                colOffset: colOffset,
                enemy: -1,
                log: log
            });
            return;
        } else {
            // Did we hit an item?
            var items = this.state.items[this.state.currentLevel];
            for (var i = 0; i < items.length; i++) {
                if (items[i].tile.row == rowOffset + 5 && items[i].tile.col == colOffset + 9) {
                    // Did we hit food?
                    if (items[i].type == "food") {
                        var player = this.state.player;
                        player.hp += items[i].hp;
                        var log = this.state.log;
                        log = "You ate some food and gained " + items[i].hp + " hp\n\n" + log;
                        items = items.slice(0, i).concat(items.slice(i + 1));
                        var allItems = this.state.items;
                        allItems[this.state.currentLevel] = items;
                        this.setState({
                            rowOffset: rowOffset,
                            colOffset: colOffset,
                            items: allItems,
                            player: player,
                            enemy: -1,
                            log: log
                        });
                        return;
                    } else if (items[i].type == "armor") {
                        var player = this.state.player;
                        var oldArmor = player.armor;
                        var log = this.state.log;
                        var newLog = "You found " + armorItems[items[i].index].name;
                        if (player.armor < items[i].index) {
                            newLog += ", which is better";
                            player.armor = items[i].index;
                        } else {
                            newLog += ", which is the same or worse";
                        }
                        newLog += " than your current armor (" + armorItems[oldArmor].name + ")\n\n";
                        log = newLog + log;
                        
                        items = items.slice(0, i).concat(items.slice(i + 1));
                        var allItems = this.state.items;
                        allItems[this.state.currentLevel] = items;
                        this.setState({
                            rowOffset: rowOffset,
                            colOffset: colOffset,
                            items: allItems,
                            player: player,
                            enemy: -1,
                            log: log
                        });
                        return;
                    } else if (items[i].type == "weapon") {
                        var player = this.state.player;
                        var oldWeapon = player.weapon;
                        var log = this.state.log;
                        var newLog = "You found a " + weaponItems[items[i].index].name;
                        if (player.weapon < items[i].index) {
                            newLog += ", which is better";
                            player.weapon = items[i].index;
                        } else {
                            newLog += ", which is the same or worse";
                        }
                        newLog += " than your current weapon (" + weaponItems[oldWeapon].name + ")\n\n";
                        log = newLog + log;
                        
                        items = items.slice(0, i).concat(items.slice(i + 1));
                        var allItems = this.state.items;
                        allItems[this.state.currentLevel] = items;
                        this.setState({
                            rowOffset: rowOffset,
                            colOffset: colOffset,
                            items: allItems,
                            player: player,
                            enemy: -1,
                            log: log
                        });
                        return;
                    } else if (items[i].type == "enemy") {
                        var enemy = items[i];
                        var player = this.state.player;
                        var log = this.state.log;
                        var gameOver = this.state.gameOver;
                        var newLog = "";
                        
                        if (this.state.enemy == -1) {
                            newLog += "You are fighting a " + enemies[enemy.index].name + " worth " + enemies[enemy.index].xp + " xp\n";
                        }
                        
                        var damage = random(0, enemies[enemy.index].level) + enemies[enemy.index].level - armorItems[player.armor].protection;
                        if (damage < 0)
                            damage = 0;
                        player.hp -= damage;
                        newLog += "The " + enemies[enemy.index].name + " attacked, and did " + damage + " points of damage\n";
                        
                        if (player.hp > 0) {
                            damage = random(weaponItems[player.weapon].damageMin, weaponItems[player.weapon].damageMax) + (player.level * weaponItems[player.weapon].levelMultiplier);
                            enemy.hp -= damage;
                            newLog += "You attacked, and did " + damage + " points of damage\n";
                        } else {
                            newLog += "The " + enemies[enemy.index].name + " has defeated you!\n\n";
                            gameOver = true;
                            log = newLog + log;
                        }
                        
                        if (enemy.hp > 0) {
                            items[i] = enemy;
                            rowOffset = this.state.rowOffset;
                            colOffset = this.state.colOffset;
                            log = newLog + "\n" + log;
                        } else {
                            player.xp += enemies[enemy.index].xp;
                            player.level = this.getPlayerLevel(player.xp);
                            items = items.slice(0, i).concat(items.slice(i + 1));
                            newLog += "You have defeated the " + enemies[enemy.index].name + ", and gained " + enemies[enemy.index].xp + " xp!\n\n";
                            log = newLog + log;
                        }
                        var allItems = this.state.items;
                        allItems[this.state.currentLevel] = items;
                        
                        this.setState({
                            rowOffset: rowOffset,
                            colOffset: colOffset,
                            items: allItems,
                            player: player,
                            enemy: enemy.index,
                            log: log,
                            gameOver: gameOver
                        });
                        return;
                    } else if (items[i].type == "boss") {
                        var enemy = items[i];
                        var player = this.state.player;
                        var log = this.state.log;
                        var newLog = "";
                        var gameOver = this.state.gameOver;
                        
                        if (this.state.enemy == -1) {
                            newLog += "You are fighting the dragon!\n";
                        }
                        
                        var damage = random(0, 10) + 10 - armorItems[player.armor].protection;
                        if (damage < 0)
                            damage = 0;
                        player.hp -= damage;
                        newLog += "The dragon attacked, and did " + damage + " points of damage\n";
                        
                        if (player.hp > 0) {
                            damage = random(weaponItems[player.weapon].damageMin, weaponItems[player.weapon].damageMax) + (player.level * weaponItems[player.weapon].levelMultiplier);
                            enemy.hp -= damage;
                            newLog += "You attacked, and did " + damage + " points of damage\n";
                        } else {
                            newLog += "The dragon has defeated you!\n\n";
                            log = newLog + log;
                            gameOver = true;
                        }
                        
                        if (enemy.hp > 0) {
                            items[i] = enemy;
                            rowOffset = this.state.rowOffset;
                            colOffset = this.state.colOffset;
                            log = newLog + "\n" + log;
                        } else {
                            player.xp += enemies[enemy.index].xp;
                            player.level = this.getPlayerLevel(player.xp);
                            items = items.slice(0, i).concat(items.slice(i + 1));
                            newLog += "You have defeated the dragon and won the game!!\n\n";
                            log = newLog + log;
                            gameOver = true;
                        }
                        var allItems = this.state.items;
                        allItems[this.state.currentLevel] = items;
                        
                        this.setState({
                            rowOffset: rowOffset,
                            colOffset: colOffset,
                            items: allItems,
                            player: player,
                            enemy: enemy.index,
                            log: log,
                            gameOver: gameOver
                        });
                        return;
                    }
                }
            }
            
            // Move the player
            this.setState({
                rowOffset: rowOffset,
                colOffset: colOffset,
                enemy: -1
            });
        }
    },
    
    restartGame: function() {
        var levelMaps = this.generateLevels();
        var items = this.generateItems(levelMaps);
        
        this.setState({
            currentLevel: 0,
            levelMaps: levelMaps,
            rowOffset: levelMaps[0].entry[0] - 5,
            colOffset: levelMaps[0].entry[1] - 9,
            items: items,
            player: {
                hp: 50,
                xp: 0,
                weapon: 0,
                armor: 0,
                level: 1
            },
            enemy: -1,
            log: "Welcome to Dungeon Crawler!\nFind and defeat the dragon to win!\n",
            gameOver: false
        });
    },
    
    render: function() {
        return (
            <div className="dungeon-crawler">
                <PlayerStats 
                    player={this.state.player} 
                />
                <GameStats 
                    currentLevel={this.state.currentLevel}
                    player={this.state.player}
                    log={this.state.log}
                    gameOver={this.state.gameOver}
                    restart={this.restartGame}
                />
                <GameGrid
                    currentLevel={this.state.currentLevel}
                    rowOffset={this.state.rowOffset}
                    colOffset={this.state.colOffset}
                    levelMaps={this.state.levelMaps}
                    items={this.state.items[this.state.currentLevel]}
                    player={this.state.player}
                />
            </div>
        );
    } 
});

var PlayerStats = React.createClass({
    render: function() {        
        var armorLabel = armorItems[this.props.player.armor].name + " - " + armorItems[this.props.player.armor].protection + " HP Protection";
        var weaponLabel = weaponItems[this.props.player.weapon].name + " - " + weaponItems[this.props.player.weapon].damageStr;
        
        return(
            <div className="player-stats">
                <p><strong>HP:</strong> {this.props.player.hp}</p>
                <p><strong>XP:</strong> {this.props.player.xp}</p>
                <p><strong>Level:</strong> {this.props.player.level}</p>
                <p><strong>Armor:</strong></p>
                <ul><li>{armorLabel}</li></ul>
                <p><strong>Weapons:</strong></p>
                <ul><li>{weaponLabel}</li></ul>
            </div>
        );
    }
});

var GameStats = React.createClass({
    render: function() {
        var restartButton = [];
        if (this.props.gameOver)
            restartButton.push(
                <button onClick={this.props.restart}>Restart Game</button>
            );

        return(
            <div className="game-stats">
                <h2>Dungeon Crawler</h2>
                <p><strong>Floor:</strong> {this.props.currentLevel + 1} {restartButton}</p>
                <textarea disabled value={this.props.log}></textarea>
            </div>
        );
    } 
});

var GameGrid = React.createClass({
    render: function() {
        var rows = [];
        for (var i = 0; i < 11; i++) {
            var itemsInRow = [];
            for (var j = 0; j < this.props.items.length; j++) {
                if (this.props.items[j].tile.row == i + this.props.rowOffset)
                    itemsInRow.push(this.props.items[j]);
            }
            rows.push(
                <GameRow
                    currentLevel={this.props.currentLevel}
                    row={i}
                    rowOffset={this.props.rowOffset}
                    colOffset={this.props.colOffset}
                    levelMaps={this.props.levelMaps}
                    items={itemsInRow}
                    player={this.props.player}
                />
            );
        }
        
        return(
            <div className="game-grid">
                {rows}
            </div>
        );
    }
});

var GameRow = React.createClass({
    render: function() {
        var cols = [];
        var type, index, decoration;
        
        for (var i = 0; i < 19; i++) {
            var item = "";
            for (var j = 0; j < this.props.items.length; j++) {
                if (this.props.colOffset + i == this.props.items[j].tile.col) {
                    item = "item-" + this.props.items[j].type + "-" + this.props.items[j].index;
                    break;
                }
            }
            
            var tile = this.props.levelMaps[this.props.currentLevel].level[this.props.row + this.props.rowOffset][i + this.props.colOffset];
            switch (parseInt(tile / 10)) {
                case UNUSED: // Unused tile
                    type = "blank";
                    index = 0;
                    decoration = "";
                    break;
                    
                case EXIT_POINT:  // Dungeon exit
                    type = "exit";
                    index = 0;
                    decoration = "";
                    break;
                    
                case ENTRY_POINT:  // Dungeon entry
                    if (this.props.currentLevel == 0) {
                        type = "floor";
                    } else {
                        type = "entry";
                    }
                    index = 0;
                    decoration = "";
                    break;
                    
                case WALL:  // Wall Tile
                    type = "wall";
                    index = tile % 10;
                    decoration = "";
                    break;
                    
                case TORCH:  // Wall Tile with Torch
                    type = "wall";
                    index = tile % 10;
                    decoration = "torch-0";
                    break;
                    
                case BANNER:  // Wall Tile with Banner
                    type = "wall";
                    index = tile % 10;
                    decoration = "banner";
                    break;
                    
                case STATUE:  // Statue
                    type = "statue";
                    index = 0;
                    decoration = "";
                    break;
                    
                case FOUNTAIN:  // Fountain
                    type = "fountain";
                    index = 0;
                    decoration = "";
                    break;
                    
                default:  // Floor tile
                    type = "floor";
                    index = tile % 10;
                    decoration = "";
                    break;
            }
            
            cols.push(
                <GameTile
                    row={this.props.row}
                    col={i}
                    type={type}
                    index={index}
                    decoration={decoration}
                    item={item}
                    player={this.props.player}
                />
            );
        }
        
        return (
            <div className="game-row">
                {cols}
            </div>
        );
    }
});

var GameTile = React.createClass({
    render: function() {
        var item = [];
        var cName = "game-tile " + this.props.type + "-" + this.props.index;
        if (this.props.decoration != "")
            cName += " " + this.props.decoration;
        
        if (this.props.item != "") {
            item.push(
                <div className={this.props.item}></div>
            );
        }
        
        if (this.props.row == 5 && this.props.col == 9) {
            var playerClass = "player";
            if (this.props.player.hp < 1)
                playerClass += " dead";
            
            return (
                <div className={cName}>
                    <div className={playerClass}>
                        <div className={"armor-" + this.props.player.armor}></div>
                        <div className={"weapon-" + this.props.player.weapon}></div>
                    </div>
                </div>
            );
        } else
            return (
                <div className={cName}>
                    {item}
                </div>
            );
    }
});

ReactDOM.render(
    <DungeonCrawler
        totalLevels="5"
    />,
    document.getElementById("reaction")
);