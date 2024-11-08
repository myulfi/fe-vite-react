import { useState, useEffect } from "react"
import { apiRequest } from "../../api"
import * as CommonConstants from "../../constants/commonConstants"
import * as DateHelper from "../../function/dateHelper"
import * as ToastHelper from "../../function/toastHelper"
import * as ModalHelper from "../../function/modalHelper"
import { useTranslation } from "react-i18next"
import Button from "../../components/form/button"
import Table from "../../components/table"
import Toast from "../../components/toast"
import Dialog from "../../components/dialog"
import Modal from "../../components/modal"
import Textarea from "../../components/form/textarea"
import Radio from "../../components/form/radio"
import SelectFilter from "../../components/filter/selectFilter"
import DateFilter from "../../components/filter/dateFilter"
import RangeFilter from "../../components/filter/rangeFilter"
import Label from "../../components/form/label"
import Select from "../../components/form/select"
import InputText from "../../components/form/inputText"
import InputDecimal from "../../components/form/inputDecimal"
import InputDate from "../../components/form/inputDate"

export default function Branch() {
    const { t } = useTranslation()
    const branchInitial = {
        name: '',
        description: '',
        value: 0,
        // valueMultiple: [],
        amount: 0,
        date: '',
        activeFlag: null,
        version: 0,
    }

    const [branchStateModal, setBranchStateModal] = useState(CommonConstants.MODAL.ENTRY)

    const branchFilterTableTableInitial = {
        value: 0,
        date: "",
        range: 0,
    }

    const [branchFilterTable, setBranchFilterTable] = useState(branchFilterTableTableInitial)

    const onBranchFilterTableChange = (e) => {
        const { name, value } = e.target
        setBranchFilterTable({ ...branchFilterTable, [name]: value })
    }

    const [branchBulkOptionLoadingFlag, setBranchBulkOptionLoadingFlag] = useState(false)
    const [branchCheckBoxTableArray, setBranchCheckBoxTableArray] = useState([])
    const [branchOptionColumnTable, setBranchOptionColumnTable] = useState([])
    const [branchAttributeTable, setBranchAttributeTable] = useState()
    const [branchDataTotalTable, setBranchDataTotalTable] = useState(0)
    const [branchTableLoadingFlag, setBranchTableLoadingFlag] = useState(false)

    const [branchArray, setBranchArray] = useState([])

    const [branchEntryModal, setBranchEntryModal] = useState({
        title: "",
        submitLabel: "",
        submitClass: "",
        submitIcon: "",
        submitLoadingFlag: false,
    })

    const [branchForm, setBranchForm] = useState(branchInitial)
    const [branchFormError, setBranchFormError] = useState([])

    const onBranchFormChange = (e) => {
        const { name, value } = e.target
        setBranchForm({ ...branchForm, [name]: value })
        setBranchFormError({ ...branchFormError, [name]: undefined })
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

    const branchValidate = (data) => {
        const error = {}
        if (!data.name.trim()) error.name = t("validate.text.required", { name: t("common.text.name") })
        if (!data.description.trim()) error.description = t("validate.text.required", { name: t("common.text.description") })
        if (data.value <= 0) error.value = t("validate.text.required", { name: t("common.text.value") })

        // if (!data.email.trim()) error.email = t("validate.text.required", { name: t("common.text.email") })
        // else if (!/\S+@\S+\.\S+/.test(data.email)) error.email = t("validate.text.invalid", { name: t("common.text.email") })
        setBranchFormError(error)
        return Object.keys(error).length === 0
    }

    const [toast, setToast] = useState({})
    useEffect(() => {
        if (toast?.message !== undefined) {
            ToastHelper.show("toast_branch")
        }
    }, [toast])

    const [dialog, setDialog] = useState({})
    useEffect(() => {
        if (dialog?.message !== undefined) {
            ModalHelper.show("dialog_branch")
        }
    }, [dialog])

    // useEffect(() => { getBranch() }, [])

    const getBranch = async (options) => {
        setBranchTableLoadingFlag(true)

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
                "search": encodeURIComponent(options.search),
                "orderColumn": options.order.length > 1 ? options.order[0] : null,
                "orderDir": options.order.length > 1 ? options.order[1] : null,
                // "value": branchFilterTable.value,
                // "date": branchFilterTable.date,
                // "range": branchFilterTable.range,
            }
            setBranchAttributeTable(options)

            const response = await apiRequest(CommonConstants.METHOD.GET, "/master/branch.json", params)
            const json = response.data
            setBranchArray(json.data)
            setBranchDataTotalTable(json.recordsTotal)
            setBranchOptionColumnTable(
                json.data.reduce(function (map, obj) {
                    //map[obj.id] = obj.name
                    map[obj.id] = { "viewedButtonFlag": false, "deletedButtonFlag": false }
                    return map
                }, {})
            )
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setBranchTableLoadingFlag(false)
        }
    }

    const viewBranch = async (id) => {
        setBranchForm(branchInitial)
        if (id !== undefined) {
            setBranchStateModal(CommonConstants.MODAL.VIEW)
            setBranchOptionColumnTable({ ...branchOptionColumnTable, [id]: { viewedButtonFlag: true } })
            try {
                const response = await apiRequest(CommonConstants.METHOD.GET, `/master/${id}/branch.json`)

                const branch = response.data.data
                setBranchForm({
                    id: branch.id,
                    name: branch.name,
                    description: branch.description,
                    value: branch.value,
                    amount: branch.amount,
                    date: branch.date,
                    activeFlag: branch.activeFlag,
                    version: branch.version,
                })

                setBranchEntryModal({
                    ...branchEntryModal,
                    title: branch.name,
                    submitLabel: t("common.button.edit"),
                    submitIcon: "bi-pencil",
                    submitLoadingFlag: false,
                })

                ModalHelper.show("modal_branch")
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
            } finally {
                setBranchOptionColumnTable({ ...branchOptionColumnTable, [id]: { viewedButtonFlag: false } })
            }
        }
    }

    const entryBranch = (haveContentFlag) => {
        setBranchStateModal(CommonConstants.MODAL.ENTRY)
        setBranchFormError([])
        if (haveContentFlag) {
            setBranchEntryModal({
                ...branchEntryModal,
                title: branchForm.name,
                submitLabel: t("common.button.update"),
                submitIcon: "bi-arrow-repeat",
                submitLoadingFlag: false,
            })
        } else {
            setBranchForm(branchInitial)
            setBranchEntryModal({
                ...branchEntryModal,
                title: t("common.button.createNew"),
                submitLabel: t("common.button.save"),
                submitIcon: "bi-bookmark",
                submitLoadingFlag: false,
            })
            ModalHelper.show("modal_branch")
        }
    }

    const confirmStoreBranch = () => {
        if (branchValidate(branchForm)) {
            setDialog({
                message: branchForm.id === undefined ? t("common.confirmation.create", { name: branchForm.name }) : t("common.confirmation.update", { name: branchForm.name }),
                type: "confirmation",
                onConfirm: (e) => storeBranch(e),
            })
        }
    }

    const storeBranch = async () => {
        if (branchValidate(branchForm)) {
            ModalHelper.hide("dialog_branch")
            setBranchEntryModal({ ...branchEntryModal, submitLoadingFlag: true })

            try {
                const json = await apiRequest(
                    branchForm.id === undefined ? CommonConstants.METHOD.POST : CommonConstants.METHOD.PATCH,
                    branchForm.id === undefined ? '/master/branch.json' : `/master/${branchForm.id}/branch.json`,
                    JSON.stringify(branchForm),
                )

                if (json.data.status === "success") {
                    getBranch(branchAttributeTable)
                    ModalHelper.hide("modal_branch")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setBranchFormError(error.response.data)
            } finally {
                setBranchEntryModal({ ...branchEntryModal, submitLoadingFlag: false })
            }
        }
    }

    const confirmDeleteBranch = (id, name) => {
        if (id !== undefined) {
            setDialog({
                message: t("common.confirmation.delete", { name: name }),
                type: "warning",
                onConfirm: () => deleteBranch(id),
            })
        } else {
            if (branchCheckBoxTableArray.length > 0) {
                setDialog({
                    message: t("common.confirmation.delete", { name: t("common.text.amountItem", { amount: branchCheckBoxTableArray.length }) }),
                    type: "warning",
                    onConfirm: () => deleteBranch(),
                })
            } else {
                setDialog({
                    message: t("validate.text.pleaseTickAtLeastAnItem"),
                    type: "alert"
                })
            }
        }
    }

    const deleteBranch = async (id) => {
        ModalHelper.hide("dialog_branch")
        if (id !== undefined) {
            setBranchOptionColumnTable({ ...branchOptionColumnTable, [id]: { deletedButtonFlag: true } })
        } else {
            setBranchBulkOptionLoadingFlag(true)
        }

        try {
            const json = await apiRequest(CommonConstants.METHOD.DELETE, `/master/${id !== undefined ? id : branchCheckBoxTableArray.join("")}/branch.json`)
            if (json.data.status === "success") {
                getBranch(branchAttributeTable)
                if (id === undefined) {
                    setBranchCheckBoxTableArray([])
                }
            }
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            if (id !== undefined) {
                setBranchOptionColumnTable({ ...branchOptionColumnTable, [id]: { deletedButtonFlag: false } })
            } else {
                setBranchBulkOptionLoadingFlag(false)
            }
        }
    }

    return (
        <div className="container mt-4 mb-4">
            <Modal
                id="modal_branch"
                size="md"
                title={branchEntryModal.title}
                buttonArray={
                    <>
                        {
                            CommonConstants.MODAL.ENTRY === branchStateModal
                            && <Button
                                label={branchEntryModal.submitLabel}
                                onClick={() => confirmStoreBranch()}
                                className="btn-primary"
                                icon={branchEntryModal.submitIcon}
                                loadingFlag={branchEntryModal.submitLoadingFlag}
                            />
                        }
                        {
                            CommonConstants.MODAL.VIEW === branchStateModal
                            && <Button
                                label={branchEntryModal.submitLabel}
                                onClick={() => entryBranch(true)}
                                className="btn-primary"
                                icon={branchEntryModal.submitIcon}
                                loadingFlag={false}
                            />
                        }
                    </>

                }
            >
                {
                    CommonConstants.MODAL.ENTRY === branchStateModal
                    && <>
                        <InputText label={t("common.text.name")} name="name" value={branchForm.name} onChange={onBranchFormChange} className="col-md-6 col-sm-6 col-xs-12" error={branchFormError.name} />
                        <Textarea label={t("common.text.description")} name="description" rows="3" value={branchForm.description} onChange={onBranchFormChange} className="col-md-6 col-sm-6 col-xs-12" error={branchFormError.description} />
                        <Select label={t("common.text.value")} name="value" map={selectValueMap} value={branchForm.value} onChange={onBranchFormChange} className="col-md-6 col-sm-6 col-xs-12" error={branchFormError.value} />
                        {/* <Select label={t("common.text.value")} name="multipleValue" map={selectValueMap} value={branchForm.valueMultiple} multiple={true}
                            liveSearch={true}
                            actionBox={true}
                            dataSize={5}
                            onChange={onBranchFormChange}
                            className="col-md-6 col-sm-6 col-xs-12" error={branchFormError.value} /> */}
                        <InputDecimal label={t("common.text.amount")} name="amount" value={branchForm.amount} onChange={onBranchFormChange} className="col-md-6 col-sm-6 col-xs-12" error={branchFormError.amount} />
                        <InputDate label={t("common.text.date")} type="date" name="date" value={DateHelper.formatDate(new Date(branchForm.date), "yyyy-MM-dd")} onChange={onBranchFormChange} className="col-md-6 col-sm-6 col-xs-12" error={branchFormError.date} />
                        <Radio label={t("common.text.activeFlag")} name="activeFlag" value={branchForm.activeFlag} map={yesNoMap} onChange={onBranchFormChange} className="col-md-6 col-sm-6 col-xs-12" error={branchFormError.activeFlag} />
                    </>
                }
                {
                    CommonConstants.MODAL.VIEW === branchStateModal
                    && <>
                        <Label text={t("common.text.name")} value={branchForm.name} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.description")} value={branchForm.description} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.value")} value={branchForm.value} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.amount")} value={branchForm.amount} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.date")} value={DateHelper.formatDate(new Date(branchForm.date), "yyyy-MM-dd")} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.activeFlag")} value={branchForm.activeFlag} className="col-md-6 col-sm-6 col-xs-12" />
                    </>
                }
            </Modal>
            <Dialog id="dialog_branch" type={dialog.type} message={dialog.message} onConfirm={dialog.onConfirm} />
            <Toast id="toast_branch" type={toast.type} message={toast.message} />
            <div className="row"><h3><span className="bi-puzzle">&nbsp;{t("common.menu.branch")}</span></h3></div>
            <div className="row">
                <SelectFilter label={t("common.text.value")} name="value" map={selectValueMap} value={branchFilterTable.value} onChange={onBranchFilterTableChange} placeholder={t("common.text.all")} delay="1" className="col-md-4 col-sm-6 col-xs-12" />
                <DateFilter label={t("common.text.date")} name="date" value={branchFilterTable.date} onChange={onBranchFilterTableChange} delay="2" className="col-md-4 col-sm-6 col-xs-12" />
                <RangeFilter label={t("common.text.range")} name="range" value={branchFilterTable.range} onChange={onBranchFilterTableChange} delay="3" className="col-md-4 col-sm-6 col-xs-12" />
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Table
                                labelNewButton={t("common.button.createNew")}
                                onNewButtonClick={() => entryBranch(false)}

                                bulkOptionLoadingFlag={branchBulkOptionLoadingFlag}
                                bulkOptionArray={[
                                    {
                                        label: t("common.button.delete"),
                                        icon: "bi-trash",
                                        onClick: () => confirmDeleteBranch(),
                                    }
                                ]}

                                dataArray={branchArray}
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
                                                        onClick={() => viewBranch(data)}
                                                        className="btn-primary"
                                                        icon="bi-list-ul"
                                                        loadingFlag={branchOptionColumnTable[data]?.viewedButtonFlag}
                                                    />
                                                    <Button
                                                        label={t("common.button.delete")}
                                                        onClick={() => confirmDeleteBranch(data, row.name)}
                                                        className="btn-danger"
                                                        icon="bi-trash"
                                                        loadingFlag={branchOptionColumnTable[data]?.deletedButtonFlag}
                                                    />
                                                </>
                                            )
                                        }
                                    }
                                ]}
                                order={[[5, "desc"]]}

                                checkBoxArray={branchCheckBoxTableArray}
                                onCheckBox={branchCheckBoxTableArray => { setBranchCheckBoxTableArray([...branchCheckBoxTableArray]) }}
                                dataTotal={branchDataTotalTable}
                                filter={branchFilterTable}
                                onRender={(page, length, search, order) => { getBranch({ page: page, length: length, search: search, order: order }) }}
                                loadingFlag={branchTableLoadingFlag}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}