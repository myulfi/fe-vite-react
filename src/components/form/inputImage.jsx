import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

export default function InputImage({
    label,
    name,
    value,
    orientation = "potrait",
    onChange,
    className,
    error,
}) {
    const { t } = useTranslation()
    const fileInputRef = useRef(null)
    useEffect(() => {
        setImageStyle({
            ...imageStyle,
            backgroundImage: value !== null ? `url(${value})` : null
        })

        if (value === null) fileInputRef.current.value = ""
    }, [value])

    const [imageStyle, setImageStyle] = useState({
        width: "100%",
        aspectRatio: "potrait" === orientation ? "1/1" : "3/1",
        backgroundSize: "contain",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundColor: "#f0f0f0",
        display: "flex",
        fontSize: "18px",
        color: "#555",
    })

    function compressImage(file, callback) {
        const reader = new FileReader()

        reader.onload = function (event) {
            const img = new Image()

            img.onload = function () {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')

                // Set canvas dimensions equal to the image
                canvas.width = img.width
                canvas.height = img.height

                // Draw the image onto the canvas
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height)

                // Compress the image to 50% quality
                canvas.toBlob(
                    (blob) => {
                        callback(blob) // Call the callback with the compressed image Blob
                    },
                    'image/jpeg',
                    //0.5 // Set compression quality from 0 (worst) to 1 (best)
                    2000000 / file.size
                )
            }

            img.src = event.target.result
        }

        reader.readAsDataURL(file)
    }

    const previewImage = (event) => {
        const file = event.target.files[0]
        if (file) {

            if (file.size > 2000000) {
                compressImage(file, (compressedBlob) => {
                    // Use the compressedBlob for upload or other processing
                    // console.log(compressedBlob)
                    onChange({
                        target: {
                            name: name,
                            value: compressedBlob,
                        }
                    })
                    const reader = new FileReader()
                    reader.onload = function () {
                        setImageStyle({
                            ...imageStyle,
                            backgroundImage: `url(${reader.result})`
                        })
                    }
                    reader.readAsDataURL(compressedBlob)
                })
            } else {
                onChange({
                    target: {
                        name: name,
                        value: file,
                    }
                })
                const reader = new FileReader()
                reader.onload = function () {
                    setImageStyle({
                        ...imageStyle,
                        backgroundImage: `url(${reader.result})`
                    })
                }
                reader.readAsDataURL(file)
            }
        }
    }

    const onClickInput = () => fileInputRef.current.click()

    const removeImage = () => {
        onChange({
            target: {
                name: name,
                value: null,
            }
        })

        setImageStyle({
            ...imageStyle,
            backgroundImage: ""
        })

        fileInputRef.current.value = ""
    }

    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <div
                style={imageStyle}
                onClick={value === null ? onClickInput : null}
                role={value === null ? "button" : null}
            >
                {
                    value !== null &&
                    <div className="mt-auto ms-auto">
                        {/* <span role="button" className="bi-eye link-primary mx-2" onClick={viewImage}></span> */}
                        <span role="button" className="bi-trash link-primary mx-2" onClick={removeImage}></span>
                    </div>
                }
                {
                    value === null &&
                    <div className="m-auto">
                        <div className="bi-plus-circle text-center"></div>
                        {t("common.text.inputName", { name: label })}
                    </div>
                }
            </div>
            <input className="d-none" ref={fileInputRef} name={name} type="file" accept="image/*" onChange={previewImage} />
            {error && <small className="text-danger mt-1 px-1">{error}</small>}
        </div>
    )
}