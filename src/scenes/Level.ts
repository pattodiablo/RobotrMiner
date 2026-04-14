
// You can write more code here

/* START OF COMPILED CODE */

/* START-USER-IMPORTS */
import Phaser from "../phaser";
import {
	AddSpriteToWorld,
	CreateWorld,
	DYNAMIC,
	SetWorldScale,
	UpdateWorldSprites,
	WorldStep,
	b2CreateBody,
	b2DefaultBodyDef,
	b2DefaultWorldDef,
	pxmVec2,
	} from "../box2d.js";
/* END-USER-IMPORTS */

export default class Level extends Phaser.Scene {

	constructor() {
		super("Level");

		/* START-USER-CTR-CODE */
		// Write your code here.
		/* END-USER-CTR-CODE */
	}

	editorCreate(): void {

		// background
		const background = this.add.image(-40, -59, "background");
		background.scaleX = 0.5427640102953456;
		background.scaleY = 0.5427640102953456;
		background.setOrigin(0, 0);

		// playerBot
		this.add.image(583, 306, "PlayerBot");

		// gema
		this.add.image(180, 198, "gema");

		this.events.emit("scene-awake");
	}

	/* START-USER-CODE */

	// Write your code here

	create() {

		SetWorldScale(30);

		this.editorCreate();
	}

	update(_time: number, delta: number) {


	}

	/* END-USER-CODE */
}

/* END OF COMPILED CODE */

// You can write more code here
