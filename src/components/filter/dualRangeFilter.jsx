import { useCallback, useEffect, useRef, useState } from "react"
import Filter from "./filter"
import './dualRangeFilter.css'

export default function DualRangeFilter({
    label,
    icon = "bi-search",
    name,
    min = 0,
    max = 100,
    value = {
        min: 0,
        max: 100,
    },
    onChange,
    className = "col-xs-12",
    delay = 1,
}) {
    const [minVal, setMinVal] = useState(min)
    const [maxVal, setMaxVal] = useState(max)
    const minValRef = useRef(min)
    const maxValRef = useRef(max)
    const range = useRef(null)

    // Convert to percentage
    const getPercent = useCallback(
        (value) => Math.round(((value - min) / (max - min)) * 100),
        [min, max]
    )

    // Set width of the range to decrease from the left side
    useEffect(() => {
        const minPercent = getPercent(minVal)
        const maxPercent = getPercent(maxValRef.current)

        if (range.current) {
            range.current.style.left = `${minPercent}%`
            range.current.style.width = `${maxPercent - minPercent}%`
        }
    }, [minVal, getPercent])

    // Set width of the range to decrease from the right side
    useEffect(() => {
        const minPercent = getPercent(minValRef.current)
        const maxPercent = getPercent(maxVal)

        if (range.current) {
            range.current.style.width = `${maxPercent - minPercent}%`
        }
    }, [maxVal, getPercent])

    // Get min and max values when their state changes
    useEffect(() => {
        const timer = setTimeout(() => {
            // Simulate a change in value after 3 seconds
            onChange({
                target: {
                    name: name,
                    value: { min: Number(minVal), max: Number(maxVal) }
                }
            }) // Adjust the logic as needed
        }, 1800)

        // Clean up the timeout on rangeValue change
        return () => clearTimeout(timer)

    }, [minVal, maxVal])

    return (
        <Filter label={label} icon={icon} className={className} delay={delay}>
            <div style={{ marginTop: "15px" }}>
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={minVal}
                    onChange={(event) => {
                        const value = Math.min(Number(event.target.value), maxVal - 1)
                        setMinVal(value)
                        minValRef.current = value
                    }}
                    className="thumb thumb--left"
                    style={{ zIndex: minVal > max - 100 && "5" }}
                />
                <input
                    type="range"
                    min={min}
                    max={max}
                    value={maxVal}
                    onChange={(event) => {
                        const value = Math.max(Number(event.target.value), minVal + 1)
                        setMaxVal(value)
                        maxValRef.current = value
                    }}
                    className="thumb thumb--right"
                />

                <div className="slider">
                    <div className="slider__track" />
                    <div ref={range} className="slider__range" />
                    <div className="slider__left-value">{minVal}</div>
                    <div className="slider__right-value">{maxVal}</div>
                </div>
            </div>

            {/* <input className="my-1 form-range" name={name} type="range" min={min} max={max} value={value} onChange={onChange} /> */}
        </Filter>
    )
}