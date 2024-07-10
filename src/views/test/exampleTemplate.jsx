import { useState, useEffect, useRef } from 'react';
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
    const exampleTemplateAddButtonTable = {
        label: "New"
        , onClick: () => entryExampleTemplate()
    };

    const [exampleTemplateBulkOptionTable, setExampleTemplateBulkOptionTable] = useState({
        buttonArray: [
            {
                name: "Delete"
                , onClick: () => confirmDeleteExampleTemplate()
            }
        ]
        , isLoading: false
    });

    const exampleTemplateInitial = {
        name: ''
        , description: ''
        , value: 0
        , amount: 0
        , date: ''
        , activeFlag: null
    };

    const exampleTemplateCheckBoxTableArrayRef = useRef([]);
    const [exampleTemplateCheckBoxTableArray, setExampleTemplateCheckBoxTableArray] = useState([]);
    const [exampleTemplateOptionColumnTable, setExampleTemplateOptionColumnTable] = useState([]);
    const [exampleTemplateDataTotalTable, setExampleTemplateDataTotalTable] = useState(0);

    const [exampleTemplateArray, setExampleTemplateArray] = useState([]);
    const [exampleTemplateEntryModal, setExampleTemplateEntryModal] = useState({
        title: ""
        , buttonArray: [
            {
                label: ""
                , icon: ""
                , onSubmit: null
                , isLoading: false
            }
        ]
    });

    const exampleTemplateFormRef = useRef(exampleTemplateInitial);
    const [exampleTemplateForm, setExampleTemplateForm] = useState(exampleTemplateInitial);
    const [exampleTemplateFormError, setExampleTemplateFormError] = useState([]);

    const onExampleTemplateFormChange = (e) => {
        const { name, value } = e.target;
        exampleTemplateFormRef.current = { ...exampleTemplateForm, [name]: value };
        setExampleTemplateForm(exampleTemplateFormRef.current);
    };

    const selectValueMap = [{ "key": 1, "value": "Satu" }, { "key": 2, "value": "Dua" }, { "key": 3, "value": "Tiga" }, { "key": 4, "value": "Empat" }];
    const yesNoMap = [{ "key": 1, "value": "Yes" }, { "key": 0, "value": "No" }];

    const exampleTemplateValidate = (data) => {
        const error = {};
        if (!data.name.trim()) error.name = 'Username is required';
        if (!data.description.trim()) error.description = 'Description is required';
        if (data.value <= 0) error.value = 'Value is required';

        // if (!data.email.trim()) error.email = 'Email is required';
        // else if (!/\S+@\S+\.\S+/.test(data.email)) error.email = 'Email is invalid';
        setExampleTemplateFormError(error);
        return Object.keys(error).length === 0;
    };

    const [toast, setToast] = useState({});
    const [dialog, setDialog] = useState({});
    var toastObject = new bootstrap.Toast(document.getElementById("toast_id"), "data-bs-animation-delay");
    var dialogObject;
    var modalObject;

    useEffect(() => { getExampleTemplate(); }, []);

    const getExampleTemplate = async (page = 1, length = 5, search = "", orderColumn = 1, orderDir = "asc") => {
        await api.get(`/test/example-template.json?start=${(page - 1) * length}&length=${length}&search%5Bvalue%5D=${search}`)
            .then(response => {
                const json = response.data;
                setExampleTemplateArray(json.data);
                setExampleTemplateDataTotalTable(json.recordsTotal);

                setExampleTemplateOptionColumnTable(
                    json.data.reduce(function (map, obj) {
                        //map[obj.id] = obj.name;
                        map[obj.id] = { "updatedButtonFlag": false, "deletedButtonFlag": false };
                        return map;
                    }, {})
                );
            })
    }

    const entryExampleTemplate = async (id) => {
        exampleTemplateFormRef.current = exampleTemplateInitial;
        setExampleTemplateForm(exampleTemplateFormRef.current);
        setExampleTemplateFormError([]);
        if (id !== undefined) {
            setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { updatedButtonFlag: true } });
            await api.get(`/test/${id}/example-template.json`)
                .then(response => {
                    const exampleTemplate = response.data.data;
                    exampleTemplateFormRef.current = {
                        id: exampleTemplate.id
                        , name: exampleTemplate.name
                        , description: exampleTemplate.description
                        , value: exampleTemplate.value
                        , amount: exampleTemplate.amount
                        , date: exampleTemplate.date
                        , activeFlag: exampleTemplate.activeFlag
                    }
                    setExampleTemplateForm(exampleTemplateFormRef.current);
                })
                .catch(function (error) {

                })
                .finally(() => {
                    setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { updatedButtonFlag: false } });
                    setExampleTemplateEntryModal({
                        ...exampleTemplateEntryModal
                        , title: "Edit"
                        , buttonArray: exampleTemplateEntryModal.buttonArray.map((button, index) =>
                            index === 0 ? {
                                ...button
                                , label: "Update"
                                , icon: "bi-arrow-repeat"
                                , onSubmit: () => confirmStoreExampleTemplate()
                                , isLoading: false
                            } : button
                        )
                    });
                });
        } else {
            setExampleTemplateEntryModal({
                ...exampleTemplateEntryModal
                , title: "Add"
                , buttonArray: exampleTemplateEntryModal.buttonArray.map((button, index) =>
                    index === 0 ? {
                        ...button
                        , label: "Save"
                        , icon: "bi-bookmark"
                        , onSubmit: () => confirmStoreExampleTemplate()
                        , isLoading: false
                    } : button
                )
            });
        }

        modalObject = new bootstrap.Modal(document.getElementById("modal_id"), { backdrop: false, keyboard: true, focus: true });
        modalObject.show();
    }

    const confirmStoreExampleTemplate = () => {
        if (exampleTemplateValidate(exampleTemplateFormRef.current)) {
            setDialog({
                message: "Are you sure to create?"
                , type: "confirmation"
                , onConfirm: (e) => storeExampleTemplate(e)
            });
            dialogObject = new bootstrap.Modal(document.getElementById("dialog_id"), { backdrop: false, keyboard: true, focus: true });
            dialogObject.show();
        }
    }

    const storeExampleTemplate = async () => {
        if (exampleTemplateValidate(exampleTemplateFormRef.current)) {
            dialogObject.hide();
            setExampleTemplateEntryModal({
                ...exampleTemplateEntryModal
                , buttonArray: exampleTemplateEntryModal.buttonArray.map((button, index) =>
                    index === 0
                        ? {
                            ...button
                            , isLoading: true
                        }
                        : button
                )
            });

            await api.post(
                '/test/example-template.json'
                , JSON.stringify(exampleTemplateFormRef.current)
                , { headers: { 'Content-Type': 'application/json' } }
            )
                .then((json) => {
                    if (json.data.status === "success") {
                        getExampleTemplate();
                    }
                    setToast({ type: json.data.status, message: "Submitted successfully" });
                })
                .catch((error) => {
                    setToast({ type: "failed", message: error });
                    setExampleTemplateFormError(error.response.data);
                })
                .finally(() => {
                    toastObject.show();
                    setExampleTemplateEntryModal({
                        ...exampleTemplateEntryModal
                        , buttonArray: exampleTemplateEntryModal.buttonArray.map((button, index) =>
                            index === 0
                                ? {
                                    ...button
                                    , isLoading: false
                                }
                                : button
                        )
                    });
                    bootstrap.Modal.getInstance(document.getElementById('modal_id')).hide();
                });
        }
    }

    const confirmDeleteExampleTemplate = (id) => {
        if (id !== undefined) {
            setDialog({
                message: `Are you sure to delete ${id}?`
                , type: "warning"
                , onConfirm: () => deleteExampleTemplate(id)
            });
        } else {
            if (exampleTemplateCheckBoxTableArrayRef.current.length > 0) {
                setDialog({
                    message: `Are you sure to delete ${exampleTemplateCheckBoxTableArrayRef.current.length} items(s)?`
                    , type: "warning"
                    , onConfirm: () => deleteExampleTemplate()
                });
            } else {
                setDialog({
                    message: "Please tick at least an item"
                    , type: "alert"
                });
            }
        }
        dialogObject = new bootstrap.Modal(document.getElementById("dialog_id"), { backdrop: false, keyboard: true, focus: true });
        dialogObject.show();
    }

    const deleteExampleTemplate = async (id) => {
        dialogObject.hide();
        if (id !== undefined) {
            setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { deletedButtonFlag: true } });
        } else {
            setExampleTemplateBulkOptionTable({ ...exampleTemplateBulkOptionTable, isLoading: true });
        }

        await api.delete(
            `/test/${id !== undefined ? id : exampleTemplateCheckBoxTableArrayRef.current.join("")}/example-template.json`
            , null
            , { headers: { 'Content-Type': 'application/json' } }
        )
            .then(function (json) {
                if (json.data.status === "success") {
                    getExampleTemplate();
                }
                setToast({ type: json.data.status, message: json.data.message });
            })
            .catch(function (error) {
                setToast({ type: "failed", message: error });
            })
            .finally(() => {
                if (id !== undefined) {
                    setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { deletedButtonFlag: false } });
                } else {
                    setExampleTemplateBulkOptionTable({ ...exampleTemplateBulkOptionTable, isLoading: false });
                }
                toastObject.show();
            });
    }

    return (
        <div className="container mt-4 mb-4">
            <Modal
                id="modal_id"
                size="md"
                title={exampleTemplateEntryModal.title}
                buttonArray={exampleTemplateEntryModal.buttonArray}
            >
                <Input label="Name" type="text" name="name" value={exampleTemplateForm.name} onChange={onExampleTemplateFormChange} placeholder="Please input name" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.name} />
                <Textarea label="Description" name="description" rows="3" value={exampleTemplateForm.description} onChange={onExampleTemplateFormChange} placeholder="Please input description" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.description} />
                <Select label="Value" name="value" map={selectValueMap} value={exampleTemplateForm.value} onChange={onExampleTemplateFormChange} placeholder="Please select value" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.value} />
                <Input label="Amount" type="number" name="amount" value={exampleTemplateForm.amount} onChange={onExampleTemplateFormChange} placeholder="Please input amount" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.amount} />
                <Input label="Date" type="date" name="date" value={exampleTemplateForm.date} onChange={onExampleTemplateFormChange} placeholder="Please input date" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.date} />
                <Radio label="Active Flag" name="activeFlag" value={exampleTemplateForm.activeFlag} map={yesNoMap} onChange={onExampleTemplateFormChange} className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.activeFlag} />
            </Modal>
            <Dialog
                id="dialog_id"
                type={dialog.type}
                message={dialog.message}
                onConfirm={dialog.onConfirm}
            />
            <Toast id="toast_id" type={toast.type} message={toast.message} />
            <div className="row"><h3><span className="bi-puzzle">&nbsp;Example</span></h3></div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Table
                                labelNewButton={exampleTemplateAddButtonTable.label}
                                onNewButtonClick={exampleTemplateAddButtonTable.onClick}

                                bulkOptionArray={exampleTemplateBulkOptionTable.buttonArray}
                                isBulkOptionLoading={exampleTemplateBulkOptionTable.isLoading}

                                dataArray={exampleTemplateArray}
                                columns={[
                                    {
                                        data: "name"
                                        , name: "Name"
                                        , class: "min-mobile text-nowrap"
                                    }
                                    , {
                                        data: "description"
                                        , name: "Description"
                                        , class: "min-tablet text-nowrap"
                                    }
                                    , {
                                        data: "value"
                                        , name: "Value"
                                        , class: "min-tablet text-nowrap"
                                        , width: 10
                                    }
                                    , {
                                        data: "date"
                                        , name: "Date"
                                        , class: "min-desktop text-nowrap"
                                        , width: 10
                                    }
                                    , {
                                        data: "createdBy"
                                        , name: "Created By"
                                        , class: "min-desktop text-nowrap"
                                        , width: 10
                                    }
                                    , {
                                        data: "createdDate"
                                        , name: "Created Date"
                                        , class: "min-desktop text-nowrap"
                                        , width: 10
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
                                                        isLoading={exampleTemplateOptionColumnTable[data]?.updatedButtonFlag}
                                                    />
                                                    <ButtonTable
                                                        label="Delete"
                                                        onClick={() => confirmDeleteExampleTemplate(data)}
                                                        className="btn-danger"
                                                        icon="bi-trash"
                                                        isLoading={exampleTemplateOptionColumnTable[data]?.deletedButtonFlag}
                                                    />
                                                </>
                                            )
                                        }
                                    }
                                ]}

                                checkBoxArray={exampleTemplateCheckBoxTableArray}
                                onCheckBox={exampleTemplateCheckBoxTableArray => {
                                    exampleTemplateCheckBoxTableArrayRef.current = [...exampleTemplateCheckBoxTableArray];
                                    setExampleTemplateCheckBoxTableArray(exampleTemplateCheckBoxTableArrayRef.current);
                                }}
                                dataTotal={exampleTemplateDataTotalTable}
                                onRender={(page, length, search) => { getExampleTemplate(page = page, length = length, search = search); }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}