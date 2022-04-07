import { GridItemType } from './GridItemType';

export type GameInfo = {
	playing: boolean;
	timeElapsed: number;
	moveCount: number;
	shownCount: number;
	gridItems: GridItemType[];
}