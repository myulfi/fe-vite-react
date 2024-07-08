//import useState
import { useState, useEffect } from 'react';

//import useNavigate
import { useNavigate, useParams } from 'react-router-dom';

//import API
import api from '../../api';
import Input from '../../components/form/input'
import Textarea from '../../components/form/textarea'
import Select from '../../components/form/select'
import Radio from '../../components/form/radio'
import ButtonSubmit from '../../components/form/buttonSubmit'

export default function PostEdit() {

    //define state
    const [formData, setFormData] = useState({
        name: ''
        , description: ''
        , value: ''
        , amount: ''
        , date: ''
        , activeFlag: ''
    });

    //state validation
    const [errors, setErrors] = useState([]);

    //useNavigate
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const selectValueMap = [{ "key": 1, "value": "Satu" }, { "key": 2, "value": "Dua" }, { "key": 3, "value": "Tiga" }, { "key": 4, "value": "Empat" }];
    const yesNoMap = [{ "key": 1, "value": "Yes" }, { "key": 0, "value": "No" }];

    const validateForm = (data) => {
        const errors = {};
        if (!data.name.trim()) errors.name = 'Username is required';
        if (!data.description.trim()) errors.description = 'Description is required';
        if (data <= 0) errors.value = 'Value is required';

        // if (!data.email.trim()) errors.email = 'Email is required';
        // else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Email is invalid';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    //destruct ID
    const { id } = useParams();

    //method fetchDetailPost
    const fetchDetailPost = async () => {

        //fetch data
        await api.get(`/test/${id}/example-template.json`)
            .then(response => {
                const exampleTemplate = response.data.data;
                setFormData({
                    id: exampleTemplate.id
                    , name: exampleTemplate.name
                    , description: exampleTemplate.description
                    , value: exampleTemplate.value
                    , amount: exampleTemplate.amount
                    , date: exampleTemplate.date
                    , activeFlag: exampleTemplate.activeFlag
                });
            })
    }

    //hook useEffect
    useEffect(() => {
        fetchDetailPost();
    }, []);

    //method update post
    const updateExampleTemplate = async (e) => {
        e.preventDefault();

        if (validateForm(formData)) {
            await api.post(
                '/test/example-template-submit.json'
                , JSON.stringify(formData)
                , { headers: { 'Content-Type': 'application/json' } }
            )
                .then(() => {
                    navigate('/posts');
                })
                .catch((error) => {
                    console.log(error);
                    setErrors(error.response.data);
                })
        };
    }

    return (
        <div className="container mt-5">
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <form>
                                <Input label="Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Please input name" error={errors.name} />
                                <Textarea label="Description" name="description" rows="3" value={formData.description} onChange={handleChange} placeholder="Please input description" error={errors.description} />
                                <Select label="Value" name="value" map={selectValueMap} value={formData.value} onChange={handleChange} placeholder="Please select value" error={errors.value} />
                                <Input label="Amount" type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Please input amount" error={errors.amount} />
                                <Input label="Date" type="text" name="date" value={formData.date} onChange={handleChange} placeholder="Please input date" error={errors.date} />
                                <Radio label="Active Flag" name="activeFlag" value={formData.activeFlag} map={yesNoMap} onChange={handleChange} error={errors.activeFlag} />
                                <ButtonSubmit label="Update" buttonClass="btn-primary" onClick={updateExampleTemplate}></ButtonSubmit>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}