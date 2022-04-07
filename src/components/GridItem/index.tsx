import { GridItemType } from '../../types/GridItemType';
import * as S from './styles';
import B7Svg from '../../svgs/b7.svg';
import { Items } from '../../data/items';

type Props = {
	item: GridItemType;
	onClick: () => void;
}

export const GridItem = ({item, onClick}: Props) => {
	return (
		<S.Container
			onClick={onClick}
			showBackground={item.keepShowing || item.showing}
		>
			{!item.keepShowing && !item.showing && (
				<S.Icon src={B7Svg} opacity={.1} />
			)}
			{(item.keepShowing || item.showing) && item.item !== null && (
				<S.Icon src={Items[item.item].icon} />
			)}
		</S.Container>
	);
}