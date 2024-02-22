import * as d3 from 'd3';
import { INNER_HEIGHT, INNER_WIDTH, init } from '../../utils'
import '../../style.css'

interface Population {
    year: Date
    age: number
    sex: number
    people: number
}

d3
    .json<Population[]>('https://vega.github.io/vega/data/population.json')
    .then(data => {
        if (!data) return;

        data = data.map(d => ({
            ...d,
            year: new Date(`${d.year}`),
        }))

        const population = d3.rollups(
            data,
            v => d3.sum(v, d => d.people),
            d => d.sex,
            d => d.year
        )

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.year) as [Date, Date])
            .range([0, INNER_WIDTH])

        const y = d3.scaleLinear()
            .domain([0, d3.max(population, p => d3.max(p[1], d => d[1])!)!])
            .range([INNER_HEIGHT, 0])

        const path = d3.line<[Date, number]>()
            .x(d => x(d[0]))
            .y(d => y(d[1]))

        const svg = init()

        const malePopulation = population[0][1]

        svg
            .append("path")
            .datum(malePopulation)
            .attr("d", path)
            .attr("fill", "none")
            .attr("stroke", "red")

        svg
            .selectAll("circle")
            .data(malePopulation)
            .enter()
            .append("circle")
            .attr("cx", d => x(d[0])!)
            .attr("cy", d => y(d[1])!)
            .attr("r", 3)
            .attr("stroke", "black")
            .attr("fill", "black")
            .append("title")
            .text(d => `Year: ${d[0].getUTCFullYear()}, Population: ${d[1].toLocaleString()}`)
    })
