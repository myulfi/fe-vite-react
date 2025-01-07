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
import InputFile from "../../components/form/inputFile"

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
    const [serverCurrentDirectory, setServerCurrentDirectory] = useState([])
    const [connectServerLoadingFlag, setConnectServerLoadingFlag] = useState(false)
    const [serverDirectoryTitleModal, setServerDirectoryTitleModal] = useState(false)
    const [serverDirectoryBulkOptionLoadingFlag, setServerDirectoryBulkOptionLoadingFlag] = useState(false)
    const [serverDirectoryClipboard, setServerDirectoryClipboard] = useState({})
    const [serverDirectoryCheckBoxTableArray, setServerDirectoryCheckBoxTableArray] = useState([])
    const [serverDirectoryOptionColumnTable, setServerDirectoryOptionColumnTable] = useState([])
    const [serverDirectoryAttributeTable, setServerDirectoryAttributeTable] = useState()
    const [serverDirectoryDataTotalTable, setServerDirectoryDataTotalTable] = useState(0)
    const [serverDirectoryResetPaginationTable, setServerDirectoryResetPaginationTable] = useState(true)
    const [serverDirectoryTableLoadingFlag, setServerDirectoryTableLoadingFlag] = useState(false)

    const [serverDirectoryDataArray, setServerDirectoryDataArray] = useState([])
    const [serverDirectoryFullDataArray, setServerDirectoryFullDataArray] = useState([])

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
                setServerCurrentDirectory(json.data.defaultDirectory.split("/"))
                getServerDirectory(id, { page: 1, length: 10, search: "", order: [], directory: json.data.defaultDirectory })
                getServerShortcut(id)
                setServerShortcutValue(0)
                setServerDirectoryClipboard({})
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

    const getServerShortcut = async (serverId) => {
        try {
            const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${serverId}/server-shortcut.json`)
            const json = response.data
            setServerShortcutMap(json.data.map((item) => {
                return {
                    key: item.id,
                    value: `${item.name} | ${item.directory}`
                }
            }))
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
            setServerShortcutMap([])
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
            setServerDirectoryFullDataArray(json.data.fileArray)
            setServerDirectoryDataArray(
                json.data.fileArray
                    .sort(
                        (left, right) => {
                            if (options.order.length > 1) {
                                if (typeof left[options.order[0]] === 'string' || typeof right[options.order[0]] === 'string') {
                                    return ("asc" === options.order[1] ? 1 : -1) * (left[options.order[0]].localeCompare(right[options.order[0]]))
                                } if (typeof left[options.order[0]] === 'number' || typeof right[options.order[0]] === 'number') {
                                    return ("asc" === options.order[1] ? 1 : -1) * (left[options.order[0]] - right[options.order[0]])
                                } else {
                                    return 0
                                }
                            } else {
                                return 0
                            }
                        }
                    )
                    .slice((options.page - 1) * options.length, ((options.page - 1) * options.length) + options.length)
            )
            console.log(options.page + "::" + options.length)
            setServerDirectoryDataTotalTable(json.data.fileArray.length)
            setServerDirectoryOptionColumnTable(
                json.data.fileArray.reduce(function (map, obj) {
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

    const getServerDirectoryRender = async (options) => {
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
            setServerDirectoryDataArray(
                serverDirectoryFullDataArray
                    .sort(
                        (left, right) => {
                            if (options.order.length > 1) {
                                if (typeof left[options.order[0]] === 'string' || typeof right[options.order[0]] === 'string') {
                                    return ("asc" === options.order[1] ? 1 : -1) * (left[options.order[0]].localeCompare(right[options.order[0]]))
                                } if (typeof left[options.order[0]] === 'number' || typeof right[options.order[0]] === 'number') {
                                    return ("asc" === options.order[1] ? 1 : -1) * (left[options.order[0]] - right[options.order[0]])
                                } else {
                                    return 0
                                }
                            } else {
                                return 0
                            }
                        }
                    )
                    .slice((options.page - 1) * options.length, ((options.page - 1) * options.length) + options.length)
            )
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setServerDirectoryTableLoadingFlag(false)
        }
    }

    const goToParent = () => {
        const options = serverDirectoryAttributeTable
        serverCurrentDirectory.pop()
        const nextDirectory = serverCurrentDirectory
        setServerCurrentDirectory(nextDirectory)
        options.directory = nextDirectory.join("/")

        setServerDirectoryCheckBoxTableArray([])
        const index = serverShortcutMap.findIndex((item) => item.value.endsWith(options.directory))
        setServerShortcutValue(index > -1 ? serverShortcutMap[index].key : 0)
        getServerDirectory(serverId, options)
    }

    const enterFolder = (name) => {
        const options = serverDirectoryAttributeTable
        const nextDirectory = [...serverCurrentDirectory, [name]]
        setServerCurrentDirectory(nextDirectory)
        options.directory = nextDirectory.join("/")

        setServerDirectoryCheckBoxTableArray([])
        const index = serverShortcutMap.findIndex((item) => item.value.endsWith(options.directory))
        setServerShortcutValue(index > -1 ? serverShortcutMap[index].key : 0)
        getServerDirectory(serverId, options)
    }

    const serverShortcutInitial = {
        name: undefined,
        directory: undefined
    }

    const [serverShortcutValue, setServerShortcutValue] = useState(0)
    const [serverShortcutMap, setServerShortcutMap] = useState([])

    const onServerShortcutValueChange = (e) => {
        const { value } = e.target
        setServerShortcutValue(value)

        const options = serverDirectoryAttributeTable
        const nextDirectory = serverShortcutMap.find((item) => item.key === value).value.split(" | ")[1]
        setServerCurrentDirectory(nextDirectory.split("/"))
        options.directory = nextDirectory
        getServerDirectory(serverId, options)
    }

    const [serverShortcutCreateLoadingFlag, setServerShortcutCreateLoadingFlag] = useState(false)

    const [serverShortcutForm, setServerShortcutForm] = useState(serverShortcutInitial)
    const [serverShortcutFormError, setServerShortcutFormError] = useState([])

    const onServerShortcutFormChange = (e) => {
        const { name, value } = e.target
        setServerShortcutForm({ ...serverShortcutForm, [name]: value })
        setServerShortcutFormError({ ...serverShortcutFormError, [name]: undefined })
    }

    const serverShortcutValidate = (data) => {
        const error = {}
        if (!data.name.trim()) error.name = t("validate.text.required", { name: t("common.text.name") })
        setServerDirectoryFormError(error)
        return Object.keys(error).length === 0
    }

    const entryServerShortcut = () => {
        setServerShortcutFormError([])
        setServerShortcutForm({ ...serverShortcutInitial, "directory": serverCurrentDirectory.join("/") })
        ModalHelper.show("modal_server_create_shortcut")
    }

    const confirmCreateServerShortcut = () => {
        if (serverShortcutValidate(serverShortcutForm)) {
            setDialog({
                message: t("common.confirmation.create", { name: serverShortcutForm.name }),
                type: "confirmation",
                onConfirm: (e) => createServerShortcut(e),
            })
        }
    }

    const createServerShortcut = async () => {
        if (serverShortcutValidate(serverShortcutForm)) {
            ModalHelper.hide("dialog_server")
            setServerShortcutCreateLoadingFlag(true)

            try {
                const json = await apiRequest(CommonConstants.METHOD.POST, `/external/${serverId}/server-shortcut.json`, JSON.stringify(serverShortcutForm))

                if (json.data.status === "success") {
                    getServerShortcut(serverId)
                    setServerShortcutValue(json.data.data.id)
                    ModalHelper.hide("modal_server_create_shortcut")
                }
                setToast({ type: json.data.status, message: "common.information.created" })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setServerShortcutFormError(error.response.data)
            } finally {
                setServerShortcutCreateLoadingFlag(false)
            }
        }
    }

    const confirmDeleteServerShortcut = (id) => {
        setDialog({
            message: t("common.confirmation.delete", { name: serverShortcutMap.find((item) => item.key === id).value }),
            type: "warning",
            onConfirm: () => deleteServerShortcut(id),
        })
    }

    const deleteServerShortcut = async (id) => {
        ModalHelper.hide("dialog_server")

        try {
            const json = await apiRequest(CommonConstants.METHOD.DELETE, `/external/${id}/server-shortcut.json`)
            if (json.data.status === "success") {
                getServerShortcut(serverId)
                setServerShortcutValue(0)
            }
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        }
    }

    const serverDirectoryInitial = {
        name: undefined,
        directory: undefined
    }

    const [serverDirectoryCreateLoadingFlag, setServerDirectoryCreateLoadingFlag] = useState(false)

    const [serverDirectoryForm, setServerDirectoryForm] = useState(serverDirectoryInitial)
    const [serverDirectoryFormError, setServerDirectoryFormError] = useState([])

    const onServerDirectoryFormChange = (e) => {
        const { name, value } = e.target
        setServerDirectoryForm({ ...serverDirectoryForm, [name]: value })
        setServerDirectoryFormError({ ...serverDirectoryFormError, [name]: undefined })
    }

    const serverDirectoryValidate = (data) => {
        const error = {}
        if (!data.name.trim()) error.name = t("validate.text.required", { name: t("common.text.name") })
        setServerDirectoryFormError(error)
        return Object.keys(error).length === 0
    }

    const entryServerDirectory = () => {
        setServerDirectoryFormError([])
        setServerDirectoryForm({ ...serverDirectoryInitial, "directory": serverCurrentDirectory.join("/") })
        ModalHelper.show("modal_server_create_directory")
    }

    const confirmCreateServerDirectory = () => {
        if (serverDirectoryValidate(serverDirectoryForm)) {
            setDialog({
                message: t("common.confirmation.create", { name: serverDirectoryForm.name }),
                type: "confirmation",
                onConfirm: (e) => createServerDirectory(e),
            })
        }
    }

    const createServerDirectory = async () => {
        if (serverDirectoryValidate(serverDirectoryForm)) {
            ModalHelper.hide("dialog_server")
            setServerDirectoryCreateLoadingFlag(true)

            try {
                const json = await apiRequest(CommonConstants.METHOD.POST, `/external/${serverId}/server-directory.json`, JSON.stringify(serverDirectoryForm))

                if (json.data.status === "success") {
                    getServerDirectory(serverId, serverDirectoryAttributeTable)
                    ModalHelper.hide("modal_server_create_directory")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setServerDirectoryFormError(error.response.data)
            } finally {
                setServerDirectoryCreateLoadingFlag(false)
            }
        }
    }

    const serverDirectoryFileInitial = {
        oldName: undefined,
        name: undefined,
        directory: undefined
    }

    const [serverDirectoryFileRenameLoadingFlag, setServerDirectoryFileRenameLoadingFlag] = useState(false)

    const [serverDirectoryFileForm, setServerDirectoryFileForm] = useState(serverDirectoryFileInitial)
    const [serverDirectoryFileFormError, setServerDirectoryFileFormError] = useState([])

    const onServerDirectoryFileFormChange = (e) => {
        const { name, value } = e.target
        setServerDirectoryFileForm({ ...serverDirectoryFileForm, [name]: value })
        setServerDirectoryFileFormError({ ...serverDirectoryFileFormError, [name]: undefined })
    }

    const serverDirectoryFileValidate = (data) => {
        const error = {}
        if (!data.name.trim()) error.name = t("validate.text.required", { name: t("common.text.name") })
        else if (data.name.trim() === data.oldName.trim()) error.name = t("validate.text.useAnother", { name: data.name.trim() })

        setServerDirectoryFileFormError(error)
        return Object.keys(error).length === 0
    }

    const entryServerDirectoryFile = (name) => {
        setServerDirectoryFileFormError([])
        setServerDirectoryFileForm({
            ...serverDirectoryFileInitial,
            "oldName": name,
            "name": name,
            "directory": serverCurrentDirectory.join("/")
        })
        ModalHelper.show("modal_server_rename_directory_file")
    }

    const copyServerDirectoryFile = () => {
        setServerDirectoryClipboard(
            {
                source: serverCurrentDirectory.join("/"),
                name: [...serverDirectoryCheckBoxTableArray]
            }
        )
        setServerDirectoryCheckBoxTableArray([])
    }

    const confirmPasteServerDirectoryFile = () => {
        if (serverDirectoryClipboard.name?.length > 0) {
            setDialog({
                message: t(
                    "common.confirmation.paste",
                    {
                        name: serverDirectoryClipboard.name?.length > 1
                            ? t("common.text.amountItem", { amount: serverDirectoryClipboard.name?.length })
                            : serverDirectoryClipboard.name[0]
                    }
                ),
                type: "warning",
                onConfirm: () => pasteServerDirectoryFile(),
            })
        } else {
            setDialog({
                message: t("validate.text.pleaseTickAtLeastAnItem"),
                type: "alert"
            })
        }
    }

    const pasteServerDirectoryFile = async () => {
        ModalHelper.hide("dialog_server")
        // if (name !== undefined && serverDirectoryCheckBoxTableArray.length > 0) {
        //     setServerDirectoryBulkOptionLoadingFlag(true)
        // }

        try {
            const json = await apiRequest(
                CommonConstants.METHOD.PATCH,
                `/external/${serverId}/server-paste-directory-file.json`,
                {
                    ...serverDirectoryClipboard,
                    destination: serverCurrentDirectory.join("/")
                }
            )
            if (json.data.status === "success") {
                getServerDirectory(serverId, serverDirectoryAttributeTable)
                // setServerDirectoryClipboard({})
            }
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            // setServerDirectoryBulkOptionLoadingFlag(false)
        }
    }

    const confirmDeleteServerDirectoryFile = (name) => {
        if (name !== undefined) {
            setDialog({
                message: t("common.confirmation.delete", { name: name }),
                type: "warning",
                onConfirm: () => deleteServerDirectoryFile(name),
            })
        } else if (serverDirectoryCheckBoxTableArray.length > 0) {
            setDialog({
                message: t(
                    "common.confirmation.delete",
                    {
                        name: serverDirectoryCheckBoxTableArray.length > 1
                            ? t("common.text.amountItem", { amount: serverDirectoryCheckBoxTableArray.length })
                            : serverDirectoryCheckBoxTableArray[0]
                    }
                ),
                type: "warning",
                onConfirm: () => deleteServerDirectoryFile(),
            })
        } else {
            setDialog({
                message: t("validate.text.pleaseTickAtLeastAnItem"),
                type: "alert"
            })
        }
    }

    const deleteServerDirectoryFile = async (name) => {
        ModalHelper.hide("dialog_server")
        if (name !== undefined && serverDirectoryCheckBoxTableArray.length > 0) {
            setServerDirectoryBulkOptionLoadingFlag(true)
        }

        try {
            const json = await apiRequest(
                CommonConstants.METHOD.PATCH,
                `/external/${serverId}/server-delete-directory-file.json`,
                {
                    "directory": serverCurrentDirectory.join("/"),
                    "name": name !== undefined ? [name] : serverDirectoryCheckBoxTableArray
                }
            )
            if (json.data.status === "success") {
                getServerDirectory(serverId, serverDirectoryAttributeTable)
                if (name !== undefined) {
                    setServerDirectoryCheckBoxTableArray(serverDirectoryCheckBoxTableArray.filter(item => item !== name))
                } else {
                    setServerDirectoryCheckBoxTableArray([])
                }
            }
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setServerDirectoryBulkOptionLoadingFlag(false)
        }
    }

    const confirmRenameServerDirectoryFile = () => {
        if (serverDirectoryFileValidate(serverDirectoryFileForm)) {
            setDialog({
                message: t("common.confirmation.rename", { name: serverDirectoryForm.oldName }),
                type: "confirmation",
                onConfirm: (e) => renameServerDirectoryFile(e),
            })
        }
    }

    const renameServerDirectoryFile = async () => {
        if (serverDirectoryFileValidate(serverDirectoryFileForm)) {
            ModalHelper.hide("dialog_server")
            setServerDirectoryFileRenameLoadingFlag(true)

            try {
                const json = await apiRequest(CommonConstants.METHOD.PATCH, `/external/${serverId}/server-rename-directory-file.json`, JSON.stringify(serverDirectoryFileForm))

                if (json.data.status === "success") {
                    getServerDirectory(serverId, serverDirectoryAttributeTable)
                    ModalHelper.hide("modal_server_rename_directory_file")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setServerDirectoryFileFormError(error.response.data)
            } finally {
                setServerDirectoryFileRenameLoadingFlag(false)
            }
        }
    }

    const serverFileInitial = {
        name: undefined,
        oldName: undefined,
        content: undefined,
        file: undefined
    }

    const [serverFileStateModal, setServerFileStateModal] = useState(CommonConstants.MODAL.ENTRY)

    const [serverFileEntryModal, setServerFileEntryModal] = useState({
        title: "",
        submitLabel: "",
        submitClass: "",
        submitIcon: "",
        submitLoadingFlag: false,
    })

    const [serverFileForm, setServerFileForm] = useState(serverFileInitial)
    const [serverFileFormError, setServerFileFormError] = useState([])

    const onServerFileFormChange = (e) => {
        const { name, value } = e.target
        setServerFileForm({ ...serverFileForm, [name]: value })
        setServerFileFormError({ ...serverFileFormError, [name]: undefined })
    }

    const serverFileValidate = (data) => {
        const error = {}
        if (!data.name.trim()) error.name = t("validate.text.required", { name: t("common.text.name") })
        if (!data.content.trim()) error.content = t("validate.text.required", { name: t("common.text.content") })
        setServerFileFormError(error)
        return Object.keys(error).length === 0
    }

    const entryServerFile = async (name) => {
        setServerFileFormError([])
        if (name) {
            setServerFileStateModal(CommonConstants.MODAL.VIEW)
            const params = {
                "name": name,
                "content": " ",
                "directory": serverCurrentDirectory.join("/")
            }
            const response = await apiRequest(CommonConstants.METHOD.GET, `/external/${serverId}/server-file.json`, params)
            const json = response.data

            setServerFileForm({
                name: name,
                content: json.data.content,
                directory: serverCurrentDirectory.join("/")
            })

            setServerFileEntryModal({
                ...serverFileEntryModal,
                title: serverForm.name,
                submitLabel: t("common.button.update"),
                submitIcon: "bi-arrow-repeat",
                submitLoadingFlag: false,
            })
        } else {
            setServerFileStateModal(CommonConstants.MODAL.ENTRY)
            setServerFileForm(serverFileInitial)
            setServerFileForm({ ...serverFileInitial, "directory": serverCurrentDirectory.join("/") })
            setServerFileEntryModal({
                ...serverFileEntryModal,
                title: t("common.text.createFile"),
                submitLabel: t("common.button.create"),
                submitIcon: "bi-plus-circle",
                submitLoadingFlag: false,
            })
        }

        ModalHelper.show("modal_server_entry_file")
    }

    const confirmStoreServerFile = () => {
        if (serverFileValidate(serverFileForm)) {
            setDialog({
                message: serverFileForm.oldName === undefined ? t("common.confirmation.create", { name: serverFileForm.name }) : t("common.confirmation.update", { name: serverFileForm.name }),
                type: "confirmation",
                onConfirm: (e) => storeServerFile(e),
            })
        }
    }

    const storeServerFile = async () => {
        if (serverFileValidate(serverFileForm)) {
            ModalHelper.hide("dialog_server")
            setServerFileEntryModal({ ...serverFileEntryModal, submitLoadingFlag: true })

            try {
                const json = await apiRequest(
                    serverFileForm.oldName === undefined ? CommonConstants.METHOD.POST : CommonConstants.METHOD.PATCH,
                    `/external/${serverId}/server-file.json`,
                    JSON.stringify(serverFileForm),
                )

                if (json.data.status === "success") {
                    getServerDirectory(serverId, serverDirectoryAttributeTable)
                    ModalHelper.hide("modal_server_entry_file")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setServerFileFormError(error.response.data)
            } finally {
                setServerFileEntryModal({ ...serverEntryModal, submitLoadingFlag: false })
            }
        }
    }

    const serverUploadFileInitial = {
        files: []
    }

    const [serverUploadFileLoadingFlag, setServerUploadFileLoadingFlag] = useState(false)

    const [serverUploadFileForm, setServerUploadFileForm] = useState(serverUploadFileInitial)
    const [serverUploadFileFormError, setServerUploadFileFormError] = useState([])

    const onServerUploadFileFormChange = (e) => {
        const { name, value } = e.target
        setServerUploadFileForm({ ...serverUploadFileForm, [name]: value })
        setServerUploadFileFormError({ ...serverUploadFileFormError, [name]: undefined })
    }

    const serverUploadFileValidate = (data) => {
        const error = {}
        if (data.files.length === 0) error.files = t("validate.text.required", { name: t("common.text.file") })
        setServerUploadFileFormError(error)
        return Object.keys(error).length === 0
    }

    const entryServerUploadFile = async () => {
        setServerUploadFileFormError([])
        setServerUploadFileForm({ ...serverUploadFileInitial, "directory": serverCurrentDirectory.join("/") })
        ModalHelper.show("modal_server_upload_file")
    }

    const confirmStoreServerUploadFile = () => {
        if (serverUploadFileValidate(serverUploadFileForm)) {
            setDialog({
                message: t("common.confirmation.upload", { name: serverUploadFileForm.length }),
                type: "confirmation",
                onConfirm: (e) => storeServerUploadFile(e),
            })
        }
    }

    const storeServerUploadFile = async () => {
        if (serverUploadFileValidate(serverUploadFileForm)) {
            ModalHelper.hide("dialog_server")
            setServerUploadFileLoadingFlag(true)

            try {
                const formData = new FormData()
                Object.keys(serverUploadFileForm).forEach(key => {
                    if (key === "files" && typeof serverUploadFileForm[key] === 'string') {

                    } else if (serverUploadFileForm[key] instanceof Array && serverUploadFileForm[key].length > 0) {
                        for (let i = 0; i < serverUploadFileForm[key].length; i++) {
                            formData.append(`${key}`, serverUploadFileForm[key][i])
                        }
                        // formData.append(key, serverUploadFileForm[key])
                    } else {
                        formData.append(key, serverUploadFileForm[key])
                    }
                })

                const json = await apiRequest(CommonConstants.METHOD.POST, `/external/${serverId}/server-upload-file.json`, formData,)

                if (json.data.status === "success") {
                    getServerDirectory(serverId, serverDirectoryAttributeTable)
                    ModalHelper.hide("modal_server_upload_file")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setServerUploadFileFormError(error.response.data)
            } finally {
                setServerUploadFileLoadingFlag(false)
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
                <div className="col-md-12 col-sm-12 col-xs-12">
                    {
                        serverShortcutMap.length > 0 &&
                        <div className="row">
                            <Select value={serverShortcutValue} map={serverShortcutMap} onChange={onServerShortcutValueChange} className="col-md-12 col-sm-12 col-xs-12"></Select>
                        </div>
                    }
                    <div className="row">
                        <div className="col-md-12 col-sm-12 col-xs-12">
                            {serverCurrentDirectory.join("/")}
                        </div>
                    </div>
                    <div className="row">
                        <Table
                            additionalButtonArray={
                                [
                                    {
                                        label: t(serverShortcutValue === 0 ? "common.button.addToShortcut" : "common.button.removeShortcut"),
                                        onClick: () => serverShortcutValue === 0 ? entryServerShortcut() : confirmDeleteServerShortcut(serverShortcutValue),
                                        icon: `${serverShortcutValue === 0 ? "bi-plus-circle" : "bi-trash"}`,
                                        className: `${serverShortcutValue === 0 ? "btn-primary" : "btn-danger"}`
                                    },
                                    {
                                        label: t("common.button.createDirectory"),
                                        onClick: () => entryServerDirectory(),
                                        icon: "bi-plus-circle",
                                    },
                                    {
                                        label: t("common.button.addFile"),
                                        onClick: () => entryServerFile(),
                                        icon: "bi-plus-square",
                                    },
                                    {
                                        label: t("common.button.upload"),
                                        onClick: () => entryServerUploadFile(),
                                        icon: "bi-upload",
                                    },
                                    (
                                        serverDirectoryClipboard.name?.length > 0
                                            ? {
                                                label: `${t("common.button.paste")} (${serverDirectoryClipboard.name.length})`,
                                                onClick: () => confirmPasteServerDirectoryFile(),
                                                icon: "bi-file-earmark",
                                            }
                                            : {}
                                    )
                                ]
                            }

                            bulkOptionLoadingFlag={serverDirectoryBulkOptionLoadingFlag}
                            bulkOptionArray={[
                                {
                                    label: t("common.button.copy"),
                                    icon: "bi-copy",
                                    onClick: () => copyServerDirectoryFile(),
                                },
                                {
                                    label: t("common.button.delete"),
                                    icon: "bi-trash",
                                    onClick: () => confirmDeleteServerDirectoryFile(),
                                }
                            ]}

                            dataArray={[{ name: ".:Up:.", goToParentFlag: true }, ...serverDirectoryDataArray]}
                            columns={[
                                {
                                    data: "name",
                                    name: t("common.text.name"),
                                    class: "text-nowrap",
                                    orderable: true,
                                    minDevice: CommonConstants.DEVICE.MOBILE,
                                    render: (data, row) => {
                                        if (row.goToParentFlag) {
                                            return (
                                                <label role="button" onClick={goToParent}>
                                                    <i className="bi-arrow-90deg-up" />&nbsp;&nbsp;{data}
                                                </label>
                                            )
                                        } else {
                                            return (
                                                <>
                                                    <label role="button" onClick={() => row.directoryFlag ? enterFolder(data) : entryServerFile(data)}>
                                                        <i className={`${row.directoryFlag ? "bi-folder-fill" : "bi-file"}`} />&nbsp;&nbsp;{data}
                                                    </label>
                                                    &nbsp;|&nbsp;<label className="sm-1" role="button" onClick={() => entryServerDirectoryFile(data)}>
                                                        <i className="bi-arrow-repeat" />
                                                    </label>
                                                    &nbsp;<label className="sm-1" role="button" onClick={() => confirmDeleteServerDirectoryFile(data)}>
                                                        <i className="bi-trash" />
                                                    </label>
                                                </>
                                            )
                                        }
                                    }
                                },
                                {
                                    data: "size",
                                    name: t("common.text.size"),
                                    class: "text-nowrap",
                                    orderable: true,
                                    minDevice: CommonConstants.DEVICE.MOBILE,
                                    render: (data, row) => {
                                        if (row.goToParentFlag) {
                                            return ""
                                        } else {
                                            return data
                                        }
                                    }
                                },
                                {
                                    data: "createdDate",
                                    name: t("common.text.modifiedDate"),
                                    class: "text-nowrap",
                                    orderable: true,
                                    minDevice: CommonConstants.DEVICE.TABLET,
                                    render: (data, row) => {
                                        if (row.goToParentFlag) {
                                            return ""
                                        } else {
                                            return DateHelper.formatDate(new Date(data), "dd MMM yyyy HH:mm:ss")
                                        }
                                    }
                                },
                                // {
                                //     data: "ownerName",
                                //     name: t("common.text.owner"),
                                //     class: "text-nowrap",
                                //     minDevice: CommonConstants.DEVICE.DESKTOP,
                                // },
                                // {
                                //     data: "groupName",
                                //     name: t("common.text.group"),
                                //     class: "text-nowrap",
                                //     minDevice: CommonConstants.DEVICE.DESKTOP,
                                // },
                                {
                                    data: "mode",
                                    name: t("common.text.permission"),
                                    class: "text-nowrap",
                                    minDevice: CommonConstants.DEVICE.TABLET,
                                    render: (data, row) => {
                                        if (row.goToParentFlag) {
                                            return ""
                                        } else {
                                            return data.toString(8)
                                        }
                                    }
                                }
                            ]}

                            checkBoxArray={serverDirectoryCheckBoxTableArray}
                            onCheckBox={serverDirectoryCheckBoxTableArray => { setServerDirectoryCheckBoxTableArray([...serverDirectoryCheckBoxTableArray]) }}
                            dataTotal={serverDirectoryDataTotalTable}
                            resetPagination={serverDirectoryResetPaginationTable}
                            onRender={(page, length, search, order) => {
                                if (serverId >= 0) {
                                    getServerDirectoryRender({ page: page, length: length, search: search, order: order })
                                }
                            }}

                            loadingFlag={serverDirectoryTableLoadingFlag}
                        />
                    </div >
                </div>
            </Modal>
            <Modal
                id="modal_server_create_shortcut"
                size="md"
                title={t("common.text.createShortcut")}
                buttonArray={
                    <>
                        <Button
                            label={t("common.button.create")}
                            onClick={() => confirmCreateServerShortcut()}
                            className="btn-primary"
                            icon="bi-plus-circle"
                            loadingFlag={serverShortcutCreateLoadingFlag}
                        />
                    </>
                }
            >
                <InputText label={t("common.text.shortcutName")} name="name" value={serverShortcutForm.name} onChange={onServerShortcutFormChange} className="col-md-12 col-sm-12 col-xs-12" error={serverShortcutFormError.name} />
            </Modal>
            <Modal
                id="modal_server_create_directory"
                size="md"
                title={t("common.text.createDirectory")}
                buttonArray={
                    <>
                        <Button
                            label={t("common.button.create")}
                            onClick={() => confirmCreateServerDirectory()}
                            className="btn-primary"
                            icon="bi-plus-circle"
                            loadingFlag={serverDirectoryCreateLoadingFlag}
                        />
                    </>
                }
            >
                <InputText label={t("common.text.directoryName")} name="name" value={serverDirectoryForm.name} onChange={onServerDirectoryFormChange} className="col-md-12 col-sm-12 col-xs-12" error={serverDirectoryFormError.name} />
            </Modal>
            <Modal
                id="modal_server_rename_directory_file"
                size="md"
                title={t("common.text.rename")}
                buttonArray={
                    <>
                        <Button
                            label={t("common.button.rename")}
                            onClick={() => confirmRenameServerDirectoryFile()}
                            className="btn-primary"
                            icon="bi-refresh"
                            loadingFlag={serverDirectoryFileRenameLoadingFlag}
                        />
                    </>
                }
            >
                <InputText label={t("common.text.name")} name="name" value={serverDirectoryFileForm.name} onChange={onServerDirectoryFileFormChange} className="col-md-12 col-sm-12 col-xs-12" error={serverDirectoryFileFormError.name} />
            </Modal>
            <Modal
                id="modal_server_entry_file"
                size="xl"
                title={serverFileEntryModal.title}
                buttonArray={
                    <Button
                        label={serverFileEntryModal.submitLabel}
                        onClick={() => confirmStoreServerFile()}
                        className="btn-primary"
                        icon={serverFileEntryModal.submitIcon}
                        loadingFlag={serverFileEntryModal.submitLoadingFlag}
                    />
                }
            >
                {
                    CommonConstants.MODAL.ENTRY === serverFileStateModal &&
                    <InputText label={t("common.text.fileName")} name="name" value={serverFileForm.name} onChange={onServerFileFormChange} className="col-md-12 col-sm-12 col-xs-12" error={serverFileFormError.name} />
                }
                <Textarea label={t("common.text.content")} name="content" rows={10} value={serverFileForm.content} onChange={onServerFileFormChange} className="col-md-12 col-sm-12 col-xs-12" error={serverFileFormError.content} />
            </Modal>
            <Modal
                id="modal_server_upload_file"
                size="md"
                title={t("common.button.upload")}
                buttonArray={
                    <Button
                        label={t("common.button.upload")}
                        onClick={() => confirmStoreServerUploadFile()}
                        className="btn-primary"
                        icon="bi-upload"
                        loadingFlag={serverUploadFileLoadingFlag}
                    />
                }
            >
                <InputFile label={t("common.text.file")} name="files" value={serverUploadFileForm.files} onChange={onServerUploadFileFormChange} className="col-md-12 col-sm-12 col-xs-12" error={serverUploadFileFormError.files} />
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