import { useState, useEffect } from 'react';
import api from '../../api';
import Button from "../../components/form/button";
import Table from '../../components/table';
import Toast from '../../components/toast';
import Dialog from '../../components/dialog';
import Modal from '../../components/modal';
import Input from '../../components/form/input';
import Textarea from '../../components/form/textarea';
import Select from '../../components/form/select';
import Radio from '../../components/form/radio';
import Dropdown from '../../components/dropdown';
import SelectFilter from '../../components/filter/selectFilter';
import DateFilter from '../../components/filter/dateFilter';
import RangeFilter from '../../components/filter/rangeFilter';

export default function ExampleTemplate() {
    const exampleTemplateInitial = {
        name: ''
        , description: ''
        , value: 0
        , amount: 0
        , date: ''
        , activeFlag: null
    };

    const exampleTemplateFilterTableTableInitial = {
        value: 0,
        date: "",
        range: 0,
    };

    const [exampleTemplateFilterTable, setExampleTemplateFilterTable] = useState(exampleTemplateFilterTableTableInitial);

    const onExampleTemplateFilterTableChange = (e) => {
        const { name, value } = e.target;
        setExampleTemplateFilterTable({ ...exampleTemplateFilterTable, [name]: value });
    };

    const [exampleTemplateBulkOptionLoadingFlag, setExampleTemplateBulkOptionLoadingFlag] = useState(false);
    const [exampleTemplateCheckBoxTableArray, setExampleTemplateCheckBoxTableArray] = useState([]);
    const [exampleTemplateOptionColumnTable, setExampleTemplateOptionColumnTable] = useState([]);
    const [exampleTemplateDataTotalTable, setExampleTemplateDataTotalTable] = useState(0);
    const [exampleTemplateTableLoadingFlag, setExampleTemplateTableLoadingFlag] = useState(false);

    const [exampleTemplateArray, setExampleTemplateArray] = useState([]);

    const [exampleTemplateEntryModal, setExampleTemplateEntryModal] = useState({
        title: ""
        , submitLabel: ""
        , submitClass: ""
        , submitIcon: ""
        , submitLoadingFlag: false
    });

    const [exampleTemplateForm, setExampleTemplateForm] = useState(exampleTemplateInitial);
    const [exampleTemplateFormError, setExampleTemplateFormError] = useState([]);

    const onExampleTemplateFormChange = (e) => {
        const { name, value } = e.target;
        setExampleTemplateForm({ ...exampleTemplateForm, [name]: value });
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

    // useEffect(() => { getExampleTemplate(); }, []);

    const getExampleTemplate = async (page = 1, length = 5, search = "", orderColumn = 1, orderDir = "asc") => {
        setExampleTemplateTableLoadingFlag(true);
        await api.get(
            "/test/example-template.json",
            {
                params: {
                    "start": (page - 1) * length,
                    "length": length,
                    "search": search,
                    "value": exampleTemplateFilterTable.value,
                    "date": exampleTemplateFilterTable.date,
                    "range": exampleTemplateFilterTable.range,
                }
            }
        )
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
            .finally(() => {
                setExampleTemplateTableLoadingFlag(false);
            });
    }

    const entryExampleTemplate = async (id) => {
        setExampleTemplateForm(exampleTemplateInitial);
        setExampleTemplateFormError([]);
        if (id !== undefined) {
            setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { updatedButtonFlag: true } });
            await api.get(`/test/${id}/example-template.json`)
                .then(response => {
                    const exampleTemplate = response.data.data;
                    setExampleTemplateForm({
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
                    setToast({ type: "failed", message: error });
                })
                .finally(() => {
                    setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { updatedButtonFlag: false } });
                    setExampleTemplateEntryModal({
                        ...exampleTemplateEntryModal
                        , title: "Edit"
                        , submitLabel: "Update"
                        , submitIcon: "bi-arrow-repeat"
                        , submitLoadingFlag: false
                    });
                });
        } else {
            setExampleTemplateEntryModal({
                ...exampleTemplateEntryModal
                , title: "Add"
                , submitLabel: "Save"
                , submitIcon: "bi-bookmark"
                , submitLoadingFlag: false
            });
        }

        modalObject = new bootstrap.Modal(document.getElementById("modal_id"), { backdrop: false, keyboard: true, focus: true });
        modalObject.show();
    }

    const confirmStoreExampleTemplate = () => {
        if (exampleTemplateValidate(exampleTemplateForm)) {
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
        if (exampleTemplateValidate(exampleTemplateForm)) {
            dialogObject.hide();
            setExampleTemplateEntryModal({ ...exampleTemplateEntryModal, submitLoadingFlag: true });

            await api.post(
                '/test/example-template.json'
                , JSON.stringify(exampleTemplateForm)
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
                    setExampleTemplateEntryModal({ ...exampleTemplateEntryModal, submitLoadingFlag: false });
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
            if (exampleTemplateCheckBoxTableArray.length > 0) {
                setDialog({
                    message: `Are you sure to delete ${exampleTemplateCheckBoxTableArray.length} items(s)?`
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
            setExampleTemplateBulkOptionLoadingFlag(true);
        }

        await api.delete(
            `/test/${id !== undefined ? id : exampleTemplateCheckBoxTableArray.join("")}/example-template.json`
            , null
            , { headers: { 'Content-Type': 'application/json' } }
        )
            .then(function (json) {
                if (json.data.status === "success") {
                    getExampleTemplate();
                    if (id === undefined) {
                        setExampleTemplateCheckBoxTableArray([]);
                    }
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
                    setExampleTemplateBulkOptionLoadingFlag(false);
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
                buttonArray={
                    <Button
                        label={exampleTemplateEntryModal.submitLabel}
                        onClick={() => confirmStoreExampleTemplate()}
                        className="btn-primary"
                        icon={exampleTemplateEntryModal.submitIcon}
                        loadingFlag={exampleTemplateEntryModal.submitLoadingFlag}
                    />
                }
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
                <SelectFilter label="Value" name="value" map={selectValueMap} value={exampleTemplateFilterTable.value} onChange={onExampleTemplateFilterTableChange} placeholder="All" delay="1" className="col-md-4 col-sm-6 col-xs-12" />
                <DateFilter label="Date" name="date" value={exampleTemplateFilterTable.date} onChange={onExampleTemplateFilterTableChange} delay="2" className="col-md-4 col-sm-6 col-xs-12" />
                <RangeFilter label="Range" name="range" value={exampleTemplateFilterTable.range} onChange={onExampleTemplateFilterTableChange} delay="3" className="col-md-4 col-sm-6 col-xs-12" />
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Table
                                labelNewButton="New"
                                onNewButtonClick={() => entryExampleTemplate()}

                                bulkOptionLoadingFlag={exampleTemplateBulkOptionLoadingFlag}
                                bulkOptionArray={
                                    <Dropdown label="Delete" icon="bi-trash" onClick={() => confirmDeleteExampleTemplate()} />
                                }

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
                                                    <Button
                                                        label="Edit"
                                                        onClick={() => entryExampleTemplate(data)}
                                                        className="btn-primary"
                                                        icon="bi-pencil"
                                                        loadingFlag={exampleTemplateOptionColumnTable[data]?.updatedButtonFlag}
                                                    />
                                                    <Button
                                                        label="Delete"
                                                        onClick={() => confirmDeleteExampleTemplate(data)}
                                                        className="btn-danger"
                                                        icon="bi-trash"
                                                        loadingFlag={exampleTemplateOptionColumnTable[data]?.deletedButtonFlag}
                                                    />
                                                </>
                                            )
                                        }
                                    }
                                ]}

                                checkBoxArray={exampleTemplateCheckBoxTableArray}
                                onCheckBox={exampleTemplateCheckBoxTableArray => { setExampleTemplateCheckBoxTableArray([...exampleTemplateCheckBoxTableArray]); }}
                                dataTotal={exampleTemplateDataTotalTable}
                                filter={exampleTemplateFilterTable}
                                onRender={(page, length, search) => { getExampleTemplate(page = page, length = length, search = search); }}
                                loadingFlag={exampleTemplateTableLoadingFlag}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}