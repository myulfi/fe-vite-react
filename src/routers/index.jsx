import { Routes, Route } from "react-router-dom";

import Home from '../views/home.jsx';
import ExampleTemplate from '../views/example-template/index.jsx';
import ExampleTemplateCreate from '../views/example-template/create.jsx';
import ExampleTemplateEdit from '../views/example-template/edit.jsx';

function RoutesIndex() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/example-template" element={<ExampleTemplate />} />
            <Route path="/example-template/create" element={<ExampleTemplateCreate />} />
            <Route path="/example-template/edit/:id" element={<ExampleTemplateEdit />} />
        </Routes>
    )
}

export default RoutesIndex