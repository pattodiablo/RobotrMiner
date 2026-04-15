declare namespace Phaser {
	namespace GameObjects {
		interface GameObjectFactory {
			spine(x: number, y: number, atlasKey: string, skeletonKey: string): any;
		}
	}
}