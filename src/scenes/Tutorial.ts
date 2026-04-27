import Phaser from "../phaser";

export default class Tutorial extends Phaser.Scene {
	constructor() {
		super("Tutorial");
	}

	create() {
		const { width, height } = this.scale;
		const centerX = width * 0.5;
		const centerY = height * 0.5;

		this.cameras.main.setBackgroundColor("#ffffff");
		this.add.rectangle(centerX, centerY, width, height, 0xffffff, 1);
		this.add.rectangle(centerX, centerY, width - 54, height - 54, 0xf7f0df, 0.95)
			.setStrokeStyle(4, 0xd8b46a, 1);

		const tutoImage = this.add.image(centerX, centerY - 18, "tuto");
		tutoImage.setScale(0.12);
		tutoImage.setAlpha(0);

		this.tweens.add({
			targets: tutoImage,
			scaleX: 0.72,
			scaleY: 0.72,
			alpha: 1,
			duration: 520,
			ease: "Back.easeOut",
		});

		this.tweens.add({
			targets: tutoImage,
			scaleX: 0.76,
			scaleY: 0.76,
			duration: 1700,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
			delay: 520,
		});

		this.tweens.add({
			targets: tutoImage,
			angle: { from: -1.4, to: 1.4 },
			duration: 2200,
			yoyo: true,
			repeat: -1,
			ease: "Sine.easeInOut",
			delay: 520,
		});

		const goButton = this.add.text(centerX, height - 74, "GO IT", {
			fontFamily: "Courier New, monospace",
			fontSize: "28px",
			color: "#fff1bd",
			backgroundColor: "#7c251f",
			padding: { left: 24, right: 24, top: 12, bottom: 12 },
			align: "center",
		});
		goButton.setOrigin(0.5);
		goButton.setInteractive({ useHandCursor: true });

		goButton.on("pointerover", () => {
			goButton.setScale(1.05);
		});

		goButton.on("pointerout", () => {
			goButton.setScale(1);
		});

		goButton.on("pointerdown", () => {
			goButton.disableInteractive();
			this.cameras.main.fadeOut(260, 0, 0, 0);
			this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
				this.scene.start("Level");
			});
		});
	}
}
