import { Routes, Route } from "react-router-dom"

import Home from "../views/home.jsx"
import Branch from "../views/master/branch.jsx"
import ExampleTemplate from '../views/test/exampleTemplate.jsx'
import Language from "../views/command/language.jsx"
import Database from "../views/external/database.jsx"
import Server from "../views/external/server.jsx"

function RoutesIndex() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home.html" element={<Home />} />
            <Route path="/master/branch.html" element={<Branch />} />
            <Route path="/external/database.html" element={<Database />} />
            <Route path="/external/server.html" element={<Server />} />
            <Route path="/command/language.html" element={<Language />} />
            <Route path="/test/example-template.html" element={<ExampleTemplate />} />
        </Routes>
    )
}

export default RoutesIndex