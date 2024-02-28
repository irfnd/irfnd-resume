import * as React from 'react';
import { useDraggable } from 'react-use-draggable-scroll';

type DraggableType = { className: string; children: React.ReactNode };

export default function Draggable(props: DraggableType) {
	const { className, children } = props;
	const draggableRef = React.useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
	const { events } = useDraggable(draggableRef);

	return (
		<div ref={draggableRef} className={className} {...events}>
			{children}
		</div>
	);
}
