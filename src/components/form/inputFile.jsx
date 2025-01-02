import { useEffect, useRef, useState } from "react"
import { useTranslation } from "react-i18next"

export default function InputFile({
    label,
    name,
    value,
    onChange,
    className,
    error,
}) {
    const { t } = useTranslation()
    const [files, setFiles] = useState([])
    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const droppedFiles = Array.from(e.dataTransfer.files);

        // Check for file limit (e.g., max 5 files)
        if (
            droppedFiles.length
            //  + files.length > 5
            + value.length
            > 5
        ) {
            setErrorMessage('You can only upload up to 5 files');
            return;
        }

        onChange({
            target: {
                name: name,
                value: [...value, ...droppedFiles]
            }
        })
        // setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
        // setErrorMessage('');
    }

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // Check for file limit (e.g., max 5 files)
        if (
            selectedFiles.length
            // + files.length
            + value.length
            > 5
        ) {
            setErrorMessage('You can only upload up to 5 files');
            return;
        }

        // setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
        onChange({
            target: {
                name: name,
                value: [...value, ...selectedFiles]
            }
        })
        // setErrorMessage('');
    }

    const removeFile = (index) => {
        // setFiles(files.filter((_, i) => i !== index));
        onChange({
            target: {
                name: name,
                value: value.filter((_, i) => i !== index)
            }
        })
    };

    const fileInputRef = useRef(null)
    const onClickInput = () => fileInputRef.current.click()
    // useEffect(() => {
    //     setImageStyle({
    //         ...imageStyle,
    //         backgroundImage: value !== null ? `url(${value})` : null
    //     })

    //     if (value === null) fileInputRef.current.value = ""
    // }, [value])

    const [imageStyle, setImageStyle] = useState({
        border: '2px dashed #6c757f',
        padding: '30px',
        textAlign: 'center',
        cursor: 'pointer',
        // width: "100%",
        // aspectRatio: "1/1",
        // backgroundSize: "contain",
        // backgroundPosition: "center",
        // backgroundRepeat: "no-repeat",
        // backgroundColor: "#f0f0f0",
        // display: "flex",
        // fontSize: "18px",
        // color: "#555",
    })

    return (
        <div className={`form-group mb-3 ${className}`}>
            <label className="form-label fw-bold">{label}</label>
            <div
                style={imageStyle}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onClick={onClickInput}
            >
                <h4>Drag & Drop files here, or click to select files</h4>
                <p>Only images, PDFs, and DOCX files are allowed</p>
            </div>
            <input className="d-none" ref={fileInputRef} name={name} type="file" multiple onChange={handleFileSelect} id="file-upload" />

            {error && <small className="text-danger mt-1 px-1">{error}</small>}
            <div style={{ marginTop: '20px' }}>
                {value.length > 0 && (
                    <ul>
                        {value.map((file, index) => (
                            <li key={index}>
                                {file.name}
                                <button
                                    onClick={() => removeFile(index)}
                                    style={{
                                        marginLeft: '10px',
                                        backgroundColor: '#f44336',
                                        color: 'white',
                                        border: 'none',
                                        cursor: 'pointer',
                                        padding: '5px 10px',
                                    }}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* {files.length > 0 && (
                <button
                    onClick={() => alert('Files ready for upload')}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        padding: '10px 20px',
                        border: 'none',
                        cursor: 'pointer',
                        marginTop: '20px',
                    }}
                >
                    Upload Files
                </button>
            )} */}
        </div>
    )
}