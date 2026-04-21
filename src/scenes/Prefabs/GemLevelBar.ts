
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GemLevelBar extends Phaser.GameObjects.Container {

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? -1);

		// levelBar
		const levelBar = scene.add.image(0, 1, "LevelBar");
		levelBar.scaleX = 0.8870949428367877;
		levelBar.setOrigin(0, 0);
		this.add(levelBar);

		// Level0
		const level0 = scene.add.image(32, 28, "LevelOff");
		this.add(level0);

		// Level1
		const level1 = scene.add.image(67, 28, "LevelOff");
		this.add(level1);

		// Level2
		const level2 = scene.add.image(102, 28, "LevelOff");
		this.add(level2);

		// Level3
		const level3 = scene.add.image(137, 28, "LevelOff");
		this.add(level3);

		// Level4
		const level4 = scene.add.image(172, 28, "LevelOff");
		this.add(level4);

		// Level5
		const level5 = scene.add.image(207, 28, "LevelOff");
		this.add(level5);

		// Level6
		const level6 = scene.add.image(242, 28, "LevelOff");
		this.add(level6);

		// Level7
		const level7 = scene.add.image(277, 28, "LevelOff");
		this.add(level7);

		// Level8
		const level8 = scene.add.image(313, 28, "LevelOff");
		this.add(level8);

		// Level9
		const level9 = scene.add.image(347, 28, "LevelOff");
		this.add(level9);

		// Level10
		const level10 = scene.add.image(383, 28, "LevelOff");
		this.add(level10);

		// Level11
		const level11 = scene.add.image(418, 28, "LevelOff");
		this.add(level11);

		// Level12
		const level12 = scene.add.image(453, 28, "LevelOff");
		this.add(level12);

		this.levelBar = levelBar;

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	private levelBar: Phaser.GameObjects.Image;

	/* START-USER-CODE */

	// Write your code here.

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
