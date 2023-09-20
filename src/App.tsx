import { useEffect, useState } from 'react';
import * as S from './App.styles';
import Logo from './assets/devmemory_logo.png';
import { InfoItem } from './components/InfoItem';
import { Button } from './components/Button';
import RestartIcon from './svgs/restart.svg';
import { GameInfo } from './types/GameInfo';
import { Items } from './data/items';
import { GridItemType } from './types/GridItemType';
import { GridItem } from './components/GridItem';
import { formatTimeElapsed } from './helpers/formatTimeElapsed';

const App = () => {
	const [playing, setPlaying] = useState<boolean>(false);
	const [timeElapsed, setTimeElapsed] = useState<number>(0);
	const [moveCount, setMoveCount] = useState<number>(0);
	const [shownCount, setShownCount] = useState<number>(0);
	const [gridItems, setGridItems] = useState<GridItemType[]>([]);

	useEffect(() => resetGrid(), []);

	useEffect(() => {
		const timer = setInterval(() => {
			if (playing) {
				setTimeElapsed(timeElapsed + 1);
			}
		}, 1000);
		return () => {
			clearInterval(timer);
		}
	}, [timeElapsed, playing]);

	useEffect(() => {
		if (shownCount !== 2) {
			return;
		}

		const opened = gridItems.filter(item => item.showing);
		if (opened.length === 2) {
			let tmpGrid = [...gridItems];
			if (opened[0].item === opened[1].item) {
				for (let i in tmpGrid) {
					if (! tmpGrid[i].showing) {
						continue;
					}
					tmpGrid[i].keepShowing = true;
					tmpGrid[i].showing = false;
				}
			} else {
				setTimeout(() => {
					for (let i in tmpGrid) {
						if (tmpGrid[i].showing) {
							tmpGrid[i].showing = false;
						}
					}
				}, 500);
			}
			setGridItems(tmpGrid);
			setShownCount(0);
			setMoveCount(moveCount + 1);
		}

	}, [shownCount, gridItems]);

	useEffect(() => {
		if (moveCount > 0 && gridItems.every(item => item.keepShowing)) {
			setPlaying(false);

		}
	}, [moveCount, gridItems]);

	const resetGrid = () => {
		// Clears the game grid
		setPlaying(true);
		setTimeElapsed(0);
		setMoveCount(0);
		setShownCount(0);
		setGridItems([]);

		let tempGrid: GridItemType[] = [];
		for (let i = 0; i < (Items.length * 2); ++i) {
			tempGrid.push({
				item: null,
				showing: false,
				keepShowing: false,
			});
		}

		for (let w = 0; w < 2; ++w) {
			for (let t = 0; t < Items.length; ++t) {
				let pos = -1;
				while (pos < 0 || tempGrid[pos].item !== null) {
					pos = Math.floor(Math.random() * (Items.length * 2));
				}
				tempGrid[pos].item = t;
			}
		}
		
		// Clears the game grid
		setGridItems(tempGrid);
	}
	
	const handleItemClick = (index: number) => {
		if (playing && index !== null && shownCount < 2) {
			let tmpGrid = [...gridItems];

			if (! tmpGrid[index].keepShowing && ! tmpGrid[index].showing) {
				tmpGrid[index].showing = true;
			}

			setGridItems(tmpGrid);
			setShownCount(shownCount + 1);
		}

	}

	return (
		<S.Container>
			<S.Info>
				<S.LogoLink>
					<img src={Logo} width={200} alt='Devsmemory Logo' />
				</S.LogoLink>

				<S.InfoArea>
					<InfoItem label='Tempo' value={formatTimeElapsed(timeElapsed)} />
					<InfoItem label='Movimentos' value={moveCount.toString()} />
				</S.InfoArea>

				<Button label="Reiniciar" icon={RestartIcon} onClick={resetGrid} />
			</S.Info>
			<S.GridArea>
				<S.Grid>
					{gridItems.map((item, index) => (
						<GridItem
							key={index}
							item={item}
							onClick={() => handleItemClick(index)}
						/>
					))}
				</S.Grid>
			</S.GridArea>
		</S.Container>
	);
}

export default App;
