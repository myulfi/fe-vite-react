import { useState, useEffect } from "react"
import { apiRequest } from "../../api"
import * as CommonConstants from "../../constants/commonConstants"
import * as DateHelper from "../../function/dateHelper"
import * as ToastHelper from "../../function/toastHelper"
import * as ModalHelper from "../../function/modalHelper"
import { useTranslation } from "react-i18next"
import Navtab from "../../components/container/navtab"
import Button from "../../components/form/button"
import Table from "../../components/table"
import Toast from "../../components/toast"
import Dialog from "../../components/dialog"
import Modal from "../../components/modal"
import Textarea from "../../components/form/textarea"
import Label from "../../components/form/label"
import InputText from "../../components/form/inputText"

export default function Database() {
    const { t } = useTranslation()
    const databaseInitial = {
        code: undefined,
        description: undefined,
        databaseTypeId: 1,
        username: undefined,
        password: undefined,
        databaseConnection: undefined,
        version: 0,
    }

    const [databaseStateModal, setDatabaseStateModal] = useState(CommonConstants.MODAL.ENTRY)

    const databaseFilterTableTableInitial = {
        value: 0,
        date: "",
        range: 0,
    }

    const [databaseFilterTable, setDatabaseFilterTable] = useState(databaseFilterTableTableInitial)

    const [databaseBulkOptionLoadingFlag, setDatabaseBulkOptionLoadingFlag] = useState(false)
    const [databaseCheckBoxTableArray, setDatabaseCheckBoxTableArray] = useState([])
    const [databaseOptionColumnTable, setDatabaseOptionColumnTable] = useState([])
    const [databaseAttributeTable, setDatabaseAttributeTable] = useState()
    const [databaseDataTotalTable, setDatabaseDataTotalTable] = useState(0)
    const [databaseTableLoadingFlag, setDatabaseTableLoadingFlag] = useState(false)

    const [databaseArray, setDatabaseArray] = useState([])

    const [databaseEntryModal, setDatabaseEntryModal] = useState({
        title: "",
        submitLabel: "",
        submitClass: "",
        submitIcon: "",
        submitLoadingFlag: false,
    })

    const [databaseForm, setDatabaseForm] = useState(databaseInitial)
    const [databaseFormError, setDatabaseFormError] = useState([])

    const onDatabaseFormChange = (e) => {
        const { name, value } = e.target
        setDatabaseForm({ ...databaseForm, [name]: value })
        setDatabaseFormError({ ...databaseFormError, [name]: undefined })

        generateUrl(
            "username" === name ? value : databaseForm.username,
            "password" === name ? value : databaseForm.password,
            "databaseConnection" === name ? value : databaseForm.databaseConnection,
        )
    }

    const [databaseUrl, setDatabaseUrl] = useState()
    const generateUrl = (username, password, connection) => {
        setDatabaseUrl(
            databaseTypeArray.find(item => item.key === databaseForm.databaseTypeId).url
                .replace("%1$s", username ?? "{username}")
                .replace("%2$s", password ?? "{password}")
                .replace("%3$s", connection ?? "{connection}")
        )
    }

    const databaseValidate = (data) => {
        const error = {}
        if (!data.code.trim()) error.code = t("validate.text.required", { name: t("common.text.code") })
        if (!data.description.trim()) error.description = t("validate.text.required", { name: t("common.text.description") })
        if (!data.username.trim()) error.username = t("validate.text.required", { name: t("common.text.username") })
        if (!data.password.trim()) error.password = t("validate.text.required", { name: t("common.text.password") })
        if (!data.databaseConnection.trim()) error.databaseConnection = t("validate.text.required", { name: t("common.text.connection") })
        setDatabaseFormError(error)
        return Object.keys(error).length === 0
    }

    const [toast, setToast] = useState({})
    useEffect(() => {
        if (toast?.message !== undefined) {
            ToastHelper.show("toast_database")
        }
    }, [toast])

    const [dialog, setDialog] = useState({})
    useEffect(() => {
        if (dialog?.message !== undefined) {
            ModalHelper.show("dialog_database")
        }
    }, [dialog])

    useEffect(() => {
        getDatabaseType()
    }, [])

    const [databaseTypeArray, setDatabaseTypeArray] = useState([])
    const getDatabaseType = async () => {
        try {
            const response = await apiRequest(CommonConstants.METHOD.GET, `/master/database-type.json`)
            setDatabaseTypeArray(response.data.data.map(object => { return { "key": object["id"], "value": object["name"], "url": object["url"] } }))
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        }
    }

    const getDatabase = async (options) => {
        setDatabaseTableLoadingFlag(true)

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
                "search": encodeURIComponent(options.search),
                "orderColumn": options.order.length > 1 ? options.order[0] : null,
                "orderDir": options.order.length > 1 ? options.order[1] : null,
            }
            setDatabaseAttributeTable(options)

            const response = await apiRequest(CommonConstants.METHOD.GET, "/external/database.json", params)
            const json = response.data
            setDatabaseArray(json.data)
            setDatabaseDataTotalTable(json.recordsTotal)
            setDatabaseOptionColumnTable(
                json.data.reduce(function (map, obj) {
                    //map[obj.id] = obj.name
                    map[obj.id] = { "connectedButtonFlag": false, "viewedButtonFlag": false, "deletedButtonFlag": false }
                    return map
                }, {})
            )
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setDatabaseTableLoadingFlag(false)
        }
    }

    const viewDatabase = async (id) => {
        setDatabaseForm(databaseInitial)
        if (id !== undefined) {
            setDatabaseStateModal(CommonConstants.MODAL.VIEW)
            setDatabaseOptionColumnTable({ ...databaseOptionColumnTable, [id]: { viewedButtonFlag: true } })
            try {
                const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${id}/database.json`)

                const database = response.data.data

                setDatabaseForm({
                    id: database.id,
                    code: database.code,
                    description: database.description,
                    databaseTypeId: database.databaseTypeId,
                    databaseTypeName: database.databaseType.name,
                    username: database.username,
                    password: database.password,
                    databaseConnection: database.databaseConnection,
                    version: database.version,
                })

                generateUrl(database.username, database.password, database.databaseConnection)

                setDatabaseEntryModal({
                    ...databaseEntryModal,
                    title: database.name,
                    submitLabel: t("common.button.edit"),
                    submitIcon: "bi-pencil",
                    submitLoadingFlag: false,
                })

                ModalHelper.show("modal_database")
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
            } finally {
                setDatabaseOptionColumnTable({ ...databaseOptionColumnTable, [id]: { viewedButtonFlag: false } })
            }
        }
    }

    const entryDatabase = (haveContentFlag) => {
        setDatabaseStateModal(CommonConstants.MODAL.ENTRY)
        setDatabaseFormError([])

        if (haveContentFlag) {
            setDatabaseEntryModal({
                ...databaseEntryModal,
                title: databaseForm.name,
                submitLabel: t("common.button.update"),
                submitIcon: "bi-arrow-repeat",
                submitLoadingFlag: false,
            })
        } else {
            setDatabaseForm(databaseInitial)
            generateUrl(databaseInitial.username, databaseInitial.password, databaseInitial.databaseConnection)
            setDatabaseEntryModal({
                ...databaseEntryModal,
                title: t("common.button.createNew"),
                submitLabel: t("common.button.save"),
                submitIcon: "bi-bookmark",
                submitLoadingFlag: false,
            })
            ModalHelper.show("modal_database")
        }
    }

    const confirmStoreDatabase = () => {
        if (databaseValidate(databaseForm)) {
            setDialog({
                message: databaseForm.id === undefined ? t("common.confirmation.create", { name: databaseForm.name }) : t("common.confirmation.update", { name: databaseForm.name }),
                type: "confirmation",
                onConfirm: (e) => storeDatabase(e),
            })
        }
    }

    const storeDatabase = async () => {
        if (databaseValidate(databaseForm)) {
            ModalHelper.hide("dialog_database")
            setDatabaseEntryModal({ ...databaseEntryModal, submitLoadingFlag: true })

            try {
                const json = await apiRequest(
                    databaseForm.id === undefined ? CommonConstants.METHOD.POST : CommonConstants.METHOD.PATCH,
                    databaseForm.id === undefined ? '/external/database.json' : `/external/${databaseForm.id}/database.json`,
                    JSON.stringify(databaseForm),
                )

                if (json.data.status === "success") {
                    getDatabase(databaseAttributeTable)
                    ModalHelper.hide("modal_database")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setDatabaseFormError(error.response.data)
            } finally {
                setDatabaseEntryModal({ ...databaseEntryModal, submitLoadingFlag: false })
            }
        }
    }

    const confirmDeleteDatabase = (id, name) => {
        if (id !== undefined) {
            setDialog({
                message: t("common.confirmation.delete", { name: name }),
                type: "warning",
                onConfirm: () => deleteDatabase(id),
            })
        } else {
            if (databaseCheckBoxTableArray.length > 0) {
                setDialog({
                    message: t("common.confirmation.delete", { name: t("common.text.amountItem", { amount: databaseCheckBoxTableArray.length }) }),
                    type: "warning",
                    onConfirm: () => deleteDatabase(),
                })
            } else {
                setDialog({
                    message: t("validate.text.pleaseTickAtLeastAnItem"),
                    type: "alert"
                })
            }
        }
    }

    const deleteDatabase = async (id) => {
        ModalHelper.hide("dialog_database")
        if (id !== undefined) {
            setDatabaseOptionColumnTable({ ...databaseOptionColumnTable, [id]: { deletedButtonFlag: true } })
        } else {
            setDatabaseBulkOptionLoadingFlag(true)
        }

        try {
            const json = await apiRequest(CommonConstants.METHOD.DELETE, `/external/${id !== undefined ? id : databaseCheckBoxTableArray.join("")}/database.json`)
            if (json.data.status === "success") {
                getDatabase(databaseAttributeTable)
                if (id === undefined) {
                    setDatabaseCheckBoxTableArray([])
                }
            }
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            if (id !== undefined) {
                setDatabaseOptionColumnTable({ ...databaseOptionColumnTable, [id]: { deletedButtonFlag: false } })
            } else {
                setDatabaseBulkOptionLoadingFlag(false)
            }
        }
    }

    const [databaseId, setDatabaseId] = useState(0)
    const [queryManualId, setQueryManualId] = useState(0)

    const [queryManualTableFlag, setQueryManualTableFlag] = useState(false)
    const [queryManualDataArray, setQueryManualDataArray] = useState([])
    const [queryManualColumn, setQueryManualColumn] = useState([])
    const [queryManualDataTotalTable, setQueryManualDataTotalTable] = useState(0)
    const [queryManualTableLoadingFlag, setQueryManualTableLoadingFlag] = useState(false)

    const [databaseConnectionTitleModal, setDatabaseConnectionTitleModal] = useState(undefined)
    const [databaseQueryManualValue, setDatabaseQueryManualValue] = useState()
    const [databaseQueryManualValueError, setDatabaseQueryManualValueError] = useState([])
    const [databaseQueryManualButtonFlag, setDatabaseQueryManualButtonFlag] = useState(false)

    const connectDatabase = async (row) => {
        setDatabaseOptionColumnTable({ ...databaseOptionColumnTable, [row.id]: { connectedButtonFlag: true } })
        try {
            const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${row.id}/test-connetion-database.json`)

            if (response.data.status === "success") {
                setDatabaseId(row.id)
                setDatabaseConnectionTitleModal(`${row.code} | ${row.databaseConnection}`)
                ModalHelper.show("modal_database_connection")
            }
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setDatabaseOptionColumnTable({ ...databaseOptionColumnTable, [row.id]: { connectedButtonFlag: false } })
        }
    }

    const onDatabaseQueryManualValueChange = (e) => {
        const { name, value } = e.target
        setDatabaseQueryManualValue(value)
        setDatabaseQueryManualValueError(undefined)
    }
    const onDatabaseQueryManualValueKeyDown = (e) => {
        if (e.ctrlKey && 13 === e.which && !databaseQueryManualButtonFlag) {
            runQueryManual()
        }
    }

    const runQueryManual = async (e) => {
        setDatabaseQueryManualButtonFlag(true)
        try {
            const json = await apiRequest(CommonConstants.METHOD.PATCH, `/external/${databaseId}/query-manual-database.json`, JSON.stringify({ query: databaseQueryManualValue }))

            if (json.data.status === "success") {
                setQueryManualTableFlag(true)

                setQueryManualColumn(
                    json.data.header.map(element => {
                        if (element.type !== undefined) {
                            return {
                                data: element.name,
                                name: `${element.name} (${element.type})`,
                                class: "text-nowrap",
                                defaultContent: () => { return <i>NULL</i> }
                            }
                        } else {
                            return {
                                data: "action",
                                name: "Result Information",
                                class: "text-nowrap",
                                render: function (_, row) {
                                    if (row.error !== null) {
                                        if (row.query !== undefined) {
                                            return <><b>{row.error}</b> | <i>{row.query}</i></>
                                        } else {
                                            return row.error
                                        }
                                    } else {
                                        return <>{row.row} {row.action} | <i>{row.query}</i></>
                                    }
                                }
                            }
                        }
                    })
                )

                if (json.data.data[0].queryManualId !== undefined) {
                    setQueryManualId(json.data.data[0].queryManualId)
                    getQueryManual({ id: json.data.data[0].queryManualId, page: 1, length: 10 })
                } else {
                    setQueryManualDataArray(json.data.data)
                }
            }
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setDatabaseQueryManualButtonFlag(false)
        }
    }

    const getQueryManual = async (options) => {
        setQueryManualTableLoadingFlag(true)

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
            }

            const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${options.id}/query-manual-database.json`, params)
            const json = response.data
            setQueryManualDataArray(json.data)
            setQueryManualDataTotalTable(json.recordsTotal)
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setQueryManualTableLoadingFlag(false)
        }
    }

    return (
        <div className="container mt-4 mb-4">
            <Modal
                id="modal_database"
                size="md"
                title={databaseEntryModal.title}
                buttonArray={
                    <>
                        {
                            CommonConstants.MODAL.ENTRY === databaseStateModal
                            && <Button
                                label={databaseEntryModal.submitLabel}
                                onClick={() => confirmStoreDatabase()}
                                className="btn-primary"
                                icon={databaseEntryModal.submitIcon}
                                loadingFlag={databaseEntryModal.submitLoadingFlag}
                            />
                        }
                        {
                            CommonConstants.MODAL.VIEW === databaseStateModal
                            && <Button
                                label={databaseEntryModal.submitLabel}
                                onClick={() => entryDatabase(true)}
                                className="btn-primary"
                                icon={databaseEntryModal.submitIcon}
                                loadingFlag={false}
                            />
                        }
                    </>

                }
            >
                {
                    CommonConstants.MODAL.ENTRY === databaseStateModal
                    && <>
                        <InputText
                            label={t("common.text.code")}
                            name="code"
                            value={databaseForm.code}
                            onChange={onDatabaseFormChange}
                            positionUnit="right"
                            nameUnit="databaseTypeId"
                            valueUnit={databaseForm.valueUnitId}
                            valueUnitList={databaseTypeArray}
                            onChangeUnit={onDatabaseFormChange}
                            className="col-md-6 col-sm-6 col-xs-12"
                            error={databaseFormError.code}
                        />
                        <Textarea label={t("common.text.description")} name="description" rows="3" value={databaseForm.description} onChange={onDatabaseFormChange} className="col-md-6 col-sm-6 col-xs-12" error={databaseFormError.description} />
                        <InputText label={t("common.text.username")} name="username" value={databaseForm.username} onChange={onDatabaseFormChange} className="col-md-6 col-sm-6 col-xs-12" error={databaseFormError.username} />
                        <InputText label={t("common.text.password")} name="password" value={databaseForm.password} onChange={onDatabaseFormChange} className="col-md-6 col-sm-6 col-xs-12" error={databaseFormError.password} />
                        <Textarea label={t("common.text.connection")} name="databaseConnection" rows="3" value={databaseForm.databaseConnection} onChange={onDatabaseFormChange} className="col-md-12 col-sm-12 col-xs-12" error={databaseFormError.databaseConnection} />
                        <Textarea label="URL" rows="3" value={databaseUrl} disabled={true} className="col-md-12 col-sm-12 col-xs-12" />
                    </>
                }
                {
                    CommonConstants.MODAL.VIEW === databaseStateModal
                    && <>
                        <Label text={t("common.text.code")} value={databaseForm.code} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.description")} value={databaseForm.description} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.username")} value={databaseForm.username} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.password")} value={databaseForm.password} className="col-md-6 col-sm-6 col-xs-12" />
                        <Label text={t("common.text.connection")} value={databaseForm.databaseConnection} className="col-md-6 col-sm-6 col-xs-12" />
                    </>
                }
            </Modal>
            <Modal
                id="modal_database_connection"
                size="xl"
                title={databaseConnectionTitleModal}
            >
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <Navtab
                            tabArray={[
                                {
                                    "label": t("common.text.query"),
                                    "component": function () {
                                        return (
                                            <div className="row">
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <div className="row">
                                                        <Textarea
                                                            label={
                                                                <Button
                                                                    label={t("common.button.run")}
                                                                    onClick={(e) => runQueryManual(e)}
                                                                    className="btn-primary"
                                                                    icon="bi-play-fill"
                                                                    loadingFlag={databaseQueryManualButtonFlag}
                                                                />
                                                            }
                                                            name="value" rows="3" value={databaseQueryManualValue} onChange={onDatabaseQueryManualValueChange} onKeyDown={onDatabaseQueryManualValueKeyDown} className="col-md-12 col-sm-12 col-xs-12" placeholder={t("common.text.onHere", { name: t("common.text.query") })} error={databaseQueryManualValueError}
                                                        />
                                                        {
                                                            queryManualTableFlag
                                                            && <Table
                                                                additionalButtonArray={
                                                                    queryManualColumn.length > 1
                                                                        ? [
                                                                            {
                                                                                label: t("common.button.export"),
                                                                                onClick: () => implementLanguage(),
                                                                                icon: "bi-download",
                                                                            },
                                                                            {
                                                                                label: t("common.button.whitelist"),
                                                                                onClick: () => implementLanguage(),
                                                                                icon: "bi-plus-circle-fill",
                                                                            },
                                                                            {
                                                                                label: t("common.button.chart"),
                                                                                onClick: () => implementLanguage(),
                                                                                icon: "bi-bar-chart-line-fill",
                                                                            }
                                                                        ]
                                                                        : []
                                                                }
                                                                lengthFlag={false}
                                                                searchFlag={false}
                                                                dataArray={queryManualDataArray}
                                                                columns={queryManualColumn}

                                                                dataTotal={queryManualColumn.length > 1 ? queryManualDataTotalTable : 0}
                                                                onRender={(page, length) => {
                                                                    getQueryManual({ id: queryManualId, page: page, length: length })
                                                                }}
                                                                loadingFlag={queryManualTableLoadingFlag}
                                                            />
                                                        }
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                },
                                // {
                                //     "label": t("common.text.vehicle"),
                                //     "component": function () {
                                //         return (
                                //             <div className="row">
                                //                 <Table
                                //                     lengthFlag={false}
                                //                     searchFlag={false}
                                //                     dataArray={vehicleArray}
                                //                     columns={[
                                //                         {
                                //                             data: "id",
                                //                             name: t("common.text.plateNumber"),
                                //                             class: "text-nowrap",
                                //                             minDevice: CommonConstants.DEVICE.MOBILE,
                                //                         },
                                //                         {
                                //                             data: "ownerName",
                                //                             name: t("common.text.name"),
                                //                             class: "text-nowrap",
                                //                             minDevice: CommonConstants.DEVICE.MOBILE
                                //                         },
                                //                         {
                                //                             data: "address",
                                //                             name: t("common.text.address"),
                                //                             class: "text-nowrap",
                                //                             minDevice: CommonConstants.DEVICE.NONE
                                //                         },
                                //                         {
                                //                             data: "brand",
                                //                             name: t("common.text.brand"),
                                //                             minDevice: CommonConstants.DEVICE.TABLET,
                                //                         },
                                //                         {
                                //                             data: "model",
                                //                             name: t("common.text.model"),
                                //                             minDevice: CommonConstants.DEVICE.TABLET,
                                //                         },
                                //                         {
                                //                             data: "vehicleCategoryName",
                                //                             name: t("common.text.category"),
                                //                             minDevice: CommonConstants.DEVICE.DESKTOP,
                                //                         },
                                //                         {
                                //                             data: "manufactureYear",
                                //                             name: t("common.text.year"),
                                //                             minDevice: CommonConstants.DEVICE.DESKTOP
                                //                         },
                                //                         {
                                //                             data: "cylinder",
                                //                             name: t("common.text.cylinder"),
                                //                             minDevice: CommonConstants.DEVICE.DESKTOP
                                //                         },
                                //                         {
                                //                             data: "color",
                                //                             name: t("common.text.color"),
                                //                             minDevice: CommonConstants.DEVICE.DESKTOP
                                //                         },
                                //                         {
                                //                             data: "vin",
                                //                             name: "VIN",
                                //                             minDevice: CommonConstants.DEVICE.NONE
                                //                         },
                                //                         {
                                //                             data: "engineNumber",
                                //                             name: t("common.text.engineNumber"),
                                //                             minDevice: CommonConstants.DEVICE.NONE,
                                //                         },
                                //                     ]}

                                //                     dataTotal={vehicleDataTotalTable}
                                //                     onRender={(page, length, search) => { getVehicle(residentView.id, page = page, length = length, search = search); }}
                                //                     loadingFlag={vehicleTableLoadingFlag}
                                //                 />
                                //             </div>
                                //         )
                                //     }
                                // }
                            ]}
                        />
                    </div>
                </div>
            </Modal>
            <Dialog id="dialog_database" type={dialog.type} message={dialog.message} onConfirm={dialog.onConfirm} />
            <Toast id="toast_database" type={toast.type} message={toast.message} />
            <div className="row"><h3><span className="bi-puzzle">&nbsp;{t("common.menu.database")}</span></h3></div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Table
                                labelNewButton={t("common.button.createNew")}
                                onNewButtonClick={() => entryDatabase(false)}

                                bulkOptionLoadingFlag={databaseBulkOptionLoadingFlag}
                                bulkOptionArray={[
                                    {
                                        label: t("common.button.delete"),
                                        icon: "bi-trash",
                                        onClick: () => confirmDeleteDatabase(),
                                    }
                                ]}

                                dataArray={databaseArray}
                                columns={[
                                    {
                                        data: "code",
                                        name: t("common.text.code"),
                                        class: "text-nowrap",
                                        orderable: true,
                                        minDevice: CommonConstants.DEVICE.MOBILE,
                                    },
                                    {
                                        data: "databaseConnection",
                                        name: t("common.text.description"),
                                        class: "text-nowrap",
                                        minDevice: CommonConstants.DEVICE.TABLET,
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
                                                        label={t("common.button.connect")}
                                                        onClick={() => connectDatabase(row)}
                                                        className="btn-primary"
                                                        icon="bi-plugin"
                                                        loadingFlag={databaseOptionColumnTable[data]?.connectedButtonFlag}
                                                    />
                                                    <Button
                                                        label={t("common.button.view")}
                                                        onClick={() => viewDatabase(data)}
                                                        className="btn-primary"
                                                        icon="bi-list-ul"
                                                        loadingFlag={databaseOptionColumnTable[data]?.viewedButtonFlag}
                                                    />
                                                    <Button
                                                        label={t("common.button.delete")}
                                                        onClick={() => confirmDeleteDatabase(data, row.name)}
                                                        className="btn-danger"
                                                        icon="bi-trash"
                                                        loadingFlag={databaseOptionColumnTable[data]?.deletedButtonFlag}
                                                    />
                                                </>
                                            )
                                        }
                                    }
                                ]}
                                order={[[2, "desc"]]}

                                checkBoxArray={databaseCheckBoxTableArray}
                                onCheckBox={databaseCheckBoxTableArray => { setDatabaseCheckBoxTableArray([...databaseCheckBoxTableArray]) }}
                                dataTotal={databaseDataTotalTable}
                                filter={databaseFilterTable}
                                onRender={(page, length, search, order) => { getDatabase({ page: page, length: length, search: search, order: order }) }}
                                loadingFlag={databaseTableLoadingFlag}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}