import * as d3 from 'd3';
import { INNER_HEIGHT, INNER_WIDTH, init } from '../../utils'
import '../../style.css'

interface Population {
    year: number
    age: number
    sex: number
    people: number
}

d3
    .json<Population[]>('https://vega.github.io/vega/data/population.json')
    .then(data => {
        if (!data) return;

        const age_populations = d3.rollups(
            data.filter(d => d.year === 2000),
            v => d3.sum(v, d => d.people),
            d => d.age
        )

        const netPopulation = d3.sum(age_populations, d => d[1])

        // scale ages to color (continuous)
        const color = d3.scaleSequential(d3.interpolateSpectral)
            .domain([0, 100])

        // pie chart
        const pie = d3
            .pie<[number, number]>()
            .sort(null)
            .value(d => d[1])
        const arcs = pie(age_populations)

        const svg = init()

        svg
            .append('g')
            .attr('transform', `translate(${INNER_WIDTH / 2}, ${INNER_HEIGHT / 2})`)
            .selectAll('path')
            .data(arcs)
            .enter()
            .append('path')
            .attr('d', d3.arc()
                .innerRadius(0)
                .outerRadius(INNER_HEIGHT / 2) as any
            )
            .attr('fill', d => color(d.data[0]))
            .append('title')
            .text(d => `${d.data[0]}: ${d.data[1].toLocaleString()} (${(d.data[1] / netPopulation * 100).toFixed(2)}%)`)
        
    })
