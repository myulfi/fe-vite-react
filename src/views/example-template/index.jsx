import { useState, useEffect } from 'react';
import api from '../../api';
import ButtonTable from "../../components/form/buttonTable";
import Table from '../../components/table';
import Toast from '../../components/toast';
import Dialog from '../../components/modal/dialog';
import Modal from '../../components/modal/modal';
import Input from '../../components/form/input';
import Textarea from '../../components/form/textarea';
import Select from '../../components/form/select';
import Radio from '../../components/form/radio';

export default function ExampleTemplate() {
    const [checkBoxArray, setCheckBoxArray] = useState([]);
    const [optionRow, setOptionRow] = useState([]);
    const [dataTotal, setDataTotal] = useState(0);
    const [exampleTemplateArray, setExampleTemplateArray] = useState([]);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [bulkOptionLoading, setBulkOptionLoading] = useState(false);

    const clearData = {
        name: ''
        , description: ''
        , value: 0
        , amount: 0
        , date: ''
        , activeFlag: null
    };

    const [formData, setFormData] = useState(clearData);

    const [errors, setErrors] = useState([]);

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
        if (data.value <= 0) errors.value = 'Value is required';

        // if (!data.email.trim()) errors.email = 'Email is required';
        // else if (!/\S+@\S+\.\S+/.test(data.email)) errors.email = 'Email is invalid';
        setErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const [toastMessage, setToastMessage] = useState();
    const [dialogConfirmation, setDialogConfirmation] = useState({});
    var toast = new bootstrap.Toast(document.getElementById("toast_id"), "data-bs-animation-delay");
    var dialog;
    var modal;

    useEffect(() => { fetchExampleTemplate(); }, []);

    const fetchExampleTemplate = async (page = 1, length = 5, search = "", orderColumn = 1, orderDir = "asc") => {
        await api.get(`/test/example-template.json?start=${(page - 1) * length}&length=${length}&search%5Bvalue%5D=${search}`)
            .then(response => {
                const json = response.data;
                setExampleTemplateArray(json.data);
                setDataTotal(json.recordsTotal);

                setOptionRow(
                    json.data.reduce(function (map, obj) {
                        //map[obj.id] = obj.name;
                        map[obj.id] = { "updatedButtonFlag": false, "deletedButtonFlag": false };
                        return map;
                    }, {})
                );
            })
    }

    const onRender = (page, length, search) => {
        fetchExampleTemplate(page = page, length = length, search = search);
    };

    const onCheckBox = checkBoxArray => {
        setCheckBoxArray([...checkBoxArray]);
    }

    const entryExampleTemplate = async (id) => {
        setFormData(clearData);
        setErrors([]);
        if (id !== undefined) {
            setOptionRow({ ...optionRow, [id]: { updatedButtonFlag: true } });
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
                .catch(function (error) {
                    message = "error";
                })
                .finally(() => {
                    setOptionRow({ ...optionRow, [id]: { updatedButtonFlag: false } });
                });
        }

        modal = new bootstrap.Modal(document.getElementById("modal_id"), { backdrop: false, keyboard: true, focus: true });
        modal.show();
    }

    const confirmStoreExampleTemplate = () => {
        if (validateForm(formData)) {
            setDialogConfirmation({
                message: "Are you sure to create?"
                , type: "confirmation"
                , onConfirm: (e) => storeExampleTemplate(e)
            });
            dialog = new bootstrap.Modal(document.getElementById("dialog_id"), { backdrop: false, keyboard: true, focus: true });
            dialog.show();
        }
    }

    const storeExampleTemplate = async () => {
        if (validateForm(formData)) {
            dialog.hide();
            setSubmitLoading(true);

            let message = "";
            await api.post(
                '/test/example-template.json'
                , JSON.stringify(formData)
                , { headers: { 'Content-Type': 'application/json' } }
            )
                .then((json) => {
                    if (json.data.status === "success") {
                        message = "Create Successfuly";
                        fetchExampleTemplate();
                    } else {
                        message = "error";
                    }
                })
                .catch((error) => {
                    message = "error";
                    setErrors(error.response.data);
                })
                .finally(() => {
                    setToastMessage(message);
                    toast.show();
                    setSubmitLoading(false);
                    bootstrap.Modal.getInstance(document.getElementById('modal_id')).hide();
                });
        }
    }

    const confirmDeleteExampleTemplate = (id) => {
        if (id !== undefined) {
            setDialogConfirmation({
                message: `Are you sure to delete ${id}?`
                , type: "warning"
                , onConfirm: () => deleteExampleTemplate(id)
            });
        } else {
            if (checkBoxArray.length > 0) {
                setDialogConfirmation({
                    message: `Are you sure to delete ${checkBoxArray.length} items(s)?`
                    , type: "warning"
                    , onConfirm: () => deleteExampleTemplate()
                });
            } else {
                setDialogConfirmation({
                    message: "Please tick at least an item"
                    , type: "alert"
                });
            }
        }
        dialog = new bootstrap.Modal(document.getElementById("dialog_id"), { backdrop: false, keyboard: true, focus: true });
        dialog.show();
    }

    const deleteExampleTemplate = async (id) => {
        dialog.hide();
        if (id !== undefined) {
            setOptionRow({ ...optionRow, [id]: { deletedButtonFlag: true } });
        } else {
            setBulkOptionLoading(true);
        }

        let message = "";
        await api.delete(
            `/test/${id !== undefined ? id : checkBoxArray.join("")}/example-template.json`
            , null
            , { headers: { 'Content-Type': 'application/json' } }
        )
            .then(function (json) {
                if (json.data.status === "success") {
                    message = "Deleted Successfuly";
                    fetchExampleTemplate();
                } else {
                    message = "error";
                }
            })
            .catch(function (error) {
                message = "error";
            })
            .finally(() => {
                if (id !== undefined) {
                    setOptionRow({ ...optionRow, [id]: { deletedButtonFlag: false } });
                } else {
                    setBulkOptionLoading(false);
                }
                setToastMessage(message);
                toast.show();
            });
    }

    return (
        <div className="container mt-5 mb-5">
            <Modal
                id="modal_id"
                size="md"
                title="Add"
                labelSubmit="Save"
                onSubmit={() => confirmStoreExampleTemplate()}
                isSubmitLoading={submitLoading}
            >
                <Input label="Name" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Please input name" className="col-md-6 col-sm-6 col-xs-12" error={errors.name} />
                <Textarea label="Description" name="description" rows="3" value={formData.description} onChange={handleChange} placeholder="Please input description" className="col-md-6 col-sm-6 col-xs-12" error={errors.description} />
                <Select label="Value" name="value" map={selectValueMap} value={formData.value} onChange={handleChange} placeholder="Please select value" className="col-md-6 col-sm-6 col-xs-12" error={errors.value} />
                <Input label="Amount" type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Please input amount" className="col-md-6 col-sm-6 col-xs-12" error={errors.amount} />
                <Input label="Date" type="date" name="date" value={formData.date} onChange={handleChange} placeholder="Please input date" className="col-md-6 col-sm-6 col-xs-12" error={errors.date} />
                <Radio label="Active Flag" name="activeFlag" value={formData.activeFlag} map={yesNoMap} onChange={handleChange} className="col-md-6 col-sm-6 col-xs-12" error={errors.activeFlag} />
            </Modal>
            <Dialog
                id="dialog_id"
                message={dialogConfirmation.message}
                type={dialogConfirmation.type}
                onConfirm={dialogConfirmation.onConfirm}
            />
            <Toast id="toast_id" message={toastMessage} />
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Table
                                labelNewButton="New"
                                onClickNewButton={() => entryExampleTemplate()}
                                bulkOptionArray={[
                                    {
                                        name: "Delete"
                                        , onClick: () => confirmDeleteExampleTemplate()
                                    }
                                ]}
                                isBulkOptionLoading={bulkOptionLoading}
                                dataArray={exampleTemplateArray}
                                columns={[
                                    {
                                        data: "name"
                                        , name: "Name"
                                    }
                                    , {
                                        data: "description"
                                        , name: "Description"
                                    }
                                    , {
                                        data: "value"
                                        , name: "Value"
                                    }
                                    , {
                                        data: "date"
                                        , name: "Date"
                                    }
                                    , {
                                        data: "createdBy"
                                        , name: "Created By"
                                    }
                                    , {
                                        data: "createdDate"
                                        , name: "Created Date"
                                    }
                                    , {
                                        data: "id"
                                        , name: "Option"
                                        , class: "text-center"
                                        , render: function (data) {
                                            return (
                                                <>
                                                    <ButtonTable
                                                        label="Edit"
                                                        onClick={() => entryExampleTemplate(data)}
                                                        className="btn-primary"
                                                        icon="bi-pencil"
                                                        isLoading={optionRow[data] !== undefined && optionRow[data].updatedButtonFlag}
                                                    />
                                                    <ButtonTable
                                                        label="Delete"
                                                        onClick={() => confirmDeleteExampleTemplate(data)}
                                                        className="btn-danger"
                                                        icon="bi-trash"
                                                        isLoading={optionRow[data] !== undefined && optionRow[data].deletedButtonFlag}
                                                    />
                                                </>
                                            )
                                        }
                                    }
                                ]}
                                checkBoxArray={checkBoxArray}
                                onCheckBox={onCheckBox}
                                dataTotal={dataTotal}
                                onRender={onRender}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}