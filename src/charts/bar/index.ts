// import * as d3 from 'd3';
// import { INNER_HEIGHT, INNER_WIDTH, init } from '../../utils'
// import '../../style.css'

// interface Population {
//     year: number
//     age: number
//     sex: number
//     people: number
// }

// d3
//     .json<Population[]>('https://vega.github.io/vega/data/population.json')
//     .then(data => {
//         if (!data) return;

//         const age_populations = d3.rollups(
//             data.filter(d => d.year === 2000),
//             v => d3.sum(v, d => d.people),
//             d => d.age
//         )

//         const x = d3.scaleBand()
//             .domain(age_populations.map(d => `${d[0]}`))
//             .range([0, INNER_WIDTH])

//         const y = d3.scaleLinear()
//             .domain([0, d3.max(age_populations, d => d[1])!])
//             .range([0, INNER_HEIGHT])

//         const svg = init()
//         svg
//             .selectAll("rect:not(.inner)")
//             .data(age_populations)
//             .enter()
//             .append("rect")
//             .attr("x", d => x(`${d[0]}`)!)
//             .attr("y", 0)
//             .attr("width", x.bandwidth())
//             .attr("height", d => y(d[1])!)
//             .attr("fill", "steelblue")
//             .append("title")
//             .text(d => `Age ${d[0]}, Population: ${d[1]}`)
//     })









import * as d3 from 'd3';
import { INNER_HEIGHT, INNER_WIDTH, init } from '../../utils';
import '../../style.css';

// Define the interface for the data
interface CountryData {
    Country: string;
    Region: string;
    Year: number;
    BirthRate: number;
    DeathRate: number;
    FertilityRate: number;
    LifeExpectancyFemale: number;
    LifeExpectancyMale: number;
    LifeExpectancyTotal: number;
    PopulationGrowth: number;
    PopulationTotal: number;
    MobileCellularSubscriptions: number;
    MobileCellularSubscriptionsPerHundred: number;
    TelephoneLines: number;
    TelephoneLinesPerHundred: number;
    AgriculturalLand: number;
    AgriculturalLandPercent: number;
    ArableLand: number;
    ArableLandPercent: number;
    LandArea: number;
    RuralPopulation: number;
    RuralPopulationGrowth: number;
    SurfaceArea: number;
    PopulationDensity: number;
    UrbanPopulationPercent: number;
    UrbanPopulationPercentGrowth: number;
}

// Read the CSV file
d3.csv<CountryData>('/src/countries.csv').then((data: CountryData[]) => {
    if (!data) return;

    // Group data by country and calculate average life expectancy for females and males
    const aggregatedData = d3.rollups(
        data,
        v => {
            const avgLifeExpectancyFemale = d3.mean(v, d => d.LifeExpectancyFemale);
            const avgLifeExpectancyMale = d3.mean(v, d => d.LifeExpectancyMale);
            return { avgLifeExpectancyFemale, avgLifeExpectancyMale };
        },
        d => d.Country
    );

    // Extract country names and average life expectancy for females and males
    const countries = aggregatedData.map(d => d[0]);
    const averageLifeExpectancyFemale = aggregatedData.map(d => d[1].avgLifeExpectancyFemale);
    const averageLifeExpectancyMale = aggregatedData.map(d => d[1].avgLifeExpectancyMale);

    // Scaling functions
    const xScale = d3.scaleBand()
        .domain(countries)
        .range([0, INNER_WIDTH])
        .padding(0.1);

    const yScale = d3.scaleLinear()
        .domain([0, d3.max([...averageLifeExpectancyFemale, ...averageLifeExpectancyMale])!])
        .range([INNER_HEIGHT, 0]);

    // Create SVG element
    const svg = init();

    // Create bars for average life expectancy for females
    svg.selectAll(".bar-female")
        .data(aggregatedData)
        .enter()
        .append("rect")
        .attr("class", "bar-female")
        .attr("x", d => xScale(d[0])!)
        .attr("y", d => yScale(d[1].avgLifeExpectancyFemale)!)
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => INNER_HEIGHT - yScale(d[1].avgLifeExpectancyFemale)!)
        .attr("fill", "pink")
        .append("title")
        .text(d => `Average Life Expectancy Female: ${d[1].avgLifeExpectancyFemale.toFixed(2)}`);

    // Create bars for average life expectancy for males
    svg.selectAll(".bar-male")
        .data(aggregatedData)
        .enter()
        .append("rect")
        .attr("class", "bar-male")
        .attr("x", d => xScale(d[0])! + xScale.bandwidth() / 2)
        .attr("y", d => yScale(d[1].avgLifeExpectancyMale)!)
        .attr("width", xScale.bandwidth() / 2)
        .attr("height", d => INNER_HEIGHT - yScale(d[1].avgLifeExpectancyMale)!)
        .attr("fill", "blue")
        .append("title")
        .text(d => `Average Life Expectancy Male: ${d[1].avgLifeExpectancyMale.toFixed(2)}`);

    // Add X axis
    svg.append("g")
        .attr("transform", `translate(0, ${INNER_HEIGHT})`)
        .call(d3.axisBottom(xScale))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")
        .attr("font-size", "12px");

    // Add Y axis
    svg.append("g")
        .call(d3.axisLeft(yScale).ticks(10).tickFormat(d => `${d} years`))
        .selectAll("text")
        .attr("font-size", "12px");
});

