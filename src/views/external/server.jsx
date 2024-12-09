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
import InputPassword from "../../components/form/inputPassword"
import InputDecimal from "../../components/form/inputDecimal"
import InputDate from "../../components/form/inputDate"

export default function Server() {
    const { t } = useTranslation()
    const serverInitial = {
        code: undefined,
        description: undefined,
        username: undefined,
        password: undefined,
        privateKey: undefined,
        ip: undefined,
        port: 22,
        version: 0,
    }

    const [serverStateModal, setServerStateModal] = useState(CommonConstants.MODAL.ENTRY)

    const serverFilterTableTableInitial = {
        value: 0,
        date: "",
        range: 0,
    }

    const [serverFilterTable, setServerFilterTable] = useState(serverFilterTableTableInitial)

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
        if (!data.code.trim()) error.name = t("validate.text.required", { name: t("common.text.code") })
        if (!data.description.trim()) error.description = t("validate.text.required", { name: t("common.text.description") })
        if (!data.username.trim()) error.username = t("validate.text.required", { name: t("common.text.username") })
        if (!data.password.trim()) error.password = t("validate.text.required", { name: t("common.text.password") })
        if (!data.privateKey.trim()) error.privateKey = t("validate.text.required", { name: t("common.text.privateKey") })

        if (!data.ip.trim()) error.ip = t("validate.text.required", { name: "IP" })
        else if (!/^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(data.ip)) error.ip = t("validate.text.invalid", { name: "IP" })

        if (data.port <= 0) error.port = t("validate.text.required", { name: t("common.text.port") })

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
                    map[obj.id] = { "connectedButtonFlag": false, "viewedButtonFlag": false, "deletedButtonFlag": false }
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
                    code: server.code,
                    description: server.description,
                    username: server.username,
                    password: server.password,
                    privateKey: server.privateKey,
                    ip: server.ip,
                    port: server.port,
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

    const [serverId, setServerId] = useState(-1)
    const [connectServerLoadingFlag, setConnectServerLoadingFlag] = useState(false)
    const [serverDirectoryTitleModal, setServerDirectoryTitleModal] = useState(false)
    const [serverDirectoryColumn, setServerDirectoryColumn] = useState([])
    const [serverDirectoryOptionColumnTable, setServerDirectoryOptionColumnTable] = useState([])
    const [serverDirectoryAttributeTable, setServerDirectoryAttributeTable] = useState()
    const [serverDirectoryDataTotalTable, setServerDirectoryDataTotalTable] = useState(0)
    const [serverDirectoryResetPaginationTable, setServerDirectoryResetPaginationTable] = useState(true)
    const [serverDirectoryTableLoadingFlag, setServerDirectoryTableLoadingFlag] = useState(false)

    const [serverDirectoryDataArray, setServerDirectoryDataArray] = useState([])

    const connectServer = async (id) => {
        if (id === 0) {
            setConnectServerLoadingFlag(true)
        } else {
            setServerOptionColumnTable({ ...serverOptionColumnTable, [id]: { connectedButtonFlag: true } })
        }

        try {
            const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${id}/server-default-directory.json`)
            const json = response.data

            if (json.status === "success") {
                setServerId(id)
                getServerDirectory(id, { page: 1, length: 10, search: "", order: [], directory: json.data.defaultDirectory })
            }

            setServerDirectoryTitleModal(id)
            ModalHelper.show("modal_server_directory")
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            if (id === 0) {
                setConnectServerLoadingFlag(false)
            } else {
                setServerOptionColumnTable({ ...serverOptionColumnTable, [id]: { connectedButtonFlag: false } })
            }
        }
    }

    const getServerDirectory = async (serverId, options) => {
        setServerDirectoryTableLoadingFlag(true)

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
                "search": encodeURIComponent(options.search),
                "orderColumn": options.order.length > 1 ? options.order[0] : null,
                "orderDir": options.order.length > 1 ? options.order[1] : null,
                "directory": options.directory
            }
            setServerDirectoryAttributeTable(options)

            const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${serverId}/server-directory.json`, params)
            const json = response.data
            setServerDirectoryDataArray(json.data)
            setServerDirectoryDataTotalTable(json.recordsTotal)
            setServerDirectoryOptionColumnTable(
                json.data.reduce(function (map, obj) {
                    //map[obj.id] = obj.name
                    map[obj.id] = { "connectedButtonFlag": false, "viewedButtonFlag": false, "deletedButtonFlag": false }
                    return map
                }, {})
            )
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setServerDirectoryTableLoadingFlag(false)
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
                        <InputText label={t("common.text.code")} name="code" value={serverForm.code} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.name} />
                        <Textarea label={t("common.text.description")} name="description" rows="3" value={serverForm.description} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.description} />
                        <InputText label={t("common.text.username")} name="username" value={serverForm.username} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.username} />
                        <InputPassword label={t("common.text.password")} name="password" value={serverForm.password} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.password} />
                        <Textarea label={t("common.text.privateKey")} name="privateKey" rows="3" value={serverForm.privateKey} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.privateKey} />
                        <InputText label="IP" name="ip" value={serverForm.ip} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.ip} />
                        <InputText label={t("common.text.port")} name="port" value={serverForm.port} onChange={onServerFormChange} className="col-md-6 col-sm-6 col-xs-12" error={serverFormError.port} />
                    </>
                }
                {
                    CommonConstants.MODAL.VIEW === serverStateModal
                    && <>
                        <Label text={t("common.text.code")} value={serverForm.code} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.description")} value={serverForm.description} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.username")} value={serverForm.username} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.password")} value={serverForm.password} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.privateKey")} value={serverForm.privateKey} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text="IP" value={serverForm.ip} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.port")} value={serverForm.port} className="col-md-6 col-sm-6 col-xs-12" />
                    </>
                }
            </Modal>
            <Modal
                id="modal_server_directory"
                size="xl"
                title={serverDirectoryTitleModal}
            >
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="row">
                            <Table
                                additionalButtonArray={
                                    [
                                        {
                                            label: t("common.button.addToShortcut"),
                                            // onClick: () => viewDatabaseQueryExport(),
                                            icon: "bi-download",
                                        },
                                        {
                                            label: t("common.button.createDirectory"),
                                            // onClick: () => getDatabaseQueryChart("exact"),
                                            icon: "bi-bar-chart-line-fill",
                                            // loadingFlag: databaseQueryExactChartLoadingFlag
                                        },
                                        {
                                            label: t("common.button.addFile"),
                                            // onClick: () => getDatabaseQueryChart("exact"),
                                            icon: "bi-bar-chart-line-fill",
                                            // loadingFlag: databaseQueryExactChartLoadingFlag
                                        },
                                        {
                                            label: t("common.button.upload"),
                                            // onClick: () => getDatabaseQueryChart("exact"),
                                            icon: "bi-bar-chart-line-fill",
                                            // loadingFlag: databaseQueryExactChartLoadingFlag
                                        },
                                        {
                                            label: t("common.button.clone"),
                                            // onClick: () => getDatabaseQueryChart("exact"),
                                            icon: "bi-bar-chart-line-fill",
                                            // loadingFlag: databaseQueryExactChartLoadingFlag
                                        },
                                        {
                                            label: t("common.button.delete"),
                                            // onClick: () => getDatabaseQueryChart("exact"),
                                            icon: "bi-bar-chart-line-fill",
                                            // loadingFlag: databaseQueryExactChartLoadingFlag
                                        }
                                    ]
                                }
                                dataArray={serverDirectoryDataArray ?? []}
                                columns={[
                                    {
                                        data: "id",
                                        name: t("common.text.id"),
                                        class: "text-nowrap",
                                        orderable: true,
                                        minDevice: CommonConstants.DEVICE.MOBILE,
                                    }
                                ]}

                                dataTotal={serverDirectoryDataTotalTable}
                                resetPagination={serverDirectoryResetPaginationTable}
                                onRender={(page, length, search, order) => {
                                    if (serverId >= 0) {
                                        getServerDirectory(serverId, { page: page, length: length, search: search, order: order })
                                    }
                                }}

                                loadingFlag={serverDirectoryTableLoadingFlag}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            <Dialog id="dialog_server" type={dialog.type} message={dialog.message} onConfirm={dialog.onConfirm} />
            <Toast id="toast_server" type={toast.type} message={toast.message} />
            <div className="row"><h3><span className="bi-hdd-rack">&nbsp;{t("common.menu.server")}</span></h3></div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Table
                                labelNewButton={t("common.button.createNew")}
                                onNewButtonClick={() => entryServer(false)}

                                additionalButtonArray={[
                                    {
                                        label: t("common.button.local"),
                                        onClick: () => connectServer(0),
                                        icon: "bi-house-door",
                                        loadingFlag: connectServerLoadingFlag
                                    }
                                ]}

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
                                        data: "id",
                                        name: t("common.text.id"),
                                        class: "text-nowrap",
                                        orderable: true,
                                        minDevice: CommonConstants.DEVICE.MOBILE,
                                    },
                                    {
                                        data: "code",
                                        name: t("common.text.code"),
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
                                        data: "ip",
                                        name: "IP",
                                        class: "text-nowrap",
                                        minDevice: CommonConstants.DEVICE.TABLET,
                                    },
                                    {
                                        data: "id",
                                        name: t("common.text.option"),
                                        class: "text-center",
                                        render: function (data, row) {
                                            return (
                                                <>
                                                    <Button
                                                        label={t("common.button.connect")}
                                                        onClick={() => connectServer(data)}
                                                        className="btn-primary"
                                                        icon="bi-plugin"
                                                        loadingFlag={serverOptionColumnTable[data]?.connectedButtonFlag}
                                                    />
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
                                order={[[0, "desc"]]}

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