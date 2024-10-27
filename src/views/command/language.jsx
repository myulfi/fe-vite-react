import { useState, useEffect, Fragment } from "react"
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
import Dropdown from "../../components/dropdown"
import Label from "../../components/form/label"
import InputText from "../../components/form/inputText"

export default function Language() {
    const { t } = useTranslation()
    const languageInitial = {
        code: "common.text",
        key: "",
        version: 0,
    }

    const [languageStateModal, setLanguageStateModal] = useState(CommonConstants.MODAL.ENTRY)

    const [implementLoadingFlag, setImplementLoadingFlag] = useState(false)

    const [languageBulkOptionLoadingFlag, setLanguageBulkOptionLoadingFlag] = useState(false)
    const [languageCheckBoxTableArray, setLanguageCheckBoxTableArray] = useState([])
    const [languageOptionColumnTable, setLanguageOptionColumnTable] = useState([])
    const [languageAttributeTable, setLanguageAttributeTable] = useState()
    const [languageDataTotalTable, setLanguageDataTotalTable] = useState(0)
    const [languageTableLoadingFlag, setLanguageTableLoadingFlag] = useState(false)

    const [languageArray, setLanguageArray] = useState([])

    const [languageEntryModal, setLanguageEntryModal] = useState({
        title: "",
        submitLabel: "",
        submitClass: "",
        submitIcon: "",
        submitLoadingFlag: false,
    })

    const [languageForm, setLanguageForm] = useState(languageInitial)
    const [languageFormError, setLanguageFormError] = useState([])

    const onLanguageFormChange = (e) => {
        const { name, value } = e.target
        setLanguageForm({ ...languageForm, [name]: value })
        setLanguageFormError({ ...languageFormError, [name]: undefined })
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
    const codeKeyMap = [
        { "key": "common.text", "value": "common.text." },
        { "key": "common.button", "value": "common.button." },
        { "key": "common.confirmation", "value": "common.confirmation." },
        { "key": "common.information", "value": "common.information." },
        { "key": "common.menu", "value": "common.menu." },
        { "key": "validate.text", "value": "validate.text." },
        { "key": "datatable.text", "value": "datatable.text." },
    ]

    const languageValidate = (data) => {
        const error = {}
        // if (!data.name.trim()) error.name = t("validate.text.required", { name: t("common.text.name") })
        // if (!data.description.trim()) error.description = t("validate.text.required", { name: t("common.text.description") })
        // if (data.value <= 0) error.value = t("validate.text.required", { name: t("common.text.value") })

        // if (!data.email.trim()) error.email = t("validate.text.required", { name: t("common.text.email") })
        // else if (!/\S+@\S+\.\S+/.test(data.email)) error.email = t("validate.text.invalid", { name: t("common.text.email") })
        setLanguageFormError(error)
        return Object.keys(error).length === 0
    }

    const [toast, setToast] = useState({})
    useEffect(() => {
        if (toast?.message !== undefined) {
            ToastHelper.show("toast_language")
        }
    }, [toast])

    const [dialog, setDialog] = useState({})
    useEffect(() => {
        if (dialog?.message !== undefined) {
            ModalHelper.show("dialog_language")
        }
    }, [dialog])

    useEffect(() => { getMasterLanguage() }, [])

    const [masterLanguageArray, setMasterLanguageArray] = useState([])
    const getMasterLanguage = async () => {
        try {
            const response = await apiRequest(CommonConstants.METHOD.GET, `/master/language.json`)
            setMasterLanguageArray(response.data.data.map(object => { return { "key": object["id"], "value": object["name"] } }))
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        }
    }

    const getLanguage = async (options) => {
        setLanguageTableLoadingFlag(true)

        try {
            const params = {
                "start": (options.page - 1) * options.length,
                "length": options.length,
                "search": encodeURIComponent(options.search),
                "orderColumn": options.order.length > 1 ? options.order[0] : null,
                "orderDir": options.order.length > 1 ? options.order[1] : null,
            }
            setLanguageAttributeTable(options)

            const response = await apiRequest(CommonConstants.METHOD.GET, "/command/language.json", params)
            const json = response.data
            setLanguageArray(json.data)
            setLanguageDataTotalTable(json.recordsTotal)
            setLanguageOptionColumnTable(
                json.data.reduce(function (map, obj) {
                    //map[obj.id] = obj.name
                    map[obj.id] = { "viewedButtonFlag": false, "deletedButtonFlag": false }
                    return map
                }, {})
            )
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setLanguageTableLoadingFlag(false)
        }
    }

    const viewLanguage = async (id) => {
        setLanguageForm(languageInitial)
        if (id !== undefined) {
            setLanguageStateModal(CommonConstants.MODAL.VIEW)
            setLanguageOptionColumnTable({ ...languageOptionColumnTable, [id]: { viewedButtonFlag: true } })
            try {
                const response = await apiRequest(CommonConstants.METHOD.GET, `/command/${id}/language.json`)

                const language = response.data.data
                const data = {
                    id: language.id,
                    code: `${language.screenCode}.${language.labelType}`,
                    key: language.keyCode,
                    version: language.version,
                }

                for (let i = 0; i < language.languageValueList.length; i++) {
                    data[`value_${language.languageValueList[i].languageId}`] = language.languageValueList[i].value
                }

                setLanguageForm(data)

                setLanguageEntryModal({
                    ...languageEntryModal,
                    title: language.name,
                    submitLabel: t("common.button.edit"),
                    submitIcon: "bi-pencil",
                    submitLoadingFlag: false,
                })

                ModalHelper.show("modal_language")
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
            } finally {
                setLanguageOptionColumnTable({ ...languageOptionColumnTable, [id]: { viewedButtonFlag: false } })
            }
        }
    }

    const entryLanguage = (haveContentFlag) => {
        setLanguageStateModal(CommonConstants.MODAL.ENTRY)
        setLanguageFormError([])
        if (haveContentFlag) {
            setLanguageEntryModal({
                ...languageEntryModal,
                title: languageForm.name,
                submitLabel: t("common.button.update"),
                submitIcon: "bi-arrow-repeat",
                submitLoadingFlag: false,
            })
        } else {
            setLanguageForm(languageInitial)
            setLanguageEntryModal({
                ...languageEntryModal,
                title: t("common.button.createNew"),
                submitLabel: t("common.button.save"),
                submitIcon: "bi-bookmark",
                submitLoadingFlag: false,
            })
            ModalHelper.show("modal_language")
        }
    }

    const confirmStoreLanguage = () => {
        if (languageValidate(languageForm)) {
            setDialog({
                message: languageForm.id === undefined ? t("common.confirmation.create", { name: languageForm.key }) : t("common.confirmation.update", { name: languageForm.key }),
                type: "confirmation",
                onConfirm: (e) => storeLanguage(e),
            })
        }
    }

    const storeLanguage = async () => {
        if (languageValidate(languageForm)) {
            ModalHelper.hide("dialog_language")
            setLanguageEntryModal({ ...languageEntryModal, submitLoadingFlag: true })

            try {
                const data = {}
                data.screenCode = languageForm.code.split(".")[0]
                data.labelType = languageForm.code.split(".")[1]
                data.keyCode = languageForm.key
                data.version = languageForm.version
                data.languageValueList = new Array(masterLanguageArray.length)
                for (let i = 0; i < masterLanguageArray.length; i++) {
                    data.languageValueList[i] = {
                        languageId: masterLanguageArray[i].key,
                        value: languageForm[`value_${masterLanguageArray[i].key}`]
                    }
                }

                const json = await apiRequest(
                    languageForm.id === undefined ? CommonConstants.METHOD.POST : CommonConstants.METHOD.PATCH,
                    languageForm.id === undefined ? '/command/language.json' : `/command/${languageForm.id}/language.json`,
                    JSON.stringify(data),
                )

                if (json.data.status === "success") {
                    getLanguage(languageAttributeTable)
                    ModalHelper.hide("modal_language")
                }
                setToast({ type: json.data.status, message: json.data.message })
            } catch (error) {
                setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
                setLanguageFormError(error.response.data)
            } finally {
                setLanguageEntryModal({ ...languageEntryModal, submitLoadingFlag: false })
            }
        }
    }

    const implementLanguage = async () => {
        try {
            setImplementLoadingFlag(true)
            const json = await apiRequest(CommonConstants.METHOD.PUT, "/command/implement-language.json")
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            setImplementLoadingFlag(false)
        }
    }

    const confirmDeleteLanguage = (id, name) => {
        if (id !== undefined) {
            setDialog({
                message: t("common.confirmation.delete", { name: name }),
                type: "warning",
                onConfirm: () => deleteLanguage(id),
            })
        } else {
            if (languageCheckBoxTableArray.length > 0) {
                setDialog({
                    message: t("common.confirmation.delete", { name: t("common.text.amountItem", { amount: languageCheckBoxTableArray.length }) }),
                    type: "warning",
                    onConfirm: () => deleteLanguage(),
                })
            } else {
                setDialog({
                    message: t("validate.text.pleaseTickAtLeastAnItem"),
                    type: "alert"
                })
            }
        }
    }

    const deleteLanguage = async (id) => {
        ModalHelper.hide("dialog_language")
        if (id !== undefined) {
            setLanguageOptionColumnTable({ ...languageOptionColumnTable, [id]: { deletedButtonFlag: true } })
        } else {
            setLanguageBulkOptionLoadingFlag(true)
        }

        try {
            const json = await apiRequest(CommonConstants.METHOD.DELETE, `/command/${id !== undefined ? id : languageCheckBoxTableArray.join("")}/language.json`)
            if (json.data.status === "success") {
                getLanguage(languageAttributeTable)
                if (id === undefined) {
                    setLanguageCheckBoxTableArray([])
                }
            }
            setToast({ type: json.data.status, message: json.data.message })
        } catch (error) {
            setToast({ type: "failed", message: error.response?.data?.message ?? error.message })
        } finally {
            if (id !== undefined) {
                setLanguageOptionColumnTable({ ...languageOptionColumnTable, [id]: { deletedButtonFlag: false } })
            } else {
                setLanguageBulkOptionLoadingFlag(false)
            }
        }
    }

    return (
        <div className="container mt-4 mb-4">
            <Modal
                id="modal_language"
                size="md"
                title={languageEntryModal.title}
                buttonArray={
                    <>
                        {
                            CommonConstants.MODAL.ENTRY === languageStateModal
                            && <Button
                                label={languageEntryModal.submitLabel}
                                onClick={() => confirmStoreLanguage()}
                                className="btn-primary"
                                icon={languageEntryModal.submitIcon}
                                loadingFlag={languageEntryModal.submitLoadingFlag}
                            />
                        }
                        {
                            CommonConstants.MODAL.VIEW === languageStateModal
                            && <Button
                                label={languageEntryModal.submitLabel}
                                onClick={() => entryLanguage(true)}
                                className="btn-primary"
                                icon={languageEntryModal.submitIcon}
                                loadingFlag={false}
                            />
                        }
                    </>

                }
            >
                {
                    CommonConstants.MODAL.ENTRY === languageStateModal
                    && <>
                        <InputText
                            label={t("common.text.key")}
                            name="key"
                            value={languageForm.key}
                            positionUnit={"left"}
                            onChange={onLanguageFormChange}
                            nameUnit="code"
                            valueUnit={languageForm.code}
                            valueUnitList={codeKeyMap}
                            onChangeUnit={onLanguageFormChange}
                            className="col-md-12 col-sm-12 col-xs-12"
                            error={languageFormError.name} />
                        {
                            masterLanguageArray.map((column, index) => (
                                <InputText key={index} label={column.value} name={`value_${column.key}`} value={languageForm[`value_${column.key}`]} onChange={onLanguageFormChange} className="col-md-6 col-sm-6 col-xs-12" error={languageFormError[`value_${column.key}`]} />
                            ))
                        }
                    </>
                }
                {
                    CommonConstants.MODAL.VIEW === languageStateModal
                    && <>
                        <Label text={t("common.text.key")} value={`${languageForm.code}.${languageForm.key}`} className="col-md-12 col-sm-12 col-xs-12" />
                        {
                            masterLanguageArray.map((column, index) => (
                                <Label key={index} text={column.value} value={languageForm[`value_${column.key}`]} className="col-md-6 col-sm-6 col-xs-12" />
                            ))
                        }
                    </>
                }
            </Modal>
            <Dialog id="dialog_language" type={dialog.type} message={dialog.message} onConfirm={dialog.onConfirm} />
            <Toast id="toast_language" type={toast.type} message={toast.message} />
            <div className="row"><h3><span className="bi-puzzle">&nbsp;{t("common.menu.language")}</span></h3></div>
            <div className="row">
                <div className="col-md-12">
                    <div className="card border-0 rounded shadow">
                        <div className="card-body">
                            <Table
                                labelNewButton={t("common.button.createNew")}
                                onNewButtonClick={() => entryLanguage(false)}

                                additionalButtonArray={[
                                    {
                                        label: t("common.button.implement"),
                                        onClick: () => implementLanguage(),
                                        icon: "bi-gear-fill",
                                        loadingFlag: implementLoadingFlag
                                    }
                                ]}

                                bulkOptionLoadingFlag={languageBulkOptionLoadingFlag}
                                bulkOptionArray={
                                    <Dropdown label={t("common.button.delete")} icon="bi-trash" onClick={() => confirmDeleteLanguage()} />
                                }

                                dataArray={languageArray}
                                columns={[
                                    {
                                        data: "id",
                                        name: t("common.text.code"),
                                        class: "text-nowrap",
                                        minDevice: CommonConstants.DEVICE.MOBILE,
                                        render: function (_, row) {
                                            return `${row.screenCode}.${row.labelType}.${row.keyCode}`
                                        }
                                    },
                                    {
                                        data: "id",
                                        name: t("common.text.english"),
                                        class: "text-nowrap",
                                        minDevice: CommonConstants.DEVICE.TABLET,
                                        render: function (_, row) {
                                            return row.languageValueList.find((languageValue) => languageValue.languageId === 1)?.value
                                        }
                                    },
                                    {
                                        data: "id",
                                        name: t("common.text.bahasa"),
                                        class: "text-nowrap",
                                        minDevice: CommonConstants.DEVICE.TABLET,
                                        render: function (_, row) {
                                            return row.languageValueList.find((languageValue) => languageValue.languageId === 2)?.value
                                        }
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
                                                        onClick={() => viewLanguage(data)}
                                                        className="btn-primary"
                                                        icon="bi-list-ul"
                                                        loadingFlag={languageOptionColumnTable[data]?.viewedButtonFlag}
                                                    />
                                                    <Button
                                                        label={t("common.button.delete")}
                                                        onClick={() => confirmDeleteLanguage(data, row.keyCode)}
                                                        className="btn-danger"
                                                        icon="bi-trash"
                                                        loadingFlag={languageOptionColumnTable[data]?.deletedButtonFlag}
                                                    />
                                                </>
                                            )
                                        }
                                    }
                                ]}
                                order={[[3, "desc"]]}

                                checkBoxArray={languageCheckBoxTableArray}
                                onCheckBox={languageCheckBoxTableArray => { setLanguageCheckBoxTableArray([...languageCheckBoxTableArray]) }}
                                dataTotal={languageDataTotalTable}
                                onRender={(page, length, search, order) => { getLanguage({ page: page, length: length, search: search, order: order }) }}
                                loadingFlag={languageTableLoadingFlag}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}