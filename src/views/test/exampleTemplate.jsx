import { useState } from "react"
import { apiRequest } from "../../api"
import * as CommonConstants from "../../constants/commonConstants"
import * as DateHelper from "../../function/dateHelper"
import { useTranslation } from "react-i18next"
import Button from "../../components/form/button"
import Table from "../../components/table"
import Toast from "../../components/toast"
import Dialog from "../../components/dialog"
import Modal from "../../components/modal"
import Textarea from "../../components/form/textarea"
import Select from "../../components/form/select"
import Radio from "../../components/form/radio"
import Dropdown from "../../components/dropdown"
import SelectFilter from "../../components/filter/selectFilter"
import DateFilter from "../../components/filter/dateFilter"
import RangeFilter from "../../components/filter/rangeFilter"
import Label from "../../components/form/label"
import Select from "../../components/form/select"
import InputText from "../../components/form/inputText"
import InputDate from "../../components/form/inputDate"

export default function ExampleTemplate() {
    const { t } = useTranslation()
    const exampleTemplateInitial = {
        name: '',
        description: '',
        value: 0,
        // valueMultiple: [],
        amount: 0,
        date: '',
        activeFlag: null,
        version: 0,
    }

    const [exampleTemplateStateModal, setExampleTemplateStateModal] = useState(CommonConstants.MODAL.ENTRY)

    const exampleTemplateFilterTableTableInitial = {
        value: 0,
        date: "",
        range: 0,
    }

    const [exampleTemplateFilterTable, setExampleTemplateFilterTable] = useState(exampleTemplateFilterTableTableInitial)

    const onExampleTemplateFilterTableChange = (e) => {
        const { name, value } = e.target
        setExampleTemplateFilterTable({ ...exampleTemplateFilterTable, [name]: value })
    }

    const [exampleTemplateBulkOptionLoadingFlag, setExampleTemplateBulkOptionLoadingFlag] = useState(false)
    const [exampleTemplateCheckBoxTableArray, setExampleTemplateCheckBoxTableArray] = useState([])
    const [exampleTemplateOptionColumnTable, setExampleTemplateOptionColumnTable] = useState([])
    const [exampleTemplateAttributeTable, setExampleTemplateAttributeTable] = useState()
    const [exampleTemplateDataTotalTable, setExampleTemplateDataTotalTable] = useState(0)
    const [exampleTemplateTableLoadingFlag, setExampleTemplateTableLoadingFlag] = useState(false)

    const [exampleTemplateArray, setExampleTemplateArray] = useState([])

    const [exampleTemplateEntryModal, setExampleTemplateEntryModal] = useState({
        title: "",
        submitLabel: "",
        submitClass: "",
        submitIcon: "",
        submitLoadingFlag: false,
    })

    const [exampleTemplateForm, setExampleTemplateForm] = useState(exampleTemplateInitial)
    const [exampleTemplateFormError, setExampleTemplateFormError] = useState([])

    const onExampleTemplateFormChange = (e) => {
        const { name, value } = e.target
        setExampleTemplateForm({ ...exampleTemplateForm, [name]: value })
    }

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
    ]
    const yesNoMap = [{ "key": 1, "value": "Yes" }, { "key": 0, "value": "No" }]

    const exampleTemplateValidate = (data) => {
        const error = {}
        if (!data.name.trim()) error.name = t("validate.text.required", { name: t("common.text.name") })
        if (!data.description.trim()) error.description = t("validate.text.required", { name: t("common.text.description") })
        if (data.value <= 0) error.value = t("validate.text.required", { name: t("common.text.value") })

        // if (!data.email.trim()) error.email = t("validate.text.required", { name: t("common.text.email") })
        // else if (!/\S+@\S+\.\S+/.test(data.email)) error.email = t("validate.text.invalid", { name: t("common.text.email") })
        setExampleTemplateFormError(error)
        return Object.keys(error).length === 0
    }

    const [toast, setToast] = useState({})
    useEffect(() => {
        if (toast?.message !== undefined) {
            ToastHelper.show("toast_example_template")
        }
    }, [toast])

    const [dialog, setDialog] = useState({})
    useEffect(() => {
        if (dialog?.message !== undefined) {
            ModalHelper.show("dialog_example_template")
        }
    }, [dialog])

    // useEffect(() => { getExampleTemplate() }, [])

    const getExampleTemplate = async (options) => {
        setExampleTemplateTableLoadingFlag(true)

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
            setExampleTemplateAttributeTable(options)

            const response = await apiRequest(CommonConstants.METHOD.GET, "/test/example-template.json", params)
            const json = response.data
            setExampleTemplateArray(json.data)
            setExampleTemplateDataTotalTable(json.recordsTotal)
            setExampleTemplateOptionColumnTable(
                json.data.reduce(function (map, obj) {
                    //map[obj.id] = obj.name
                    map[obj.id] = { "viewedButtonFlag": false, "deletedButtonFlag": false }
                    return map
                }, {})
            )
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setExampleTemplateTableLoadingFlag(false)
        }
    }

    const viewExampleTemplate = async (id) => {
        setExampleTemplateForm(exampleTemplateInitial)
        if (id !== undefined) {
            setExampleTemplateStateModal(CommonConstants.MODAL.VIEW)
            setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { viewedButtonFlag: true } })
            try {
                const response = await apiRequest(CommonConstants.METHOD.GET, `/test/${id}/example-template.json`)

                const exampleTemplate = response.data.data
                setExampleTemplateForm({
                    id: exampleTemplate.id,
                    name: exampleTemplate.name,
                    description: exampleTemplate.description,
                    value: exampleTemplate.value,
                    amount: exampleTemplate.amount,
                    date: exampleTemplate.date,
                    activeFlag: exampleTemplate.activeFlag,
                    version: exampleTemplate.version,
                })

                setExampleTemplateEntryModal({
                    ...exampleTemplateEntryModal,
                    title: exampleTemplate.name,
                    submitLabel: t("common.button.edit"),
                    submitIcon: "bi-pencil",
                    submitLoadingFlag: false,
                })

                ModalHelper.show("modal_example_template")
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
            } finally {
                setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { viewedButtonFlag: false } })
            }
        }
    }

    const entryExampleTemplate = (haveContentFlag) => {
        setExampleTemplateStateModal(CommonConstants.MODAL.ENTRY)
        setExampleTemplateFormError([])
        if (haveContentFlag) {
            setExampleTemplateEntryModal({
                ...exampleTemplateEntryModal,
                title: exampleTemplateForm.name,
                submitLabel: t("common.button.update"),
                submitIcon: "bi-arrow-repeat",
                submitLoadingFlag: false,
            })
        } else {
            setExampleTemplateForm(exampleTemplateInitial)
            setExampleTemplateEntryModal({
                ...exampleTemplateEntryModal,
                title: t("common.button.createNew"),
                submitLabel: t("common.button.save"),
                submitIcon: "bi-bookmark",
                submitLoadingFlag: false,
            })
            ModalHelper.show("modal_example_template")
        }
    }

    const confirmStoreExampleTemplate = () => {
        if (exampleTemplateValidate(exampleTemplateForm)) {
            setDialog({
                message: exampleTemplateForm.id === undefined ? t("common.confirmation.create", { name: exampleTemplateForm.name }) : t("common.confirmation.update", { name: exampleTemplateForm.name }),
                type: "confirmation",
                onConfirm: (e) => storeExampleTemplate(e),
            })
        }
    }

    const storeExampleTemplate = async () => {
        if (exampleTemplateValidate(exampleTemplateForm)) {
            dialogObject.hide()
            setExampleTemplateEntryModal({ ...exampleTemplateEntryModal, submitLoadingFlag: true })

            try {
                const json = await apiRequest(
                    exampleTemplateForm.id === undefined ? CommonConstants.METHOD.POST : CommonConstants.METHOD.PATCH,
                    exampleTemplateForm.id === undefined ? '/test/example-template.json' : `/test/${exampleTemplateForm.id}/example-template.json`,
                    JSON.stringify(exampleTemplateForm),
                )

                if (json.data.status === "success") {
                    getExampleTemplate(exampleTemplateAttributeTable)
                    ModalHelper.hide("modal_example_template")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response.data.message ?? error.message })
                setExampleTemplateFormError(error.response.data)
            } finally {
                setExampleTemplateEntryModal({ ...exampleTemplateEntryModal, submitLoadingFlag: false })
            }
        }
    }

    const confirmDeleteExampleTemplate = (id, name) => {
        if (id !== undefined) {
            setDialog({
                message: t("common.confirmation.delete", { name: name }),
                type: "warning",
                onConfirm: () => deleteExampleTemplate(id),
            })
        } else {
            if (exampleTemplateCheckBoxTableArray.length > 0) {
                setDialog({
                    message: t("common.confirmation.delete", { name: t("common.text.amountItem", { amount: exampleTemplateCheckBoxTableArray.length }) }),
                    type: "warning",
                    onConfirm: () => deleteExampleTemplate(),
                })
            } else {
                setDialog({
                    message: t("validate.text.pleaseTickAtLeastAnItem"),
                    type: "alert"
                })
            }
        }
    }

    const deleteExampleTemplate = async (id) => {
        ModalHelper.hide("dialog_example_template")
        if (id !== undefined) {
            setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { deletedButtonFlag: true } })
        } else {
            setExampleTemplateBulkOptionLoadingFlag(true)
        }

        try {
            const json = await apiRequest(CommonConstants.METHOD_IS_DELETE, `/test/${id !== undefined ? id : exampleTemplateCheckBoxTableArray.join("")}/example-template.json`)
            if (json.data.status === "success") {
                getExampleTemplate(exampleTemplateAttributeTable)
                if (id === undefined) {
                    setExampleTemplateCheckBoxTableArray([])
                }
            }
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            if (id !== undefined) {
                setExampleTemplateOptionColumnTable({ ...exampleTemplateOptionColumnTable, [id]: { deletedButtonFlag: false } })
            } else {
                setExampleTemplateBulkOptionLoadingFlag(false)
            }
        }
    }

    return (
        <div className="container mt-4 mb-4">
            <Modal
                id="modal_example_template"
                size="md"
                title={exampleTemplateEntryModal.title}
                buttonArray={
                    <>
                        {
                            CommonConstants.MODAL.ENTRY === exampleTemplateStateModal
                            && <Button
                                label={exampleTemplateEntryModal.submitLabel}
                                onClick={() => confirmStoreExampleTemplate()}
                                className="btn-primary"
                                icon={exampleTemplateEntryModal.submitIcon}
                                loadingFlag={exampleTemplateEntryModal.submitLoadingFlag}
                            />
                        }
                        {
                            CommonConstants.MODAL.VIEW === exampleTemplateStateModal
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
                        <InputText label={t("common.text.name")} name="name" value={exampleTemplateForm.name} onChange={onExampleTemplateFormChange} className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.name} />
                        <Textarea label={t("common.text.description")} name="description" rows="3" value={exampleTemplateForm.description} onChange={onExampleTemplateFormChange} className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.description} />
                        <Select label={t("common.text.value")} name="value" map={selectValueMap} value={exampleTemplateForm.value} onChange={onExampleTemplateFormChange} className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.value} />
                        {/* <Select label={t("common.text.value")} name="multipleValue" map={selectValueMap} value={exampleTemplateForm.valueMultiple} multiple={true}
                            liveSearch={true}
                            actionBox={true}
                            dataSize={5}
                            onChange={onExampleTemplateFormChange}
                            className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.value} /> */}
                        <InputDecimal label={t("common.text.amount")} name="amount" value={exampleTemplateForm.amount} onChange={onExampleTemplateFormChange} className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.amount} />
                        <InputDate label={t("common.text.date")} type="date" name="date" value={DateHelper.formatDate(new Date(exampleTemplateForm.date), "yyyy-MM-dd")} onChange={onExampleTemplateFormChange} className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.date} />
                        <Radio label={t("common.text.activeFlag")} name="activeFlag" value={exampleTemplateForm.activeFlag} map={yesNoMap} onChange={onExampleTemplateFormChange} className="col-md-6 col-sm-6 col-xs-12" error={exampleTemplateFormError.activeFlag} />
                    </>
                }
                {
                    CommonConstants.MODAL_IS_VIEW === exampleTemplateStateModal
                    && <>
                        <Label text={t("common.text.name")} value={exampleTemplateForm.name} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.description")} value={exampleTemplateForm.description} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.value")} value={exampleTemplateForm.value} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.amount")} value={exampleTemplateForm.amount} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.date")} value={DateHelper.formatDate(new Date(exampleTemplateForm.date), "yyyy-MM-dd")} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.activeFlag")} value={exampleTemplateForm.activeFlag} className="col-md-6 col-sm-6 col-xs-12" />
                    </>
                }
            </Modal>
            <Dialog id="dialog_example_template" type={dialog.type} message={dialog.message} onConfirm={dialog.onConfirm} />
            <Toast id="toast_example_template" type={toast.type} message={toast.message} />
            <div className="row"><h3><span className="bi-puzzle">&nbsp;{t("common.menu.exampleTemplate")}</span></h3></div>
            <div className="row">
                <SelectFilter label={t("common.text.value")} name="value" map={selectValueMap} value={exampleTemplateFilterTable.value} onChange={onExampleTemplateFilterTableChange} placeholder={t("common.text.all")} delay="1" className="col-md-4 col-sm-6 col-xs-12" />
                <DateFilter label={t("common.text.date")} name="date" value={exampleTemplateFilterTable.date} onChange={onExampleTemplateFilterTableChange} delay="2" className="col-md-4 col-sm-6 col-xs-12" />
                <RangeFilter label={t("common.text.range")} name="range" value={exampleTemplateFilterTable.range} onChange={onExampleTemplateFilterTableChange} delay="3" className="col-md-4 col-sm-6 col-xs-12" />
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Table
                                labelNewButton={t("common.button.createNew")}
                                onNewButtonClick={() => entryExampleTemplate(false)}

                                bulkOptionLoadingFlag={exampleTemplateBulkOptionLoadingFlag}
                                bulkOptionArray={
                                    <Dropdown label={t("common.button.delete")} icon="bi-trash" onClick={() => confirmDeleteExampleTemplate()} />
                                }

                                dataArray={exampleTemplateArray}
                                columns={[
                                    {
                                        data: "name",
                                        name: t("common.text.name"),
                                        class: "text-nowrap",
                                        orderable: true,
                                        minDevice: CommonConstants.DEVICE.MOBILE,
                                    },
                                    {
                                        data: "description",
                                        name: t("common.text.description"),
                                        class: "text-nowrap",
                                        minDevice: CommonConstants.DEVICE.TABLET,
                                    },
                                    {
                                        data: "value",
                                        name: t("common.text.value"),
                                        class: "text-nowrap",
                                        width: 10,
                                        minDevice: CommonConstants.DEVICE.TABLET,
                                    },
                                    {
                                        data: "date",
                                        name: t("common.text.date"),
                                        class: "text-nowrap",
                                        width: 10,
                                        minDevice: CommonConstants.DEVICE.DESKTOP
                                    },
                                    {
                                        data: "createdBy",
                                        name: t("common.text.createdBy"),
                                        class: "text-nowrap",
                                        width: 10,
                                        minDevice: CommonConstants.DEVICE.DESKTOP
                                    },
                                    {
                                        data: "createdDate",
                                        name: t("common.text.createdDate"),
                                        class: "text-nowrap",
                                        width: 15,
                                        orderable: true,
                                        minDevice: CommonConstants.DEVICE.DESKTOP,
                                    },
                                    {
                                        data: "id",
                                        name: t("common.text.option"),
                                        class: "text-center",
                                        render: function (data, row) {
                                            return (
                                                <>
                                                    <Button
                                                        label={t("common.button.view")}
                                                        onClick={() => viewExampleTemplate(data)}
                                                        className="btn-primary"
                                                        icon="bi-list-ul"
                                                        loadingFlag={exampleTemplateOptionColumnTable[data]?.viewedButtonFlag}
                                                    />
                                                    <Button
                                                        label={t("common.button.delete")}
                                                        onClick={() => confirmDeleteExampleTemplate(data, row.name)}
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
                                onCheckBox={exampleTemplateCheckBoxTableArray => { setExampleTemplateCheckBoxTableArray([...exampleTemplateCheckBoxTableArray]) }}
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