import { useState } from 'react';
import { apiRequest } from '../../api';
import * as CommonConstants from "../../constants/commonConstants";
import * as DateHelper from "../../function/dateHelper";
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
import SelectMultiple from '../../components/form/selectMultiple';

export default function ExampleTemplate() {
    const exampleTemplateInitial = {
        name: ''
        , description: ''
        , value: 0
        // , valueMultiple: []
        , amount: 0
        , date: ''
        , activeFlag: null
        , version: 0
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
    const [exampleTemplateAttributeTable, setExampleTemplateAttributeTable] = useState();
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

    const selectValueMap = [
        { "key": 1, "value": "Satu" },
        { "key": 2, "value": "Dua" },
        { "key": 3, "value": "Tiga" },
        { "key": 4, "value": "Empat" },
        { "key": 5, "value": "Lima" },
        { "key": 6, "value": "Enam" },
        { "key": 7, "value": "Tujuh" },
        { "key": 8, "value": "Delapan" },
        { "key": 9, "value": "Sembilan" },
        { "key": 10, "value": "Sepuluh" },
    ];
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

    const getExampleTemplate = async (options) => {
        setExampleTemplateTableLoadingFlag(true);

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
                "search": options.search,
                "orderColumn": options.order.length > 1 ? options.order[0] : null,
                "orderDir": options.order.length > 1 ? options.order[1] : null,
                "value": exampleTemplateFilterTable.value,
                "date": exampleTemplateFilterTable.date,
                "range": exampleTemplateFilterTable.range,
            }

            setExampleTemplateAttributeTable(options);

            const response = await apiRequest(CommonConstants.METHOD_IS_GET, "/test/example-template.json", params)
            const json = response.data;
            setExampleTemplateArray(json.data);
            setExampleTemplateDataTotalTable(json.recordsTotal);
            setExampleTemplateOptionColumnTable(
                json.data.reduce(function (map, obj) {
                    //map[obj.id] = obj.name;
                    map[obj.id] = { "viewedButtonFlag": false, "deletedButtonFlag": false };
                    return map;
                }, {})
            );
        } catch (error) {
            setToast({ type: "failed", message: error.message });
            toastObject.show();
        } finally {
            setExampleTemplateTableLoadingFlag(false);
        }
    }

    const viewExampleTemplate = async (id) => {
        setExampleTemplateForm(exampleTemplateInitial);
        if (id !== undefined) {
            setExampleTemplateStateModal(CommonConstants.MODAL_IS_VIEW);
            setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { viewedButtonFlag: true } });
            try {
                const response = await apiRequest(CommonConstants.METHOD_IS_GET, `/test/${id}/example-template.json`)

                const exampleTemplate = response.data.data;
                setExampleTemplateForm({
                    id: exampleTemplate.id
                    , name: exampleTemplate.name
                    , description: exampleTemplate.description
                    , value: exampleTemplate.value
                    , amount: exampleTemplate.amount
                    , date: exampleTemplate.date
                    , activeFlag: exampleTemplate.activeFlag
                    , version: exampleTemplate.version
                });

                setExampleTemplateEntryModal({
                    ...exampleTemplateEntryModal
                    , title: "View"
                    , submitLabel: "Edit"
                    , submitIcon: "bi-pencil"
                    , submitLoadingFlag: false
                })

                modalObject = new bootstrap.Modal(document.getElementById("modal_id"), { backdrop: false, keyboard: true, focus: true });
                modalObject.show();
            } catch (error) {
                setToast({ type: "failed", message: error.message });
                toastObject.show();
            } finally {
                setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { viewedButtonFlag: false } });
            }
        }
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

            try {
                const json = await apiRequest(
                    exampleTemplateForm.id === undefined ? CommonConstants.METHOD_IS_POST : CommonConstants.METHOD_IS_PATCH
                    , exampleTemplateForm.id === undefined ? '/test/example-template.json' : `/test/${exampleTemplateForm.id}/example-template.json`
                    , JSON.stringify(exampleTemplateForm)
                )

                if (json.data.status === "success") {
                    getExampleTemplate(exampleTemplateAttributeTable);
                }
                setToast({ type: json.data.status, message: json.data.message });
                bootstrap.Modal.getInstance(document.getElementById('modal_id')).hide();
            } catch (error) {
                setToast({ type: "failed", message: error.message });
                setExampleTemplateFormError(error.response.data);
            } finally {
                toastObject.show();
                setExampleTemplateEntryModal({ ...exampleTemplateEntryModal, submitLoadingFlag: false });
            }
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

        try {
            const json = await apiRequest(CommonConstants.METHOD_IS_DELETE, `/test/${id !== undefined ? id : exampleTemplateCheckBoxTableArray.join("")}/example-template.json`)
            if (json.data.status === "success") {
                getExampleTemplate(exampleTemplateAttributeTable);
                if (id === undefined) {
                    setExampleTemplateCheckBoxTableArray([]);
                }
            }
            setToast({ type: json.data.status, message: json.data.message });
        } catch (error) {
            setToast({ type: "failed", message: error.message });
        } finally {
            if (id !== undefined) {
                setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { deletedButtonFlag: false } });
            } else {
                setExampleTemplateBulkOptionLoadingFlag(false);
            }
            toastObject.show();
        }
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
                        {/* <SelectMultiple label="Value" name="multipleValue" map={selectValueMap} valueMultiple={exampleTemplateForm.valueMultiple}
                            liveSearch={true}
                            actionBox={true}
                            dataSize={5}
                            onChange={onExampleTemplateFormChange}
                            placeholder="Please select value" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.value} /> */}
                        <Input label="Amount" type="number" name="amount" value={exampleTemplateForm.amount} onChange={onExampleTemplateFormChange} placeholder="Please input amount" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.amount} />
                        <Input label="Date" type="date" name="date" value={DateHelper.formatDate(new Date(exampleTemplateForm.date), "yyyy-MM-dd")} onChange={onExampleTemplateFormChange} placeholder="Please input date" className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.date} />
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
                        <Label text="Date" value={DateHelper.formatDate(new Date(exampleTemplateForm.date), "yyyy-MM-dd")} className="col-md-6 col-sm-6 col-xs-12" />
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
                                                        loadingFlag={exampleTemplateOptionColumnTable[data]?.viewedButtonFlag}
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
                                onRender={(page, length, search, order) => { getExampleTemplate({ page: page, length: length, search: search, order: order }) }}
                                loadingFlag={exampleTemplateTableLoadingFlag}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}