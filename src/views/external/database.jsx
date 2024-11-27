import { useState, useEffect, useRef } from "react"
import { apiRequest } from "../../api"
import { Chart } from "react-chartjs-2"
import 'chart.js/auto'
import * as CommonConstants from "../../constants/commonConstants"
import * as DateHelper from "../../function/dateHelper"
import * as ToastHelper from "../../function/toastHelper"
import * as ModalHelper from "../../function/modalHelper"
import * as CommonHelper from "../../function/commonHelper"
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
import InputDecimal from "../../components/form/inputDecimal"
import Radio from "../../components/form/radio"
import Select from "../../components/form/select"

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
    const [queryExactIdentity, setQueryExactIdentity] = useState("-")

    const databaseQueryExportInitial = {
        formatId: 1,
        headerFlag: 1,
        delimiter: ",",
        insertFlag: 1,
        includeColumnNameFlag: 1,
        numberOfLinePerAction: 1,
        multipleLineFlag: 0,
        firstAmountConditioned: 1,
        firstAmountCombined: 0,
        saveAs: 1,
    }

    const FORMAT = {
        SQL: 1,
        XLS: 2,
        CSV: 3,
        JSON: 4,
        XML: 5,
    }

    const queryExportFormatMap = [{ "key": 1, "value": "SQL" }, { "key": 2, "value": "XLS" }, { "key": 3, "value": "CSV" }, { "key": 4, "value": "JSON" }, { "key": 5, "value": "XML" }]
    const yesNoMap = [{ "key": 1, "value": t("common.text.yes") }, { "key": 0, "value": t("common.text.no") }]
    const insertMap = [{ "key": 1, "value": "INSERT" }, { "key": 0, "value": "UPDATE" }]
    const saveAsMap = [{ "key": 1, "value": t("common.button.clipboard") }, { "key": 2, "value": t("common.button.file") }]

    const [databaseConnectionTitleModal, setDatabaseConnectionTitleModal] = useState(undefined)
    const connectDatabase = async (row) => {
        setDatabaseOptionColumnTable({ ...databaseOptionColumnTable, [row.id]: { connectedButtonFlag: true } })
        try {
            const json = await apiRequest(CommonConstants.METHOD.GET, `/external/${row.id}/test-connetion-database.json`)

            if (json.data.status === "success") {
                setDatabaseId(row.id)
                setDatabaseConnectionTitleModal(`${row.code} | ${row.databaseConnection}`)
                setDatabaseQueryManualValue("")
                setDatabaseQueryManualTableFlag(false)

                getDatabaseQueryObject(
                    row.id,
                    {
                        "page": 1,
                        "length": 10,
                        "search": "",
                        "order": ["object_id", "desc"],
                    }
                )

                getDatabaseQueryWhitelist(row.id, databaseQueryWhitelistAttributeTable)
                ModalHelper.show("modal_database_connection")
            } else {
                setToast({ type: json.data.status, message: json.data.message })
            }
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setDatabaseOptionColumnTable({ ...databaseOptionColumnTable, [row.id]: { connectedButtonFlag: false } })
        }
    }

    const [databaseQueryManualTableFlag, setDatabaseQueryManualTableFlag] = useState(false)
    const [databaseQueryManualDataArray, setDatabaseQueryManualDataArray] = useState([])
    const [databaseQueryManualColumn, setDatabaseQueryManualColumn] = useState([{
        data: "action",
        name: "Result Information",
        class: "text-nowrap"
    }])
    const [databaseQueryManualDataTotalTable, setDatabaseQueryManualDataTotalTable] = useState(0)
    const [databaseQueryManualTableLoadingFlag, setDatabaseQueryManualTableLoadingFlag] = useState(false)
    const [databaseQueryManualChartLoadingFlag, setDatabaseQueryManualChartLoadingFlag] = useState(false)

    const [databaseQueryManualValue, setDatabaseQueryManualValue] = useState()
    const [databaseQueryManualValueError, setDatabaseQueryManualValueError] = useState([])
    const [databaseQueryManualButtonFlag, setDatabaseQueryManualButtonFlag] = useState(false)

    const onDatabaseQueryManualValueChange = (e) => {
        const { name, value } = e.target
        setDatabaseQueryManualValue(value)
        setDatabaseQueryManualValueError(undefined)
    }

    const onDatabaseQueryManualValueKeyDown = (e) => {
        if (e.ctrlKey && 13 === e.which && !databaseQueryManualButtonFlag) {
            runDatabaseQueryManual()
        }
    }

    const runDatabaseQueryManual = async (e) => {
        setDatabaseQueryManualButtonFlag(true)
        try {
            const json = await apiRequest(CommonConstants.METHOD.PATCH, `/external/${databaseId}/query-manual-database.json`, JSON.stringify({ query: databaseQueryManualValue }))

            if (json.data.status === "success") {
                setDatabaseQueryManualTableFlag(true)

                setDatabaseQueryManualColumn(
                    json.data.data.header.map(element => {
                        if (element.type !== undefined) {
                            return {
                                data: element.name,
                                name: `${element.name} (${element.type})`,
                                type: element.type,
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

                if (json.data.data.queryManualId !== undefined) {
                    setQueryManualId(json.data.data.queryManualId)
                    getDatabaseQueryManual({ id: json.data.data.queryManualId, page: 1, length: 10 })
                } else {
                    setDatabaseQueryManualDataArray(json.data.data.result)
                }
            }
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setDatabaseQueryManualButtonFlag(false)
        }
    }

    const getDatabaseQueryManual = async (options) => {
        setDatabaseQueryManualTableLoadingFlag(true)

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
            }

            const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${options.id}/query-manual-database.json`, params)
            const json = response.data
            setDatabaseQueryManualDataArray(json.data)
            setDatabaseQueryManualDataTotalTable(json.recordsTotal)
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setDatabaseQueryManualTableLoadingFlag(false)
        }
    }

    const [databaseQueryObjectDataArray, setDatabaseQueryObjectDataArray] = useState([])
    const [databaseQueryObjectOptionColumnTable, setDatabaseQueryObjectOptionColumnTable] = useState([])
    const [databaseQueryObjectDataTotalTable, setDatabaseQueryObjectDataTotalTable] = useState(0)
    const [databaseQueryObjectTableLoadingFlag, setDatabaseQueryObjectTableLoadingFlag] = useState(false)

    const getDatabaseQueryObject = async (databaseId, options) => {
        setDatabaseQueryObjectTableLoadingFlag(true)

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
                "search": encodeURIComponent(options.search),
                "orderColumn": options.order.length > 1 ? options.order[0] : null,
                "orderDir": options.order.length > 1 ? options.order[1] : null,
            }

            if (databaseId > 0) {
                const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${databaseId}/query-object-database.json`, params)
                const json = response.data
                setDatabaseQueryObjectDataArray(json.data)
                setDatabaseQueryObjectDataTotalTable(json.recordsTotal)
                setDatabaseQueryObjectOptionColumnTable(
                    json.data.reduce(function (map, obj) {
                        map[obj.id] = { "definitionViewedButtonFlag": false, "dataViewedButtonFlag": false }
                        return map
                    }, {})
                )
            }
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setDatabaseQueryObjectTableLoadingFlag(false)
        }
    }

    const databaseQueryWhitelistInitial = {
        description: undefined,
    }
    const [databaseQueryWhitelistForm, setDatabaseQueryWhitelistForm] = useState(databaseQueryWhitelistInitial)
    const [databaseQueryWhitelistFormError, setDatabaseQueryWhitelistFormError] = useState([])

    const onDatabaseQueryWhitelistFormChange = (e) => {
        const { name, value } = e.target
        setDatabaseQueryWhitelistForm({ ...databaseQueryWhitelistForm, [name]: value })
        setDatabaseQueryWhitelistFormError({ ...databaseQueryWhitelistFormError, [name]: undefined })
    }

    const databaseQueryWhitelistValidate = (data) => {
        const error = {}
        if (!data.description?.trim()) error.description = t("validate.text.required", { name: t("common.text.description") })
        setDatabaseQueryWhitelistFormError(error)
        return Object.keys(error).length === 0
    }

    const [databaseQueryWhitelistSubmitLoadingFlag, setDatabaseQueryWhitelistSubmitLoadingFlag] = useState(false)
    const [databaseQueryWhitelistDataArray, setDatabaseQueryWhitelistDataArray] = useState([])
    const [databaseQueryWhitelistOptionColumnTable, setDatabaseQueryWhitelistOptionColumnTable] = useState([])
    const [databaseQueryWhitelistAttributeTable, setDatabaseQueryWhitelistAttributeTable] = useState()
    const [databaseQueryWhitelistDataTotalTable, setDatabaseQueryWhitelistDataTotalTable] = useState(0)
    const [databaseQueryWhitelistTableLoadingFlag, setDatabaseQueryWhitelistTableLoadingFlag] = useState(false)

    const getDatabaseQueryWhitelist = async (databaseId, options) => {
        setDatabaseQueryWhitelistTableLoadingFlag(true)

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
                "search": encodeURIComponent(options.search),
                "orderColumn": options.order.length > 1 ? options.order[0] : null,
                "orderDir": options.order.length > 1 ? options.order[1] : null,
            }
            setDatabaseQueryWhitelistAttributeTable(options)

            if (databaseId > 0) {
                const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${databaseId}/query-whitelist-database.json`, params)
                const json = response.data
                setDatabaseQueryWhitelistDataArray(json.data)
                setDatabaseQueryWhitelistDataTotalTable(json.recordsTotal)
                setDatabaseQueryWhitelistOptionColumnTable(
                    json.data.reduce(function (map, obj) {
                        map[obj.id] = { "definitionViewedButtonFlag": false, "dataViewedButtonFlag": false }
                        return map
                    }, {})
                )
            }
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setDatabaseQueryWhitelistTableLoadingFlag(false)
        }
    }

    const entryDatabaseQueryWhitelist = () => {
        setDatabaseQueryWhitelistFormError([])
        setDatabaseQueryWhitelistForm(databaseQueryWhitelistInitial)
        ModalHelper.show("modal_database_query_whitelist")
    }

    const confirmStoreDatabaseQueryWhitelist = () => {
        if (databaseQueryWhitelistValidate(databaseQueryWhitelistForm)) {
            setDialog({
                message: t("common.confirmation.create", { name: databaseQueryWhitelistForm.description }),
                type: "confirmation",
                onConfirm: (e) => storeDatabaseQueryWhitelist(e),
            })
        }
    }

    const storeDatabaseQueryWhitelist = async () => {
        if (databaseQueryWhitelistValidate(databaseQueryWhitelistForm)) {
            ModalHelper.hide("dialog_database")
            setDatabaseQueryWhitelistSubmitLoadingFlag(true)

            try {
                const data = databaseQueryWhitelistForm
                data.queryManualId = queryManualId
                const json = await apiRequest(CommonConstants.METHOD.POST, '/external/query-whitelist-database.json', JSON.stringify(data))

                if (json.data.status === "success") {
                    getDatabaseQueryWhitelist(databaseId, databaseQueryWhitelistAttributeTable)
                    ModalHelper.hide("modal_database_query_whitelist")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setDatabaseQueryWhitelistFormError(error.response.data)
            } finally {
                setDatabaseQueryWhitelistSubmitLoadingFlag(false)
            }
        }
    }

    const confirmDeleteDatabaseQueryWhitelist = (id, name) => {
        if (id !== undefined) {
            setDialog({
                message: t("common.confirmation.delete", { name: name }),
                type: "warning",
                onConfirm: () => deleteDatabaseQueryWhitelist(id),
            })
        } else {
            if (databaseQueryWhitelistCheckBoxTableArray.length > 0) {
                setDialog({
                    message: t("common.confirmation.delete", { name: t("common.text.amountItem", { amount: databaseQueryWhitelistCheckBoxTableArray.length }) }),
                    type: "warning",
                    onConfirm: () => deleteDatabaseQueryWhitelist(),
                })
            } else {
                setDialog({
                    message: t("validate.text.pleaseTickAtLeastAnItem"),
                    type: "alert"
                })
            }
        }
    }

    const deleteDatabaseQueryWhitelist = async (id) => {
        ModalHelper.hide("dialog_database")
        if (id !== undefined) {
            setDatabaseQueryWhitelistOptionColumnTable({ ...databaseQueryWhitelistOptionColumnTable, [id]: { deletedButtonFlag: true } })
        } else {
            setDatabaseQueryWhitelistBulkOptionLoadingFlag(true)
        }

        try {
            const json = await apiRequest(CommonConstants.METHOD.DELETE, `/external/${id !== undefined ? id : databaseQueryWhitelistCheckBoxTableArray.join("")}/${databaseId}/query-whitelist-database.json`)
            if (json.data.status === "success") {
                getDatabaseQueryWhitelist(databaseId, databaseQueryWhitelistAttributeTable)
                if (id === undefined) {
                    setDatabaseQueryWhitelistCheckBoxTableArray([])
                }
            }
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            if (id !== undefined) {
                setDatabaseQueryWhitelistOptionColumnTable({ ...databaseQueryWhitelistOptionColumnTable, [id]: { deletedButtonFlag: false } })
            } else {
                setDatabaseQueryWhitelistBulkOptionLoadingFlag(false)
            }
        }
    }

    const [databaseExactTitleModal, setDatabaseExactTitleModal] = useState(undefined)
    const [databaseQueryExactDataArray, setDatabaseQueryExactDataArray] = useState([])
    const [databaseQueryExactColumn, setDatabaseQueryExactColumn] = useState([])
    const [databaseQueryExactDataTotalTable, setDatabaseQueryExactDataTotalTable] = useState(0)
    const [databaseQueryExactTableLoadingFlag, setDatabaseQueryExactTableLoadingFlag] = useState(false)
    const [databaseQueryExactChartLoadingFlag, setDatabaseQueryExactChartLoadingFlag] = useState(false)

    const viewDataQueryExact = async (id, name) => {
        if (typeof id === "string") {
            setDatabaseQueryObjectOptionColumnTable({ databaseQueryObjectOptionColumnTable, [id]: { dataViewedButtonFlag: true } })
        } else {
            setDatabaseQueryWhitelistOptionColumnTable({ databaseQueryWhitelistOptionColumnTable, [id]: { dataViewedButtonFlag: true } })
        }

        try {
            setQueryExactIdentity(id)
            setDatabaseExactTitleModal(`${databaseConnectionTitleModal} | ${name ?? id}`)
            const json = await apiRequest(CommonConstants.METHOD.PATCH, `/external/${databaseId}/${id}/query-exact-data-database.json`)
            if (json.data.status === "success") {
                setDatabaseQueryExactColumn(
                    json.data.data.header.map(element => {
                        return {
                            data: element.name,
                            name: `${element.name} (${element.type})`,
                            type: element.type,
                            class: "text-nowrap",
                            defaultContent: () => { return <i>NULL</i> }
                        }
                    })
                )

                getDatabaseQueryExactData({ id: id, page: 1, length: 10 })
            }

            ModalHelper.show("modal_database_exact")
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            if (typeof id === "string") {
                setDatabaseQueryObjectOptionColumnTable({ databaseQueryObjectOptionColumnTable, [id]: { dataViewedButtonFlag: false } })
            } else {
                setDatabaseQueryWhitelistOptionColumnTable({ databaseQueryWhitelistOptionColumnTable, [id]: { dataViewedButtonFlag: false } })
            }
        }
    }

    const getDatabaseQueryExactData = async (options) => {
        if (databaseId > 0) {
            setDatabaseQueryExactTableLoadingFlag(true)

            try {
                const params = {
                    "start": (options.page - 1) * options.length,
                    "length": options.length,
                }

                const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${databaseId}/${options.id}/query-exact-data-database.json`, params)
                const json = response.data
                setDatabaseQueryExactDataArray(json.data)
                setDatabaseQueryExactDataTotalTable(json.recordsTotal)
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
            } finally {
                setDatabaseQueryExactTableLoadingFlag(false)
            }
        }
    }

    const [databaseQueryExportLoadingFlag, setDatabaseQueryExportLoadingFlag] = useState(false)

    const databaseQueryExportConditionForm = {
        headerFlag: () => { return FORMAT.CSV === databaseQueryExportForm.formatId },
        delimiter: () => { return FORMAT.CSV === databaseQueryExportForm.formatId },
        insertFlag: () => { return FORMAT.SQL === databaseQueryExportForm.formatId },
        includeColumnNameFlag: () => {
            return FORMAT.SQL === databaseQueryExportForm.formatId
                && CommonConstants.FLAG.YES === databaseQueryExportForm.insertFlag
        },
        numberOfLinePerAction: () => {
            return FORMAT.SQL === databaseQueryExportForm.formatId
                && CommonConstants.FLAG.YES === databaseQueryExportForm.insertFlag
        },
        multipleLineFlag: () => {
            return FORMAT.SQL === databaseQueryExportForm.formatId
                && CommonConstants.FLAG.NO === databaseQueryExportForm.insertFlag
        },
        firstAmountConditioned: () => {
            return FORMAT.SQL === databaseQueryExportForm.formatId
                && CommonConstants.FLAG.NO === databaseQueryExportForm.insertFlag
        },
        firstAmountCombined: () => { return FORMAT.XLS === databaseQueryExportForm.formatId },
        saveAs: () => { return [FORMAT.SQL, FORMAT.CSV, FORMAT.JSON, FORMAT.XML].includes(databaseQueryExportForm.formatId) },
    }

    const [databaseQueryExportForm, setDatabaseQueryExportForm] = useState(databaseQueryExportInitial)
    const [databaseQueryExportFormError, setDatabaseQueryExportFormError] = useState([])

    const onDatabaseQueryExportFormChange = (e) => {
        const { name, value } = e.target
        setDatabaseQueryExportForm({ ...databaseQueryExportForm, [name]: value })
        setDatabaseQueryExportFormError({ ...databaseQueryExportFormError, [name]: undefined })
    }

    const databaseQueryExportValidate = (data) => {
        const error = {}
        if (data.formatId <= 0) error.formatId = t("validate.text.required", { name: t("common.text.format") })
        if (databaseQueryExportConditionForm.headerFlag() && data.headerFlag < 0) error.headerFlag = t("validate.text.required", { name: t("common.text.header") })
        if (databaseQueryExportConditionForm.delimiter() && !data.delimiter.trim()) error.delimiter = t("validate.text.required", { name: t("common.text.delimiter") })
        if (databaseQueryExportConditionForm.insertFlag() && data.insertFlag < 0) error.insertFlag = t("validate.text.required", { name: t("common.text.statement") })
        if (databaseQueryExportConditionForm.includeColumnNameFlag() && data.includeColumnNameFlag < 0) error.includeColumnNameFlag = t("validate.text.required", { name: t("common.text.includeColumnName") })
        if (databaseQueryExportConditionForm.numberOfLinePerAction() && data.numberOfLinePerAction <= 0) error.numberOfLinePerAction = t("validate.text.required", { name: t("common.text.numberOfLinePerAction") })
        if (databaseQueryExportConditionForm.firstAmountConditioned() && data.firstAmountConditioned <= 0) error.firstAmountConditioned = t("validate.text.required", { name: t("common.text.firstAmountConditioned") })
        if (databaseQueryExportConditionForm.firstAmountConditioned() && data.firstAmountCombined < 0) error.firstAmountCombined = t("validate.text.required", { name: t("common.text.firstAmountCombined") })
        if (databaseQueryExportConditionForm.saveAs() && data.saveAs <= 0) error.saveAs = t("validate.text.required", { name: t("common.text.saveAs") })

        setDatabaseQueryExportFormError(error)
        return Object.keys(error).length === 0
    }

    const viewDatabaseQueryExport = () => {
        setDatabaseQueryExportForm(databaseQueryExportInitial)
        ModalHelper.show("modal_database_query_export")
    }

    const confirmExportDatabaseQuery = () => {
        if (databaseQueryExportValidate(databaseQueryExportForm)) {
            setDialog({
                message: t("common.confirmation.export", { name: queryExportFormatMap.find(item => item.key === databaseQueryExportForm.formatId).value }),
                type: "confirmation",
                onConfirm: async (e) => {
                    ModalHelper.hide("dialog_database")
                    setDatabaseQueryExportLoadingFlag(true)

                    let url = ""

                    if (FORMAT.SQL === databaseQueryExportForm.formatId) {
                        if (CommonConstants.FLAG.YES === databaseQueryExportForm.insertFlag) {
                            url = `/external/${databaseId}/1/${queryManualId}/insert/${databaseQueryExportForm.includeColumnNameFlag}/${databaseQueryExportForm.numberOfLinePerAction}/database-query-sql.json`
                        } else {
                            url = `/external/${databaseId}/1/${queryManualId}/update/${databaseQueryExportForm.multipleLineFlag}/${databaseQueryExportForm.firstAmountConditioned}/database-query-sql.json`
                        }
                    } else if (FORMAT.CSV === databaseQueryExportForm.formatId) {
                        url = `/external/${databaseId}/1/${queryManualId}/${databaseQueryExportForm.headerFlag}/${databaseQueryExportForm.delimiter}/database-query-csv.json`
                    } else if (FORMAT.JSON === databaseQueryExportForm.formatId) {
                        url = `/external/${databaseId}/1/${queryManualId}/database-query-json.json`
                    } else if (FORMAT.XML === databaseQueryExportForm.formatId) {
                        url = `/external/${databaseId}/1/${queryManualId}/database-query-xml.json`
                    }

                    try {
                        const json = await apiRequest(CommonConstants.METHOD.GET, url)

                        if (json.data.status === "success") {
                            if (databaseQueryExportForm.saveAs === 1) {
                                await navigator.clipboard.writeText(json.data.data)
                                setToast({ type: json.data.status, message: "common.information.exported" })
                            } else {
                                const nameArray = [...databaseQueryManualValue.matchAll(new RegExp("FROM (\\w+)", "gmi"))];
                                const name = nameArray.length > 0 && nameArray[0].length > 0 && nameArray[0][0].toLowerCase().startsWith("from ") ? nameArray[0][0].substr(5).trim() : "manual";
                                CommonHelper.downloadFile(`${name}@${DateHelper.formatDate(new Date(), "yyyyMMddHHmmss")}.${queryExportFormatMap.find(item => item.key === databaseQueryExportForm.formatId).value.toLowerCase()}`, [json.data.data])
                            }
                            ModalHelper.hide("modal_database_query_export")
                        } else {
                            setToast({ type: json.data.status, message: json.data.message })
                        }
                    } catch (error) {
                        setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                    } finally {
                        setDatabaseQueryExportLoadingFlag(false)
                    }
                },
            })
        }
    }

    const [chartTypeValue, setChartTypeValue] = useState("line")
    const [chartTypeMap, setChartTypeMap] = useState([])
    // const chartTypeMap = [
    //     { "key": "line", "value": "Line" },
    //     { "key": "bar", "value": "Bar" },
    //     { "key": "bubble", "value": "Bubble" },
    //     { "key": "doughnut", "value": "Doughnut" },
    //     { "key": "pie", "value": "Pie" },
    //     { "key": "polarArea", "value": "Polar" },
    //     { "key": "radar", "value": "Radar" },
    //     { "key": "scatter", "value": "Scatter" },
    // ]

    const chartRef = useRef(null);
    const [canvasLabelArray, setCanvasLabelArray] = useState([])
    const [canvasDatasetCommonArray, setCanvasDatasetCommonArray] = useState([])
    const [canvasDatasetBubbleArray, setCanvasDatasetBubbleArray] = useState([])
    const [canvasOptionArray, setCanvasOptionArray] = useState([])
    const [databaseQueryType, setDatabaseQueryType] = useState()

    const selectAll = async () => {
        const chart = chartRef.current;

        if (chart) {
            await chart.data.datasets.forEach((item) => {
                // item._meta[externalDatabase.variable.index_chart_meta].hidden = true
                item.hidden = false
            })
            chart.update();
        }
    }

    const deselectAll = async () => {
        const chart = chartRef.current;

        if (chart) {
            await chart.data.datasets.forEach((item) => {
                item.hidden = true
            })
            chart.update();
        }
    }

    const getDatabaseQueryChart = async (databaseQueryType) => {
        if (databaseId > 0) {
            setDatabaseQueryType(databaseQueryType)
            setChartTypeValue("line")

            if ("manual" === databaseQueryType) {
                setDatabaseQueryManualChartLoadingFlag(true)
            } else {
                setDatabaseQueryExactChartLoadingFlag(true)
            }

            try {
                const params = {
                    "start": 0,
                    "length": -1,
                }

                let response = null
                if ("manual" === databaseQueryType) {
                    response = await apiRequest(CommonConstants.METHOD.GET, `/external/${queryManualId}/query-manual-database.json`, params)
                } else {
                    response = await apiRequest(CommonConstants.METHOD.GET, `/external/${databaseId}/${queryExactIdentity}/query-exact-data-database.json`, params)
                }

                const json = response.data

                const column = "manual" === databaseQueryType ? databaseQueryManualColumn : databaseQueryExactColumn

                const labelArray = [...new Set(json.data.map(item => item[column[0].data] ?? "NULL"))]
                let datasetArray = new Array()

                let dataArray
                let object

                let chartTypeArray = new Array()
                chartTypeArray.push({ "key": "line", "value": "Line" })
                chartTypeArray.push({ "key": "bar", "value": "Bar" })
                //for integer content
                for (let i = 1; i < column.length; i++) {
                    if (/.*(int|number|numeric).*$/.test(column[i].type.toLowerCase())) {
                        object = new Object()
                        object.hidden = false
                        object.label = column[i].data
                        // object.tension = 0.4

                        dataArray = new Array()
                        for (let j = 0; j < labelArray.length; j++) {
                            dataArray.push(
                                json.data.reduce(function (sum, item) {
                                    if ((item[column[0].data] ?? "NULL") === labelArray[j]) {
                                        return sum + item[column[i].data]
                                    } else {
                                        return sum
                                    }
                                }, 0)
                            )
                        }
                        object.data = dataArray
                        datasetArray.push(object)
                    }
                }

                let bubbleArray = []
                if (datasetArray.length > 0) {
                    if (/.*(int|number|numeric).*$/.test(column[0].type.toLowerCase())) {
                        if (column.length === 2) {
                            // Untuk satu Category, x memakai int
                            console.log("Line, Bar, scatter")
                            chartTypeArray.push({ "key": "scatter", "value": "Scatter" })
                        } else {
                            // Untuk banyak Category, x memakai int
                            console.log("Line, Bar, bubble, Radar,")
                            chartTypeArray.push({ "key": "bubble", "value": "Bubble" })
                            chartTypeArray.push({ "key": "radar", "value": "Radar" })
                            let bubble = []
                            for (let i = 0; i < labelArray.length; i++) {
                                bubble.push({
                                    x: labelArray[i],
                                    y: datasetArray[0].data[i],
                                    r: datasetArray[1].data[i],
                                })
                            }

                            bubbleArray.push({
                                label: datasetArray[0].label,
                                data: bubble
                            })
                        }
                    } else {
                        if (column.length === 2) {
                            // Untuk satu Category, x memakai string
                            console.log("Line, Bar, Donat, Pie, Polar, Radar")
                            chartTypeArray.push({ "key": "doughnut", "value": "Doughnut" })
                            chartTypeArray.push({ "key": "pie", "value": "Pie" })
                            chartTypeArray.push({ "key": "polarArea", "value": "Polar" })
                        } else {
                            // Untuk banyak Category, x memakai string
                            console.log("Line, Bar, Radar,")
                        }
                        chartTypeArray.push({ "key": "radar", "value": "Radar" })
                    }
                }

                if (datasetArray.length === 0) {
                    if (
                        column.length > 1
                        && /.*(int|number|numeric).*$/.test(column[1].type.toLowerCase()) === false
                    ) {
                        // Untuk satu Category, y memakai string
                        console.log("Line, Bar")
                        const secondLabelArray = [...new Set(json.data.map(item => item[column[1].data] ?? "NULL"))]
                        for (let i = 0; i < secondLabelArray.length; i++) {
                            object = new Object()
                            object.hidden = false
                            object.label = secondLabelArray[i]
                            // object.tension = 0.4

                            dataArray = new Array()
                            for (let j = 0; j < labelArray.length; j++) {
                                dataArray.push(
                                    json.data.reduce(function (sum, item) {
                                        if (
                                            (item[column[0].data] ?? "NULL") === labelArray[j]
                                            && (item[column[1].data] ?? "NULL") === secondLabelArray[i]
                                        ) {
                                            return sum + 1
                                        } else {
                                            return sum
                                        }
                                    }, 0)
                                )
                            }

                            object.data = dataArray
                            datasetArray.push(object)
                        }

                        //for 2 column without integer
                    } else {
                        // Untuk satu Category, tanpa y
                        console.log("Line, Bar")

                        object = new Object()
                        object.hidden = false
                        object.label = t("common.text.amount")
                        // object.tension = 0.4
                        dataArray = new Array()
                        for (let j = 0; j < labelArray.length; j++) {
                            dataArray.push(
                                json.data.reduce(function (sum, item) {
                                    if ((item[column[0].data] ?? "NULL") === labelArray[j]) {
                                        return sum + 1
                                    } else {
                                        return sum
                                    }
                                }, 0)
                            )
                        }
                        object.data = dataArray
                        datasetArray.push(object)
                    }
                }

                setChartTypeMap(chartTypeArray)
                setCanvasLabelArray(labelArray)
                setCanvasDatasetCommonArray(datasetArray)
                setCanvasDatasetBubbleArray(bubbleArray)

                let optionArray = {
                    maintainAspectRatio: false,
                    responsive: true
                }

                if (datasetArray.length === 1) {
                    optionArray = {
                        ...optionArray,
                        plugins: {
                            legend: {
                                display: false // Hides the legend
                            }
                        },
                        scales: {
                            x: {
                                // type: 'linear',
                                // beginAtZero: true,
                                stacked: false,
                                title: {
                                    display: true,
                                    text: column[0].data,
                                    font: {
                                        size: 20,
                                    },
                                }
                            },
                            y: {
                                // beginAtZero: true,
                                stacked: false,
                                title: {
                                    display: true,
                                    text: datasetArray[0].label,
                                    font: {
                                        size: 20,
                                    }
                                }
                            }
                        }
                    }
                } else {
                    optionArray = {
                        ...optionArray,
                        scales: {
                            x: {
                                stacked: false,
                                title: {
                                    display: true,
                                    text: column[0].data,
                                    font: {
                                        size: 20,
                                    },
                                }
                            }
                        }
                    }
                }

                setCanvasOptionArray(optionArray)

                ModalHelper.show("modal_database_query_chart")
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
            } finally {
                if ("manual" === databaseQueryType) {
                    setDatabaseQueryManualChartLoadingFlag(false)
                } else {
                    setDatabaseQueryExactChartLoadingFlag(false)
                }
            }
        }
    }

    const onChartTypeChange = (e) => {
        setChartTypeValue(e.target.value)
        let optionArray = {
            maintainAspectRatio: false,
            responsive: true
        }

        if (/(bar|line|scatter)$/.test(e.target.value)) {
            if (canvasDatasetCommonArray.length === 1) {
                optionArray = {
                    ...optionArray,
                    plugins: {
                        legend: {
                            display: false
                        }
                    },
                    scales: {
                        x: {
                            // type: 'linear',
                            // beginAtZero: true,
                            stacked: false,
                            title: {
                                display: true,
                                text: "manual" === databaseQueryType ? databaseQueryManualColumn[0].data : databaseQueryExactColumn[0].data,
                                font: {
                                    size: 20,
                                },
                            }
                        },
                        y: {
                            // beginAtZero: true,
                            stacked: false,
                            title: {
                                display: true,
                                text: canvasDatasetCommonArray[0].label,
                                font: {
                                    size: 20,
                                }
                            }
                        }
                    }
                }
            } else {
                optionArray = {
                    ...optionArray,
                    scales: {
                        x: {
                            stacked: false,
                            title: {
                                display: true,
                                text: "manual" === databaseQueryType ? databaseQueryManualColumn[0].data : databaseQueryExactColumn[0].data,
                                font: {
                                    size: 20,
                                },
                            }
                        }
                    }
                }
            }
        } else if (/(polarArea)$/.test(e.target.value)) {
            optionArray = {
                ...optionArray,
                scales: {
                    r: {
                        pointLabels: {
                            display: true,
                            centerPointLabels: true,
                            font: {
                                size: 18
                            }
                        }
                    }
                }
            }
        } else if (/(bubble)$/.test(e.target.value)) {
            optionArray = {
                ...optionArray,
                plugins: {
                    legend: {
                        display: false // Hides the legend
                    }
                },
                scales: {
                    x: {
                        stacked: false,
                        title: {
                            display: true,
                            text: "manual" === databaseQueryType ? databaseQueryManualColumn[0].data : databaseQueryExactColumn[0].data,
                            font: {
                                size: 20,
                            },
                        }
                    },
                    y: {
                        ticks: { beginAtZero: true },
                        stacked: false,
                        title: {
                            display: true,
                            text: canvasDatasetCommonArray[0].label,
                            font: {
                                size: 20,
                            }
                        }
                    }
                }
            }
        } else if (/(pie)$/.test(e.target.value)) {
            // optionArray = {
            //     ...optionArray,
            //     plugins: {
            //         tooltip: {
            //             callbacks: {
            //                 label: function (tooltipItem) {
            //                     console.log(tooltipItem)
            //                     const label = tooltipItem.label || '';
            //                     const value = tooltipItem.raw;
            //                     return `${label}: ${value}%`; // Custom label for tooltip
            //                 }
            //             }
            //         }
            //     }
            // }
        } else if (/(radar)$/.test(e.target.value)) {
            if (canvasDatasetCommonArray.length === 1) {
                optionArray = {
                    ...optionArray,
                    plugins: {
                        legend: {
                            display: false
                        },
                    },
                }
            }

            optionArray = {
                ...optionArray,
                scales: {
                    r: {
                        beginAtZero: true
                    }
                }
            }
        }

        setCanvasOptionArray(optionArray)
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
                                                                    onClick={(e) => runDatabaseQueryManual(e)}
                                                                    className="btn-primary"
                                                                    icon="bi-play-fill"
                                                                    loadingFlag={databaseQueryManualButtonFlag}
                                                                />
                                                            }
                                                            name="value" rows="3" value={databaseQueryManualValue} onChange={onDatabaseQueryManualValueChange} onKeyDown={onDatabaseQueryManualValueKeyDown} className="col-md-12 col-sm-12 col-xs-12" placeholder={t("common.text.onHere", { name: t("common.text.query") })} error={databaseQueryManualValueError}
                                                        />
                                                        <Table
                                                            showFlag={databaseQueryManualTableFlag}
                                                            additionalButtonArray={
                                                                databaseQueryManualColumn.length > 0 && databaseQueryManualColumn[0].name !== "Result Information"
                                                                    ? [
                                                                        {
                                                                            label: t("common.button.export"),
                                                                            onClick: () => viewDatabaseQueryExport(),
                                                                            icon: "bi-download",
                                                                        },
                                                                        {
                                                                            label: t("common.button.whitelist"),
                                                                            onClick: () => entryDatabaseQueryWhitelist(),
                                                                            icon: "bi-plus-circle-fill",
                                                                        },
                                                                        {
                                                                            label: t("common.button.chart"),
                                                                            onClick: () => getDatabaseQueryChart("manual"),
                                                                            icon: "bi-bar-chart-line-fill",
                                                                            loadingFlag: databaseQueryManualChartLoadingFlag
                                                                        }
                                                                    ]
                                                                    : []
                                                            }
                                                            lengthFlag={false}
                                                            searchFlag={false}
                                                            dataArray={databaseQueryManualDataArray ?? []}
                                                            columns={databaseQueryManualColumn}

                                                            dataTotal={databaseQueryManualColumn.length > 0 && databaseQueryManualColumn[0].name !== "Result Information" ? databaseQueryManualDataTotalTable : 0}
                                                            onRender={(page, length) => {
                                                                if (queryManualId > 0) {
                                                                    getDatabaseQueryManual({ id: queryManualId, page: page, length: length })
                                                                }
                                                            }}
                                                            loadingFlag={databaseQueryManualTableLoadingFlag}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                },
                                {
                                    "label": t("common.text.object"),
                                    "component": () => {
                                        return (
                                            <div className="row">
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <div className="row">
                                                        <Table
                                                            dataArray={databaseQueryObjectDataArray}
                                                            columns={[
                                                                {
                                                                    data: "object_id",
                                                                    name: t("common.text.id"),
                                                                    class: "text-nowrap",
                                                                    minDevice: CommonConstants.DEVICE.MOBILE,
                                                                },
                                                                {
                                                                    data: "object_name",
                                                                    name: t("common.text.name"),
                                                                    class: "text-nowrap",
                                                                    minDevice: CommonConstants.DEVICE.MOBILE
                                                                },
                                                                {
                                                                    data: "object_type",
                                                                    name: t("common.text.type"),
                                                                    class: "text-nowrap",
                                                                    minDevice: CommonConstants.DEVICE.TABLET
                                                                },
                                                                {
                                                                    data: "object_name",
                                                                    name: t("common.text.option"),
                                                                    class: "text-center",
                                                                    render: function (data) {
                                                                        return (
                                                                            <>
                                                                                <Button
                                                                                    label={t("common.button.definition")}
                                                                                    onClick={() => viewDefinitionQueryObject(data)}
                                                                                    className="btn-primary"
                                                                                    icon="bi-code-slash"
                                                                                    loadingFlag={databaseQueryObjectOptionColumnTable[data]?.definitionViewedButtonFlag}
                                                                                />
                                                                                <Button
                                                                                    label={t("common.button.data")}
                                                                                    onClick={() => viewDataQueryExact(data)}
                                                                                    className="btn-primary"
                                                                                    icon="bi-file-earmark-text"
                                                                                    loadingFlag={databaseQueryObjectOptionColumnTable[data]?.dataViewedButtonFlag}
                                                                                />
                                                                            </>
                                                                        )
                                                                    }
                                                                },
                                                            ]}
                                                            order={[[0, "desc"]]}

                                                            dataTotal={databaseQueryObjectDataTotalTable}
                                                            onRender={(page, length, search, order) => { getDatabaseQueryObject(databaseId, { page: page, length: length, search: search, order: order }) }}
                                                            loadingFlag={databaseQueryObjectTableLoadingFlag}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                },
                                {
                                    "label": t("common.text.whitelist"),
                                    "component": () => {
                                        return (
                                            <div className="row">
                                                <div className="col-md-12 col-sm-12 col-xs-12">
                                                    <div className="row">
                                                        <Table
                                                            dataArray={databaseQueryWhitelistDataArray}
                                                            columns={[
                                                                {
                                                                    data: "description",
                                                                    name: t("common.text.description"),
                                                                    class: "text-nowrap",
                                                                    minDevice: CommonConstants.DEVICE.MOBILE,
                                                                },
                                                                {
                                                                    data: "query",
                                                                    name: t("common.text.query"),
                                                                    class: "text-nowrap",
                                                                    minDevice: CommonConstants.DEVICE.TABLET,
                                                                },
                                                                {
                                                                    data: "createdDate",
                                                                    name: t("common.text.createdDate"),
                                                                    class: "text-nowrap",
                                                                    minDevice: CommonConstants.DEVICE.TABLET,
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
                                                                                    label={t("common.button.data")}
                                                                                    onClick={() => viewDataQueryExact(data, row.description)}
                                                                                    className="btn-primary"
                                                                                    icon="bi-file-earmark-text"
                                                                                    loadingFlag={databaseQueryWhitelistOptionColumnTable[data]?.dataViewedButtonFlag}
                                                                                />
                                                                                <Button
                                                                                    label={t("common.button.delete")}
                                                                                    onClick={() => confirmDeleteDatabaseQueryWhitelist(data, row.description)}
                                                                                    className="btn-danger"
                                                                                    icon="bi-trash"
                                                                                    loadingFlag={databaseQueryWhitelistOptionColumnTable[data]?.deletedButtonFlag}
                                                                                />
                                                                            </>
                                                                        )
                                                                    }
                                                                },
                                                            ]}
                                                            order={[[2, "desc"]]}

                                                            dataTotal={databaseQueryWhitelistDataTotalTable}
                                                            onRender={(page, length, search, order) => { getDatabaseQueryWhitelist(databaseId, { page: page, length: length, search: search, order: order }) }}
                                                            loadingFlag={databaseQueryWhitelistTableLoadingFlag}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    }
                                }
                            ]}
                        />
                    </div>
                </div>
            </Modal>
            <Modal
                id="modal_database_query_whitelist"
                size="xl"
                title={t("common.button.createNew")}
                buttonArray={
                    <Button
                        label={t("common.button.save")}
                        onClick={() => confirmStoreDatabaseQueryWhitelist()}
                        className="btn-primary"
                        icon="bi-bookmark"
                        loadingFlag={databaseQueryWhitelistSubmitLoadingFlag}
                    />
                }
            >
                <Textarea label={t("common.text.description")} name="description" rows="3" value={databaseQueryWhitelistForm.description} onChange={onDatabaseQueryWhitelistFormChange} className="col-md-12 col-sm-12 col-xs-12" error={databaseQueryWhitelistFormError.description} />
                <Textarea label={t("common.text.query")} rows="3" value={databaseQueryManualValue} disabled={true} className="col-md-12 col-sm-12 col-xs-12" />
            </Modal>
            <Modal
                id="modal_database_exact"
                size="xl"
                title={databaseExactTitleModal}
            >
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <div className="row">
                            <Table
                                additionalButtonArray={
                                    databaseQueryExactColumn.length > 1
                                        ? [
                                            {
                                                label: t("common.button.export"),
                                                onClick: () => viewDatabaseQueryExport(),
                                                icon: "bi-download",
                                            },
                                            {
                                                label: t("common.button.chart"),
                                                onClick: () => getDatabaseQueryChart("exact"),
                                                icon: "bi-bar-chart-line-fill",
                                                loadingFlag: databaseQueryExactChartLoadingFlag
                                            }
                                        ]
                                        : []
                                }
                                dataArray={databaseQueryExactDataArray ?? []}
                                columns={databaseQueryExactColumn}

                                dataTotal={databaseQueryExactDataTotalTable}
                                onRender={(page, length) => {
                                    getDatabaseQueryExactData({ id: queryExactIdentity, page: page, length: length })
                                }}
                                loadingFlag={databaseQueryExactTableLoadingFlag}
                            />
                        </div>
                    </div>
                </div>
            </Modal>
            <Modal
                id="modal_database_query_export"
                size="md"
                title={t("common.text.export")}
                buttonArray={
                    <>
                        <Button
                            label={t("common.button.export")}
                            onClick={() => confirmExportDatabaseQuery()}
                            className="btn-primary"
                            icon="bi-download"
                            loadingFlag={databaseQueryExportLoadingFlag}
                        />
                    </>
                }
            >
                <Radio label={t("common.text.format")} name="formatId" value={databaseQueryExportForm.formatId} map={queryExportFormatMap} onChange={onDatabaseQueryExportFormChange} className="col-12" error={databaseQueryExportFormError.formatId} />
                {
                    databaseQueryExportConditionForm.headerFlag()
                    && <Radio label={t("common.text.header")} name="headerFlag" value={databaseQueryExportForm.headerFlag} map={yesNoMap} onChange={onDatabaseQueryExportFormChange} className="col-12" error={databaseQueryExportFormError.headerFlag} />
                }
                {
                    databaseQueryExportConditionForm.delimiter()
                    && <InputText label={t("common.text.delimiter")} name="delimiter" value={databaseQueryExportForm.delimiter} onChange={onDatabaseQueryExportFormChange} className="col-12" error={databaseQueryExportFormError.delimiter} />
                }
                {
                    databaseQueryExportConditionForm.insertFlag()
                    && <Radio label={t("common.text.statement")} name="insertFlag" value={databaseQueryExportForm.insertFlag} map={insertMap} onChange={onDatabaseQueryExportFormChange} className="col-12" error={databaseQueryExportFormError.insertFlag} />
                }
                {
                    databaseQueryExportConditionForm.includeColumnNameFlag()
                    && <Radio label={t("common.text.includeColumnName")} name="includeColumnNameFlag" value={databaseQueryExportForm.includeColumnNameFlag} map={yesNoMap} onChange={onDatabaseQueryExportFormChange} className="col-12" error={databaseQueryExportFormError.includeColumnNameFlag} />
                }
                {
                    databaseQueryExportConditionForm.numberOfLinePerAction()
                    && <InputDecimal label={t("common.text.numberOfLinePerAction")} name="numberOfLinePerAction" value={databaseQueryExportForm.numberOfLinePerAction} onChange={onDatabaseQueryExportFormChange} className="col-12" error={databaseQueryExportFormError.numberOfLinePerAction} />
                }
                {
                    databaseQueryExportConditionForm.multipleLineFlag()
                    && <Radio label={t("common.text.multipleLine")} name="multipleLineFlag" value={databaseQueryExportForm.multipleLineFlag} map={yesNoMap} onChange={onDatabaseQueryExportFormChange} className="col-12" error={databaseQueryExportFormError.multipleLineFlag} />
                }
                {
                    databaseQueryExportConditionForm.firstAmountConditioned()
                    && <InputDecimal label={t("common.text.firstAmountConditioned")} name="firstAmountConditioned" value={databaseQueryExportForm.firstAmountConditioned} onChange={onDatabaseQueryExportFormChange} valueUnit={t("common.text.column")} className="col-12" error={databaseQueryExportFormError.firstAmountConditioned} />
                }
                {
                    databaseQueryExportConditionForm.firstAmountCombined()
                    && <InputDecimal label={t("common.text.firstAmountCombined")} name="firstAmountCombined" value={databaseQueryExportForm.firstAmountCombined} onChange={onDatabaseQueryExportFormChange} valueUnit={t("common.text.column")} className="col-12" error={databaseQueryExportFormError.firstAmountCombined} />
                }
                {
                    databaseQueryExportConditionForm.saveAs()
                    && <Radio label={t("common.text.saveAs")} name="saveAs" value={databaseQueryExportForm.saveAs} map={saveAsMap} onChange={onDatabaseQueryExportFormChange} className="col-12" error={databaseQueryExportFormError.multipleLineFlag} />
                }
            </Modal>
            <Modal
                id="modal_database_query_chart"
                size="xl"
                title={t("common.text.chart")}
            >
                <div className="row">
                    <div className="col-md-12 col-sm-12 col-xs-12">
                        <Select name="chartType" map={chartTypeMap} value={chartTypeValue} onChange={onChartTypeChange} className="col-md-3 col-sm-6 col-xs-12" />
                    </div>
                    <div className="col-md-12 col-sm-12 col-xs-12" style={{ height: `${window.innerHeight * 0.60}px` }}>
                        <div className="row" style={{ height: "100%" }}>
                            <Chart
                                ref={chartRef}
                                type={chartTypeValue}
                                data={{
                                    labels: canvasLabelArray,
                                    datasets: "bubble" === chartTypeValue ? canvasDatasetBubbleArray : canvasDatasetCommonArray
                                }}
                                options={canvasOptionArray}
                            />
                        </div>
                    </div>
                    {/* <Button
                        label={t("common.button.selectAll")}
                        className="btn-primary"
                        size="sm"
                        icon="bi-square"
                        onClick={() => { selectAll() }}
                    />
                    <Button
                        label={t("common.button.deselectAll")}
                        className="btn-primary"
                        size="sm"
                        icon="bi-square"
                        onClick={() => { deselectAll() }}
                    /> */}
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
                                        data: "description",
                                        name: t("common.text.description"),
                                        class: "text-nowrap",
                                        minDevice: CommonConstants.DEVICE.NONE,
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