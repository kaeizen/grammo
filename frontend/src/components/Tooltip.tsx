import { type TooltipProps } from "../types"


export const Tooltip = ({ children, text, position = 'top', showTooltip = true }: TooltipProps) => {
	return (
		<div className={`tooltip-wrapper tooltip-${position} ${ ! showTooltip ? 'hidden' : '' }`}>
			{children}
			<span className="tooltip-text">{text}</span>
		</div>
	)
}

