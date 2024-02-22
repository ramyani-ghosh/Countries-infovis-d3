import * as d3 from 'd3'
import './style.css'

export const MARGIN = { TOP: 20, RIGHT: 20, BOTTOM: 20, LEFT: 20 },
    PADDING = { TOP: 60, RIGHT: 60, BOTTOM: 60, LEFT: 60 },
    WIDTH = 960,
    HEIGHT = 500,
    OUTER_WIDTH = WIDTH - MARGIN.LEFT - MARGIN.RIGHT,
    OUTER_HEIGHT = HEIGHT - MARGIN.TOP - MARGIN.BOTTOM,
    INNER_WIDTH = OUTER_WIDTH - PADDING.LEFT - PADDING.RIGHT,
    INNER_HEIGHT = OUTER_HEIGHT - PADDING.TOP - PADDING.BOTTOM


type SvgGroupSelection = d3.Selection<SVGGElement, unknown, HTMLElement, any>
type SvgRectSelection = d3.Selection<SVGRectElement, unknown, HTMLElement, any>

let outer_g: SvgGroupSelection,
    rect: SvgRectSelection,
    inner_g: SvgGroupSelection

export function init() {
    outer_g = d3
        .select("svg")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .append("g")
        .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

    rect = outer_g.append("rect")
        .attr("class", "outer")
        .attr("width", OUTER_WIDTH)
        .attr("height", OUTER_HEIGHT)

    inner_g = outer_g.append("g")
        .attr("transform", `translate(${PADDING.LEFT}, ${PADDING.TOP})`)

    inner_g.append("rect")
        .attr("class", "inner")
        .attr("width", INNER_WIDTH)
        .attr("height", INNER_HEIGHT)

    return inner_g
}