import * as d3 from 'd3'
import { INNER_HEIGHT, INNER_WIDTH, init } from '../../utils'

const svg = init()

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
]

const x = d3.scaleBand()
    .domain(months)
    .range([0, INNER_WIDTH/2])

const xAxis = d3.axisBottom(x)

svg
    .append("g")
    .attr("transform", `translate(0, ${INNER_HEIGHT})`)
    .call(xAxis)