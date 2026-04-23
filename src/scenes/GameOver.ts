import Phaser from "../phaser";

export default class GameOver extends Phaser.Scene {
	constructor() {
		super("GameOver");
	}

	create() {
		const { width, height } = this.scale;

		this.cameras.main.setBackgroundColor("#050505");
		this.cameras.main.fadeIn(350, 0, 0, 0);

		const title = this.add.text(width / 2, height / 2 - 70, "GAME OVER", {
			fontFamily: "Courier New, monospace",
			fontSize: "52px",
			color: "#f26d6d",
			stroke: "#220707",
			strokeThickness: 8,
			align: "center",
		});
		title.setOrigin(0.5);

		const subtitle = this.add.text(width / 2, height / 2 - 10, "Reactor energy depleted", {
			fontFamily: "Courier New, monospace",
			fontSize: "20px",
			color: "#f5d7d7",
			align: "center",
		});
		subtitle.setOrigin(0.5);

		const restartButton = this.add.text(width / 2, height / 2 + 72, "RESTART", {
			fontFamily: "Courier New, monospace",
			fontSize: "28px",
			color: "#fff1bd",
			backgroundColor: "#7c251f",
			padding: { left: 24, right: 24, top: 12, bottom: 12 },
			align: "center",
		});
		restartButton.setOrigin(0.5);
		restartButton.setInteractive({ useHandCursor: true });

		restartButton.on("pointerover", () => {
			restartButton.setScale(1.04);
		});

		restartButton.on("pointerout", () => {
			restartButton.setScale(1);
		});

		restartButton.on("pointerdown", () => {
			this.cameras.main.fadeOut(250, 0, 0, 0);
			this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, () => {
				window.location.reload();
			});
		});
	}
}