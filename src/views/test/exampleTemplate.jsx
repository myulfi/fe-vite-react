import { useState, useEffect } from 'react';
import api from '../../api';
import * as CommonConstants from "../../constants/commonConstants";
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
import Label from '../../components/form/label';

export default function ExampleTemplate() {
    const exampleTemplateInitial = {
        name: ''
        , description: ''
        , value: 0
        , amount: 0
        , date: ''
        , activeFlag: null
    };

    const [exampleTemplateStateModal, setExampleTemplateStateModal] = useState(CommonConstants.MODAL_IS_ENTRY);

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

    const getExampleTemplate = async (page = 1, length = 5, search = "", order = []) => {
        setExampleTemplateTableLoadingFlag(true);
        await api.get(
            "/test/example-template.json",
            {
                params: {
                    "start": (page - 1) * length,
                    "length": length,
                    "search": search,
                    "orderColumn": order.length > 1 ? order[0] : null,
                    "orderDir": order.length > 1 ? order[1] : null,
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

    const viewExampleTemplate = async (id) => {
        setExampleTemplateForm(exampleTemplateInitial);
        if (id !== undefined) {
            setExampleTemplateStateModal(CommonConstants.MODAL_IS_VIEW);
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
                        , title: "View"
                        , submitLabel: "Edit"
                        , submitIcon: "bi-pencil"
                        , submitLoadingFlag: false
                    });
                });
        }

        modalObject = new bootstrap.Modal(document.getElementById("modal_id"), { backdrop: false, keyboard: true, focus: true });
        modalObject.show();
    }

    const entryExampleTemplate = (haveContentFlag) => {
        setExampleTemplateStateModal(CommonConstants.MODAL_IS_ENTRY);
        setExampleTemplateFormError([]);
        if (haveContentFlag) {
            setExampleTemplateEntryModal({
                ...exampleTemplateEntryModal
                , title: "Edit"
                , submitLabel: "Update"
                , submitIcon: "bi-arrow-repeat"
                , submitLoadingFlag: false
            });
        } else {
            setExampleTemplateForm(exampleTemplateInitial);
            setExampleTemplateEntryModal({
                ...exampleTemplateEntryModal
                , title: "Add"
                , submitLabel: "Save"
                , submitIcon: "bi-bookmark"
                , submitLoadingFlag: false
            });
            modalObject = new bootstrap.Modal(document.getElementById("modal_id"), { backdrop: false, keyboard: true, focus: true });
            modalObject.show();
        }
    }

    const confirmStoreExampleTemplate = () => {
        if (exampleTemplateValidate(exampleTemplateForm)) {
            setDialog({
                message: exampleTemplateForm.id === undefined ? "Are you sure to create?" : "Are you sure to update?"
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
                    <>
                        {
                            CommonConstants.MODAL_IS_ENTRY === exampleTemplateStateModal
                            && <Button
                                label={exampleTemplateEntryModal.submitLabel}
                                onClick={() => confirmStoreExampleTemplate()}
                                className="btn-primary"
                                icon={exampleTemplateEntryModal.submitIcon}
                                loadingFlag={exampleTemplateEntryModal.submitLoadingFlag}
                            />
                        }
                        {
                            CommonConstants.MODAL_IS_VIEW === exampleTemplateStateModal
                            && <Button
                                label={exampleTemplateEntryModal.submitLabel}
                                onClick={() => entryExampleTemplate(true)}
                                className="btn-primary"
                                icon={exampleTemplateEntryModal.submitIcon}
                                loadingFlag={false}
                            />
                        }
                    </>

                }
            >
                {
                    CommonConstants.MODAL_IS_ENTRY === exampleTemplateStateModal
                    && <>
                        <Input label="Name" type="text" name="name" value={exampleTemplateForm.name} onChange={onExampleTemplateFormChange} placeholder="Please input name" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.name} />
                        <Textarea label="Description" name="description" rows="3" value={exampleTemplateForm.description} onChange={onExampleTemplateFormChange} placeholder="Please input description" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.description} />
                        <Select label="Value" name="value" map={selectValueMap} value={exampleTemplateForm.value} onChange={onExampleTemplateFormChange} placeholder="Please select value" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.value} />
                        <Input label="Amount" type="number" name="amount" value={exampleTemplateForm.amount} onChange={onExampleTemplateFormChange} placeholder="Please input amount" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.amount} />
                        <Input label="Date" type="date" name="date" value={exampleTemplateForm.date} onChange={onExampleTemplateFormChange} placeholder="Please input date" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.date} />
                        <Radio label="Active Flag" name="activeFlag" value={exampleTemplateForm.activeFlag} map={yesNoMap} onChange={onExampleTemplateFormChange} className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.activeFlag} />
                    </>
                }
                {
                    CommonConstants.MODAL_IS_VIEW === exampleTemplateStateModal
                    && <>
                        <Label text="Name" value={exampleTemplateForm.name} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text="Description" value={exampleTemplateForm.description} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text="Value" value={exampleTemplateForm.value} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text="Amount" value={exampleTemplateForm.amount} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text="Date" value={exampleTemplateForm.date} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text="Active Flag" value={exampleTemplateForm.activeFlag} className="col-md-6 col-sm-6 col-xs-12" />
                    </>
                }
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
                                onNewButtonClick={() => entryExampleTemplate(false)}

                                bulkOptionLoadingFlag={exampleTemplateBulkOptionLoadingFlag}
                                bulkOptionArray={
                                    <Dropdown label="Delete" icon="bi-trash" onClick={() => confirmDeleteExampleTemplate()} />
                                }

                                dataArray={exampleTemplateArray}
                                columns={[
                                    {
                                        data: "name"
                                        , name: "Name"
                                        , class: "text-nowrap"
                                        , orderable: true
                                        , minDevice: CommonConstants.MOBILE
                                    }
                                    , {
                                        data: "description"
                                        , name: "Description"
                                        , class: "text-nowrap"
                                        , minDevice: CommonConstants.TABLET
                                    }
                                    , {
                                        data: "value"
                                        , name: "Value"
                                        , class: "text-nowrap"
                                        , width: 10
                                        , minDevice: CommonConstants.TABLET
                                    }
                                    , {
                                        data: "date"
                                        , name: "Date"
                                        , class: "text-nowrap"
                                        , width: 10
                                        , minDevice: CommonConstants.DESKTOP
                                    }
                                    , {
                                        data: "createdBy"
                                        , name: "Created By"
                                        , class: "text-nowrap"
                                        , width: 10
                                        , minDevice: CommonConstants.DESKTOP
                                    }
                                    , {
                                        data: "createdDate"
                                        , name: "Created Date"
                                        , class: "text-nowrap"
                                        , width: 15
                                        , orderable: true
                                        , minDevice: CommonConstants.DESKTOP
                                    }
                                    , {
                                        data: "id"
                                        , name: "Option"
                                        , class: "text-center"
                                        , render: function (data) {
                                            return (
                                                <>
                                                    <Button
                                                        label="View"
                                                        onClick={() => viewExampleTemplate(data)}
                                                        className="btn-primary"
                                                        icon="bi-list-ul"
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
                                order={[[5, "desc"]]}

                                checkBoxArray={exampleTemplateCheckBoxTableArray}
                                onCheckBox={exampleTemplateCheckBoxTableArray => { setExampleTemplateCheckBoxTableArray([...exampleTemplateCheckBoxTableArray]); }}
                                dataTotal={exampleTemplateDataTotalTable}
                                filter={exampleTemplateFilterTable}
                                onRender={(page, length, search, order) => { getExampleTemplate(page = page, length = length, search = search, order = order); }}
                                loadingFlag={exampleTemplateTableLoadingFlag}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}