
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
/* END-USER-IMPORTS */

export default class GemLevelBar extends Phaser.GameObjects.Container {
	private readonly slotTextures = [
		"smallGem1",
		"smallGem2",
		"smallGem3",
		"smallGem4",
		"smallGem5",
		"smallGem6",
		"smallGem7",
		"smallGem8",
		"smallGem9",
		"smallGem10",
	];
	private readonly slotPositions = [32, 67, 102, 137, 172, 207, 242, 277, 313, 347];
	private readonly levelSlots: Phaser.GameObjects.Image[] = [];

	constructor(scene: Phaser.Scene, x?: number, y?: number) {
		super(scene, x ?? 0, y ?? -1);
		this.setScrollFactor(0);
		this.setDepth(2000);

		// levelBar
		const levelBar = scene.add.image(0, 1, "LevelBar");
		levelBar.scaleX = 0.8870949428367877;
		levelBar.setOrigin(0, 0);
		this.add(levelBar);

		for (let index = 0; index < this.slotPositions.length; index += 1) {
			const levelSlot = scene.add.image(this.slotPositions[index], 28, "LevelOff");
			this.add(levelSlot);
			this.levelSlots.push(levelSlot);
		}

		this.levelBar = levelBar;

		/* START-USER-CTR-CODE */
	
		levelBar.setOrigin(0, 0);
		/* END-USER-CTR-CODE */
	}

	private levelBar: Phaser.GameObjects.Image;

	

	/* START-USER-CODE */

	setMaxGemLevel(level: number) {
		const maxLevel = Phaser.Math.Clamp(Math.floor(level), 0, this.levelSlots.length);

		this.levelSlots.forEach((slot, index) => {
			if (index < maxLevel) {
				slot.setTexture(this.slotTextures[index]);
			} else {
				slot.setTexture("LevelOff");
			}
		});
	}

	resetMaxGemLevel() {
		this.setMaxGemLevel(0);
	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
