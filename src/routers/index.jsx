import { Routes, Route } from "react-router-dom"

import Home from '../views/home.jsx'
import ExampleTemplate from '../views/test/exampleTemplate.jsx'

function RoutesIndex() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home.html" element={<Home />} />
            <Route path="/test/example-template.html" element={<ExampleTemplate />} />
        </Routes>
    )
}

export default RoutesIndex