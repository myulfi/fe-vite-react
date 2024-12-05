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

export default function Server() {
    const { t } = useTranslation()
    const serverInitial = {
        name: undefined,
        description: undefined,
        value: 0,
        // valueMultiple: [],
        amount: 0,
        date: undefined,
        activeFlag: null,
        version: 0,
    }

    const [serverStateModal, setServerStateModal] = useState(CommonConstants.MODAL.ENTRY)

    const serverFilterTableTableInitial = {
        value: 0,
        date: "",
        range: 0,
    }

    const [serverFilterTable, setServerFilterTable] = useState(serverFilterTableTableInitial)

    const onServerFilterTableChange = (e) => {
        const { name, value } = e.target
        setServerFilterTable({ ...serverFilterTable, [name]: value })
    }

    const [serverBulkOptionLoadingFlag, setServerBulkOptionLoadingFlag] = useState(false)
    const [serverCheckBoxTableArray, setServerCheckBoxTableArray] = useState([])
    const [serverOptionColumnTable, setServerOptionColumnTable] = useState([])
    const [serverAttributeTable, setServerAttributeTable] = useState()
    const [serverDataTotalTable, setServerDataTotalTable] = useState(0)
    const [serverTableLoadingFlag, setServerTableLoadingFlag] = useState(false)

    const [serverArray, setServerArray] = useState([])

    const [serverEntryModal, setServerEntryModal] = useState({
        title: "",
        submitLabel: "",
        submitClass: "",
        submitIcon: "",
        submitLoadingFlag: false,
    })

    const [serverForm, setServerForm] = useState(serverInitial)
    const [serverFormError, setServerFormError] = useState([])

    const onServerFormChange = (e) => {
        const { name, value } = e.target
        setServerForm({ ...serverForm, [name]: value })
        setServerFormError({ ...serverFormError, [name]: undefined })
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

    const serverValidate = (data) => {
        const error = {}
        if (!data.name.trim()) error.name = t("validate.text.required", { name: t("common.text.name") })
        if (!data.description.trim()) error.description = t("validate.text.required", { name: t("common.text.description") })
        if (data.value <= 0) error.value = t("validate.text.required", { name: t("common.text.value") })

        // if (!data.email.trim()) error.email = t("validate.text.required", { name: t("common.text.email") })
        // else if (!/\S+@\S+\.\S+/.test(data.email)) error.email = t("validate.text.invalid", { name: t("common.text.email") })
        setServerFormError(error)
        return Object.keys(error).length === 0
    }

    const [toast, setToast] = useState({})
    useEffect(() => {
        if (toast?.message !== undefined) {
            ToastHelper.show("toast_server")
        }
    }, [toast])

    const [dialog, setDialog] = useState({})
    useEffect(() => {
        if (dialog?.message !== undefined) {
            ModalHelper.show("dialog_server")
        }
    }, [dialog])

    // useEffect(() => { getServer() }, [])

    const getServer = async (options) => {
        setServerTableLoadingFlag(true)

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
                "search": encodeURIComponent(options.search),
                "orderColumn": options.order.length > 1 ? options.order[0] : null,
                "orderDir": options.order.length > 1 ? options.order[1] : null,
                // "value": serverFilterTable.value,
                // "date": serverFilterTable.date,
                // "range": serverFilterTable.range,
            }
            setServerAttributeTable(options)

            const response = await apiRequest(CommonConstants.METHOD.GET, "/external/server.json", params)
            const json = response.data
            setServerArray(json.data)
            setServerDataTotalTable(json.recordsTotal)
            setServerOptionColumnTable(
                json.data.reduce(function (map, obj) {
                    //map[obj.id] = obj.name
                    map[obj.id] = { "viewedButtonFlag": false, "deletedButtonFlag": false }
                    return map
                }, {})
            )
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setServerTableLoadingFlag(false)
        }
    }

    const viewServer = async (id) => {
        setServerForm(serverInitial)
        if (id !== undefined) {
            setServerStateModal(CommonConstants.MODAL.VIEW)
            setServerOptionColumnTable({ ...serverOptionColumnTable, [id]: { viewedButtonFlag: true } })
            try {
                const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${id}/server.json`)

                const server = response.data.data
                setServerForm({
                    id: server.id,
                    name: server.name,
                    description: server.description,
                    value: server.value,
                    amount: server.amount,
                    date: server.date,
                    activeFlag: server.activeFlag,
                    version: server.version,
                })

                setServerEntryModal({
                    ...serverEntryModal,
                    title: server.name,
                    submitLabel: t("common.button.edit"),
                    submitIcon: "bi-pencil",
                    submitLoadingFlag: false,
                })

                ModalHelper.show("modal_server")
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
            } finally {
                setServerOptionColumnTable({ ...serverOptionColumnTable, [id]: { viewedButtonFlag: false } })
            }
        }
    }

    const entryServer = (haveContentFlag) => {
        setServerStateModal(CommonConstants.MODAL.ENTRY)
        setServerFormError([])
        if (haveContentFlag) {
            setServerEntryModal({
                ...serverEntryModal,
                title: serverForm.name,
                submitLabel: t("common.button.update"),
                submitIcon: "bi-arrow-repeat",
                submitLoadingFlag: false,
            })
        } else {
            setServerForm(serverInitial)
            setServerEntryModal({
                ...serverEntryModal,
                title: t("common.button.createNew"),
                submitLabel: t("common.button.save"),
                submitIcon: "bi-bookmark",
                submitLoadingFlag: false,
            })
            ModalHelper.show("modal_server")
        }
    }

    const confirmStoreServer = () => {
        if (serverValidate(serverForm)) {
            setDialog({
                message: serverForm.id === undefined ? t("common.confirmation.create", { name: serverForm.name }) : t("common.confirmation.update", { name: serverForm.name }),
                type: "confirmation",
                onConfirm: (e) => storeServer(e),
            })
        }
    }

    const storeServer = async () => {
        if (serverValidate(serverForm)) {
            ModalHelper.hide("dialog_server")
            setServerEntryModal({ ...serverEntryModal, submitLoadingFlag: true })

            try {
                const json = await apiRequest(
                    serverForm.id === undefined ? CommonConstants.METHOD.POST : CommonConstants.METHOD.PATCH,
                    serverForm.id === undefined ? '/external/server.json' : `/external/${serverForm.id}/server.json`,
                    JSON.stringify(serverForm),
                )

                if (json.data.status === "success") {
                    getServer(serverAttributeTable)
                    ModalHelper.hide("modal_server")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setServerFormError(error.response.data)
            } finally {
                setServerEntryModal({ ...serverEntryModal, submitLoadingFlag: false })
            }
        }
    }

    const confirmDeleteServer = (id, name) => {
        if (id !== undefined) {
            setDialog({
                message: t("common.confirmation.delete", { name: name }),
                type: "warning",
                onConfirm: () => deleteServer(id),
            })
        } else {
            if (serverCheckBoxTableArray.length > 0) {
                setDialog({
                    message: t("common.confirmation.delete", { name: t("common.text.amountItem", { amount: serverCheckBoxTableArray.length }) }),
                    type: "warning",
                    onConfirm: () => deleteServer(),
                })
            } else {
                setDialog({
                    message: t("validate.text.pleaseTickAtLeastAnItem"),
                    type: "alert"
                })
            }
        }
    }

    const deleteServer = async (id) => {
        ModalHelper.hide("dialog_server")
        if (id !== undefined) {
            setServerOptionColumnTable({ ...serverOptionColumnTable, [id]: { deletedButtonFlag: true } })
        } else {
            setServerBulkOptionLoadingFlag(true)
        }

        try {
            const json = await apiRequest(CommonConstants.METHOD.DELETE, `/external/${id !== undefined ? id : serverCheckBoxTableArray.join("")}/server.json`)
            if (json.data.status === "success") {
                getServer(serverAttributeTable)
                if (id === undefined) {
                    setServerCheckBoxTableArray([])
                }
            }
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            if (id !== undefined) {
                setServerOptionColumnTable({ ...serverOptionColumnTable, [id]: { deletedButtonFlag: false } })
            } else {
                setServerBulkOptionLoadingFlag(false)
            }
        }
    }

    return (
        <div className="container mt-4 mb-4">
            <Modal
                id="modal_server"
                size="md"
                title={serverEntryModal.title}
                buttonArray={
                    <>
                        {
                            CommonConstants.MODAL.ENTRY === serverStateModal
                            && <Button
                                label={serverEntryModal.submitLabel}
                                onClick={() => confirmStoreServer()}
                                className="btn-primary"
                                icon={serverEntryModal.submitIcon}
                                loadingFlag={serverEntryModal.submitLoadingFlag}
                            />
                        }
                        {
                            CommonConstants.MODAL.VIEW === serverStateModal
                            && <Button
                                label={serverEntryModal.submitLabel}
                                onClick={() => entryServer(true)}
                                className="btn-primary"
                                icon={serverEntryModal.submitIcon}
                                loadingFlag={false}
                            />
                        }
                    </>

                }
            >
                {
                    CommonConstants.MODAL.ENTRY === serverStateModal
                    && <>
                        <InputText label={t("common.text.name")} name="name" value={serverForm.name} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.name} />
                        <Textarea label={t("common.text.description")} name="description" rows="3" value={serverForm.description} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.description} />
                        <Select label={t("common.text.value")} name="value" map={selectValueMap} value={serverForm.value} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.value} />
                        {/* <Select label={t("common.text.value")} name="multipleValue" map={selectValueMap} value={serverForm.valueMultiple} multiple={true}
                            liveSearch={true}
                            actionBox={true}
                            dataSize={5}
                            onChange={onServerFormChange}
                            className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.value} /> */}
                        <InputDecimal label={t("common.text.amount")} name="amount" value={serverForm.amount} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.amount} />
                        <InputDate label={t("common.text.date")} type="date" name="date" value={DateHelper.formatDate(new Date(serverForm.date), "yyyy-MM-dd")} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.date} />
                        <Radio label={t("common.text.activeFlag")} name="activeFlag" value={serverForm.activeFlag} map={yesNoMap} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.activeFlag} />
                    </>
                }
                {
                    CommonConstants.MODAL.VIEW === serverStateModal
                    && <>
                        <Label text={t("common.text.name")} value={serverForm.name} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.description")} value={serverForm.description} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.value")} value={serverForm.value} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.amount")} value={serverForm.amount} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.date")} value={DateHelper.formatDate(new Date(serverForm.date), "yyyy-MM-dd")} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.activeFlag")} value={serverForm.activeFlag} className="col-md-6 col-sm-6 col-xs-12" />
                    </>
                }
            </Modal>
            <Dialog id="dialog_server" type={dialog.type} message={dialog.message} onConfirm={dialog.onConfirm} />
            <Toast id="toast_server" type={toast.type} message={toast.message} />
            <div className="row"><h3><span className="bi-puzzle">&nbsp;{t("common.menu.server")}</span></h3></div>
            <div className="row">
                <SelectFilter label={t("common.text.value")} name="value" map={selectValueMap} value={serverFilterTable.value} onChange={onServerFilterTableChange} placeholder={t("common.text.all")} delay="1" className="col-md-4 col-sm-6 col-xs-12" />
                <DateFilter label={t("common.text.date")} name="date" value={serverFilterTable.date} onChange={onServerFilterTableChange} delay="2" className="col-md-4 col-sm-6 col-xs-12" />
                <RangeFilter label={t("common.text.range")} name="range" value={serverFilterTable.range} onChange={onServerFilterTableChange} delay="3" className="col-md-4 col-sm-6 col-xs-12" />
            </div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Table
                                labelNewButton={t("common.button.createNew")}
                                onNewButtonClick={() => entryServer(false)}

                                bulkOptionLoadingFlag={serverBulkOptionLoadingFlag}
                                bulkOptionArray={[
                                    {
                                        label: t("common.button.delete"),
                                        icon: "bi-trash",
                                        onClick: () => confirmDeleteServer(),
                                    }
                                ]}

                                dataArray={serverArray}
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
                                        render: function (data) {
                                            return DateHelper.formatDate(new Date(data), "dd MMM yyyy HH:mm:ss")
                                        }
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
                                                        onClick={() => viewServer(data)}
                                                        className="btn-primary"
                                                        icon="bi-list-ul"
                                                        loadingFlag={serverOptionColumnTable[data]?.viewedButtonFlag}
                                                    />
                                                    <Button
                                                        label={t("common.button.delete")}
                                                        onClick={() => confirmDeleteServer(data, row.name)}
                                                        className="btn-danger"
                                                        icon="bi-trash"
                                                        loadingFlag={serverOptionColumnTable[data]?.deletedButtonFlag}
                                                    />
                                                </>
                                            )
                                        }
                                    }
                                ]}
                                order={[[5, "desc"]]}

                                checkBoxArray={serverCheckBoxTableArray}
                                onCheckBox={serverCheckBoxTableArray => { setServerCheckBoxTableArray([...serverCheckBoxTableArray]) }}
                                dataTotal={serverDataTotalTable}
                                filter={serverFilterTable}
                                onRender={(page, length, search, order) => { getServer({ page: page, length: length, search: search, order: order }) }}
                                loadingFlag={serverTableLoadingFlag}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}